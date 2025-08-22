<!--
 * @Author: yilin lnj030210@163.com
 * @Date: 2025-08-22 16:27:41
 * @LastEditors: yilin lnj030210@163.com
 * @LastEditTime: 2025-08-22 16:28:46
 * @FilePath: /xmind-generator-mcp/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
  # @liyilin/xmind-generator-mcp

  An enhanced MCP (Model Context Protocol) server for generating Xmind mind maps. This server allows Claude Desktop and other MCP clients
  to create structured mind maps.

  ## Features

  - 🧠 Generate Xmind mind maps with hierarchical topic structures
  - 📝 Support for topic notes, labels, and markers
  - 💾 Save mind maps to local files
  - 🔧 Easy integration with Claude Desktop
  - 🎨 Auto-open generated files

  ## Installation

  ### Option 1: Using npx (Recommended)

  ```json
  {
    "mcpServers": {
      "xmind-generator": {
        "command": "npx",
        "args": ["@liyilin/xmind-generator-mcp"],
        "env": {
          "outputPath": "/path/to/save/xmind/files",
          "autoOpenFile": "true"
        }
      }
    }
  }

  Option 2: Global Installation

  npm install -g @liyilin/xmind-generator-mcp

  Then configure Claude Desktop:
  {
    "mcpServers": {
      "xmind-generator": {
        "command": "liyilin-xmind-mcp",
        "env": {
          "outputPath": "/path/to/save/xmind/files",
          "autoOpenFile": "true"
        }
      }
    }
  }

  Usage

  Ask Claude Desktop to generate mind maps:

  Please create a mind map for my project plan with the following topics:
  - Research (with Market Analysis and Competitor Research subtopics)
  - Development (with Frontend and Backend subtopics)
  - Testing

  Save it as "my-project-plan"

  Configuration

  - outputPath: Directory where XMind files will be saved
  - autoOpenFile: Set to "false" to disable auto-opening files

  Requirements

  - Node.js 18+
  - Claude Desktop
  - XMind (to view generated files)

  License

  MIT