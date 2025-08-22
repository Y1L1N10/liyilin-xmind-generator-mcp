# @liyilin/xmind-generator-mcp

**[English](#english) | [中文](#中文)**

## English

An enhanced MCP (Model Context Protocol) server for generating XMind mind maps. This server allows Claude Desktop and other MCP clients to create structured mind maps with automatic file saving to your Documents folder.

### ✨ Features

- 🧠 **Generate XMind mind maps** with hierarchical topic structures
- 📝 **Rich content support** for topic notes, labels, and markers
- 💾 **Smart file management** - saves to `~/Documents/XmindFiles` by default
- 🔧 **Easy integration** with Claude Desktop
- 🎨 **Auto-open generated files** in XMind application
- 🌍 **Cross-platform support** (Windows, macOS, Linux)

### 📦 Installation

#### Option 1: Using npx (Recommended)

1. **Configure Claude Desktop** by editing the configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add the following configuration**:
   ```json
   {
     "mcpServers": {
       "xmind-generator": {
         "command": "npx",
         "args": ["@liyilin/xmind-generator-mcp"],
         "env": {
           "outputPath": "~/Documents/XmindFiles",
           "autoOpenFile": "true"
         }
       }
     }
   }
   ```

3. **Restart Claude Desktop**

#### Option 2: Global Installation

1. **Install globally**:
   ```bash
   npm install -g @liyilin/xmind-generator-mcp
   ```

2. **Configure Claude Desktop**:
   ```json
   {
     "mcpServers": {
       "xmind-generator": {
         "command": "@liyilin/xmind-generator-mcp",
         "env": {
           "outputPath": "~/Documents/XmindFiles",
           "autoOpenFile": "true"
         }
       }
     }
   }
   ```

### 🚀 Usage

Ask Claude Desktop to generate mind maps using natural language:

```
Please create a mind map for my project plan with the following topics:
- Research (with Market Analysis and Competitor Research subtopics)
- Development (with Frontend and Backend subtopics)
- Testing (with Unit Testing and Integration Testing subtopics)

Save it as "my-project-plan"
```

### ⚙️ Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `outputPath` | Directory where XMind files will be saved | `~/Documents/XmindFiles` |
| `autoOpenFile` | Automatically open generated files in XMind | `true` |

**Path Examples:**
- **macOS/Linux**: `~/Documents/XmindFiles`
- **Windows**: `%USERPROFILE%\Documents\XmindFiles`

### 📋 Requirements

- **Node.js** 18 or higher
- **Claude Desktop** application
- **XMind** application (to view generated files)

### 📄 License

MIT

---

## 中文

增强的MCP（模型上下文协议）服务器，用于生成XMind思维导图。该服务器允许Claude Desktop和其他MCP客户端创建结构化思维导图，并自动保存到您的文档文件夹中。

### ✨ 功能特性

- 🧠 **生成XMind思维导图** 支持层次化主题结构
- 📝 **丰富内容支持** 主题备注、标签和标记
- 💾 **智能文件管理** 默认保存到 `~/Documents/XmindFiles`
- 🔧 **轻松集成** Claude Desktop
- 🎨 **自动打开生成的文件** 在XMind应用中
- 🌍 **跨平台支持** (Windows, macOS, Linux)

### 📦 安装方式

#### 选项1：使用npx（推荐）

1. **配置Claude Desktop** 编辑配置文件：
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **添加以下配置**：
   ```json
   {
     "mcpServers": {
       "xmind-generator": {
         "command": "npx",
         "args": ["@liyilin/xmind-generator-mcp"],
         "env": {
           "outputPath": "~/Documents/XmindFiles",
           "autoOpenFile": "true"
         }
       }
     }
   }
   ```

3. **重启Claude Desktop**

#### 选项2：全局安装

1. **全局安装**：
   ```bash
   npm install -g @liyilin/xmind-generator-mcp
   ```

2. **配置Claude Desktop**：
   ```json
   {
     "mcpServers": {
       "xmind-generator": {
         "command": "@liyilin/xmind-generator-mcp",
         "env": {
           "outputPath": "~/Documents/XmindFiles",
           "autoOpenFile": "true"
         }
       }
     }
   }
   ```

### 🚀 使用方法

使用自然语言要求Claude Desktop生成思维导图：

```
请为我的项目计划创建一个思维导图，包含以下主题：
- 需求分析（包含市场分析和竞品研究子主题）
- 开发阶段（包含前端和后端开发子主题）
- 测试（包含单元测试和集成测试子主题）

保存为"我的项目计划"
```

### ⚙️ 配置选项

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `outputPath` | XMind文件保存目录 | `~/Documents/XmindFiles` |
| `autoOpenFile` | 自动在XMind中打开生成的文件 | `true` |

**路径示例：**
- **macOS/Linux**: `~/Documents/XmindFiles`
- **Windows**: `%USERPROFILE%\Documents\XmindFiles`

### 📋 系统要求

- **Node.js** 18或更高版本
- **Claude Desktop** 应用程序
- **XMind** 应用程序（用于查看生成的文件）

### 📄 许可证

MIT