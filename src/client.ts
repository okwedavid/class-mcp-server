import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const client = new Client({
  name: "class-mcp-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/server.ts"],
});

await client.connect(transport);

const tools = await client.listTools();

console.log("\nAvailable tools:\n");

for (const tool of tools.tools) {
  console.log(`- ${tool.name}: ${tool.description}`);
}

const result = await client.callTool({
  name: "calculator",
  arguments: {
    a: 20,
    b: 22,
  },
});

console.log("\nCalculator result:");
console.log(JSON.stringify(result, null, 2));

await client.close();