#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { createRequire } from 'module';

// Create a require function for ES modules
const require = createRequire(import.meta.url);

// Check if xmind-generator is installed
let xmindGeneratorInstalled = false;
try {
  // Try to require the package instead of using npm list
  require.resolve('xmind-generator');
  xmindGeneratorInstalled = true;
  // xmind-generator package found
} catch (error) {
  console.error('xmind-generator package not found in Node.js module resolution paths.');
  console.error('Current module paths:');
  console.error(module.paths.join('\n'));
  console.error('Please run: npm install xmind-generator@1.0.1 --save in the project directory');
  // Don't exit immediately to allow the error to be reported back to the client
  // process.exit(1);
}

// Create a temporary directory for storing generated XMind files
const TEMP_DIR = path.join(os.tmpdir(), 'xmind-generator-mcp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Define the schema for our mind map generation tool
const RelationshipSchema = z.object({
  title: z.string().describe('The title of the relationship'),
  from: z.string().describe('The reference ID of the source topic'),
  to: z.string().describe('The reference ID of the target topic')
});

const TopicSchema: z.ZodType<any> = z.lazy(() => z.object({
  title: z.string().describe('The title of the topic'),
  ref: z.string().optional().describe('Optional reference ID for the topic'),
  note: z.string().optional().describe('Optional note for the topic'),
  labels: z.array(z.string()).optional().describe('Optional array of labels for the topic'),
  markers: z.array(z.string()).optional().describe('Optional array of markers for the topic (format: "Category.name", e.g., "Arrow.refresh")'),
  children: z.array(TopicSchema).optional().describe('Optional array of child topics'),
  relationships: z.array(RelationshipSchema).optional().describe('Optional array of relationships for the topic')
}));

const GenerateMindMapSchema = z.object({
  title: z.string().describe('The title of the mind map (root topic)'),
  topics: z.array(TopicSchema).describe('Array of topics to include in the mind map'),
  filename: z.string().describe('The filename for the XMind file (without path or extension)'),
  outputPath: z.string().optional().describe('Optional custom output path for the XMind file. If not provided, the file will be created in the temporary directory.'),
  relationships: z.array(RelationshipSchema).optional().describe('Optional array of relationships between topics')
});

type TopicData = z.infer<typeof TopicSchema>;
type GenerateMindMapParams = z.infer<typeof GenerateMindMapSchema>;



// Create server instance
const server = new McpServer({
  name: 'xmind-generator',
  version: '0.1.0'
});

// Register the generate-mind-map tool
server.tool(
  'generate-mind-map',
  GenerateMindMapSchema.shape,
  async (params: GenerateMindMapParams) => {
    try {
      // Check if xmind-generator is available
      if (!xmindGeneratorInstalled) {
        return {
          content: [{
            type: 'text',
            text: 'The xmind-generator package is not properly installed. Please run: npm install xmind-generator@1.0.1 --save in the project directory.'
          }],
          isError: true
        };
      }

      // Import xmind-generator using the require function
      const xmindGenerator = require('xmind-generator');
      const { Topic, RootTopic, Workbook, writeLocalFile } = xmindGenerator;

      // Define the output path using the required filename parameter
      // Sanitize the filename to ensure it's valid for both Windows and Unix systems
      // Only filter out truly invalid characters: \ / : * ? " < > |
      const sanitizedFilename = params.filename.replace(/[\\/:*?"<>|]/g, '-');

      // Get output path with priority:
      // 1. Parameter provided in the tool call (params.outputPath)
      // 2. Environment variable (process.env.outputPath)
      // 3. Default temporary directory (TEMP_DIR)
      const baseOutputPath = params.outputPath || process.env.outputPath || TEMP_DIR;

      // If baseOutputPath is a directory, append the filename
      // If it's a file path (has extension), use it directly
      let outputPath: string;
      if (baseOutputPath.endsWith('.xmind')) {
        outputPath = baseOutputPath;
      } else {
        // Assume it's a directory path
        outputPath = path.join(baseOutputPath, `${sanitizedFilename}.xmind`);
      }

      // Ensure the output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Create root topic
      const rootTopic = RootTopic(params.title);

      // Add relationships if provided
      if (params.relationships && params.relationships.length > 0) {
        rootTopic.relationships(params.relationships.map(rel => {
          return xmindGenerator.Relationship(rel.title, { from: rel.from, to: rel.to });
        }));
      }

      // Helper function to build topics recursively
      function buildTopic(topicData: TopicData) {
        const topic = Topic(topicData.title);

        if (topicData.ref) {
          topic.ref(topicData.ref);
        }

        if (topicData.note) {
          topic.note(topicData.note);
        }

        if (topicData.labels && topicData.labels.length > 0) {
          topic.labels(topicData.labels);
        }

        if (topicData.markers && topicData.markers.length > 0) {
          // Convert marker strings to Marker objects
          const markers = topicData.markers.map((markerStr: string) => {
            const [category, name] = markerStr.split('.');
            return xmindGenerator.Marker[category]?.[name] || markerStr;
          });
          topic.markers(markers);
        }

        if (topicData.children && topicData.children.length > 0) {
          const children = topicData.children.map((child: TopicData) => buildTopic(child));
          topic.children(children);
        }

        return topic;
      }

      // Build children
      if (params.topics && params.topics.length > 0) {
        const children = params.topics.map((topic: TopicData) => buildTopic(topic));
        rootTopic.children(children);
      }

      // Create workbook
      const workbook = Workbook(rootTopic);

      // Write to file
      writeLocalFile(workbook, outputPath);

      // Check if we should automatically open the generated file
      // Default to true if environment variable is not set
      const autoOpenFile = process.env.autoOpenFile !== 'false';

      if (autoOpenFile) {
        // Open the generated file with default application
        const platform = process.platform;
        const openCommand = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';

        exec(`${openCommand} "${outputPath}"`, (error) => {
          if (error) {
            console.error('Error opening file:', error);
          }
        });
      }

      return {
        content: [{
          type: 'text',
          text: `Mind map successfully generated and saved to: ${outputPath}`
        }]
      };
    } catch (error) {
      console.error('Error generating mind map:', error);
      return {
        content: [{
          type: 'text',
          text: `Error generating mind map: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);




// Create a transport using standard IO for server communication
const transport = new StdioServerTransport();

// Get environment configuration
const envOutputPath = process.env.outputPath;
const envAutoOpenFile = process.env.autoOpenFile;

// Connect the server to the transport
server.connect(transport).then(() => {
  // Server started successfully
}).catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
