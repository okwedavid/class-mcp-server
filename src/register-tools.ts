import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

export function createMcpServer() {
  const server = new McpServer({
    name: "class-mcp-server",
    version: "1.0.0",
  });

  server.registerTool(
    "calculator",
    {
      description: "Add two numbers together",
      inputSchema: z.object({
        a: z.number(),
        b: z.number(),
      }),
    },
    async ({ a, b }) => ({
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
    }),
  );

  server.registerTool(
    "get_time",
    {
      description: "Get the current server time in UTC",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    }),
  );

  server.registerTool(
    "get_server_info",
    {
      description: "Return information about this MCP server",
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            name: "class-mcp-server",
            version: "1.0.0",
            runtime: "Node.js",
            protocol: "MCP",
            transports: ["stdio", "Streamable HTTP"],
          }),
        },
      ],
    }),
  );

  return server;
}