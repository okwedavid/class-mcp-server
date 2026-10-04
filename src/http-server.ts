import { createServer } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpServer } from "./register-tools.js";

const PORT = Number(process.env.PORT ?? 3000);
const MCP_API_KEY = process.env.MCP_API_KEY;

if (!MCP_API_KEY) {
  throw new Error("MCP_API_KEY must be configured");
}

// Stateless Streamable HTTP MCP handler.
const mcpHandler = createMcpHandler(() => createMcpServer());
const nodeHandler = toNodeHandler(mcpHandler);

const httpServer = createServer((req, res) => {
  const pathname = new URL(
    req.url ?? "/",
    `http://${req.headers.host ?? "localhost"}`,
  ).pathname;

  // Public health check for the hosting platform.
  if (req.method === "GET" && pathname === "/health") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (pathname !== "/mcp") {
    res.writeHead(404, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  // Protect the public MCP endpoint with a static bearer token.
  // Deliberately no WWW-Authenticate header and 403 instead of 401:
  // a 401 + WWW-Authenticate: Bearer makes MCP clients assume OAuth 2.1 and
  // attempt Dynamic Client Registration against /register, which this server
  // does not implement.
  const expected = `Bearer ${MCP_API_KEY}`;
  const provided = req.headers.authorization;
  if (typeof provided !== "string" || provided.trim() !== expected) {
    res.writeHead(403, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ error: "Invalid or missing bearer token" }));
    return;
  }

  // The SDK handles MCP protocol messages and HTTP transport.
  void nodeHandler(req, res);
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.error(`MCP HTTP server listening on port ${PORT}`);
});