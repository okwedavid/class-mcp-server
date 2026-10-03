import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createMcpServer } from "./register-tools.js";
import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

await serveStdio(() => createMcpServer());

const server = new McpServer({
  name: "class-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "calculator",
  {
    description: "Add two numbers together",
    inputSchema: {
      a: z.number(),
      b: z.number(),
    },
  },
  async ({ a, b }) => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            operation: "addition",
            a,
            b,
            result: a + b,
          }),
        },
      ],
    };
  }
);

server.registerTool(
  "get_time",
  {
    description: "Get the current server time",
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    };
  }
);

server.registerTool(
  "get_server_info",
  {
    description: "Return information about this MCP server",
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            name: "class-mcp-server",
            version: "1.0.0",
            runtime: "Node.js",
            protocol: "MCP",
            transport: "stdio",
          }),
        },
      ],
    };
  }
);

await serveStdio(() => server);