import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  try {
    const request = JSON.parse(line);

    if (request.jsonrpc !== "2.0") {
      console.log(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request.id ?? null,
          error: {
            code: -32600,
            message: "Invalid JSON-RPC request",
          },
        })
      );
      return;
    }

    if (request.method === "add") {
      const { a, b } = request.params;

      console.log(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request.id,
          result: {
            answer: a + b,
          },
        })
      );

      return;
    }

    console.log(
      JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      })
    );
  } catch {
    console.log(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error",
        },
      })
    );
  }
});