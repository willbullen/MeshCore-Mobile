# Cursor Configuration for MeshCore Mobile

This directory contains Cursor IDE configuration files for the MeshCore Mobile project.

## MCP Servers

The `mcp.json` file configures Model Context Protocol (MCP) servers that enhance AI-assisted development in Cursor. These servers provide additional context and capabilities to the AI agent.

### Configured MCPs

| MCP Server | Purpose | Requirements |
|------------|---------|--------------|
| **expo-mcp** | Expo SDK documentation, dependency management, visual testing | EAS paid plan, Expo account |
| **github** | GitHub issues, PRs, repository management | `GITHUB_TOKEN` environment variable |
| **filesystem** | Secure file operations within the project | None |
| **memory** | Persistent knowledge graph for context retention | None |
| **drizzle** | Database operations with Drizzle ORM | Drizzle config in project |
| **sequential-thinking** | Complex problem-solving and debugging | None |
| **brave-search** | Web search for documentation and troubleshooting | `BRAVE_API_KEY` environment variable |
| **fetch** | Fetch and convert web content to markdown | None |

### Setup Instructions

#### 1. Install MCP Servers

Open Cursor Settings → Features → MCP and add the servers from `mcp.json`, or use the Cursor deeplink for each server.

#### 2. Configure Environment Variables

Create a `.env` file or set these environment variables:

```bash
# GitHub Personal Access Token (for github MCP)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Brave Search API Key (for brave-search MCP)
export BRAVE_API_KEY="BSAxxxxxxxxxxxxxxxxxx"
```

#### 3. Expo MCP Setup (Recommended)

The Expo MCP provides the most value for this project. To set it up:

1. **Install via Cursor deeplink:**
   
   Click: [Install Expo MCP](cursor://anysphere.cursor-deeplink/mcp/install?name=expo-mcp&config=eyJ1cmwiOiJodHRwczovL21jcC5leHBvLmRldi9tY3AifQ==)

2. **Authenticate with Expo:**
   - Generate a Personal Access Token from your [EAS Dashboard](https://expo.dev/accounts/[your-username]/settings/access-tokens)
   - Use it during the OAuth flow when prompted

3. **Enable Local Capabilities (Optional but recommended):**
   ```bash
   # Install expo-mcp package
   npx expo install expo-mcp --dev
   
   # Start dev server with MCP capabilities
   EXPO_UNSTABLE_MCP_SERVER=1 npx expo start
   ```

### MCP Capabilities

#### Expo MCP Tools

| Tool | Description | Example Prompt |
|------|-------------|----------------|
| `learn` | Learn Expo how-to for a topic | "learn how to use expo-router" |
| `search_documentation` | Search Expo docs | "search documentation for BLE" |
| `add_library` | Install Expo packages | "add expo-camera to the project" |
| `generate_agents_md` | Generate AGENTS.md file | "add AGENTS.md to my project" |
| `take_screenshot` | Capture simulator screenshot | "take a screenshot of the app" |
| `tap_view` | Tap a view in simulator | "tap the connect button" |

#### GitHub MCP Tools

| Tool | Description |
|------|-------------|
| `create_issue` | Create a new GitHub issue |
| `list_issues` | List repository issues |
| `create_pull_request` | Create a new PR |
| `get_file_contents` | Read file from repository |

#### Filesystem MCP Tools

| Tool | Description |
|------|-------------|
| `read_file` | Read file contents |
| `write_file` | Write content to file |
| `list_directory` | List directory contents |
| `search_files` | Search for files by pattern |

### Troubleshooting

**MCP server not connecting:**
- Ensure you have the latest version of Cursor
- Check that environment variables are set correctly
- Try refreshing the MCP connection in Cursor Settings

**Expo MCP authentication failed:**
- Verify your Expo account has an EAS paid plan
- Regenerate your Personal Access Token
- Ensure you're logged into Expo CLI: `npx expo whoami`

**GitHub MCP permission errors:**
- Ensure your `GITHUB_TOKEN` has the required scopes (repo, read:org)
- Check that the token hasn't expired

### Additional Resources

- [Cursor MCP Documentation](https://cursor.com/docs/context/mcp)
- [Expo MCP Documentation](https://docs.expo.dev/eas/ai/mcp/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
