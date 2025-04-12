import { MCPServer } from "mcp-framework";
const server = new MCPServer({
    transport: {
        type: "http-stream",
        options: {
            port: 8080, // Port to listen on (default: 8080)
            endpoint: "/mcp", // HTTP endpoint path (default: "/mcp")
            responseMode: "batch", // Response mode: "batch" or "stream" (default: "batch")
            maxMessageSize: "4mb", // Maximum message size (default: "4mb")
            batchTimeout: 30000, // Timeout for batch responses in ms (default: 30000)
            headers: {
                "X-Custom-Header": "value"
            },
            cors: {
                allowOrigin: "*",
                allowMethods: "GET, POST, DELETE, OPTIONS",
                allowHeaders: "Content-Type, Accept, Authorization, x-api-key, Mcp-Session-Id, Last-Event-ID",
                exposeHeaders: "Content-Type, Authorization, x-api-key, Mcp-Session-Id",
                maxAge: "86400"
            },
            session: {
                enabled: true, // Enable session management (default: true)
                headerName: "Mcp-Session-Id", // Session header name (default: "Mcp-Session-Id")
                allowClientTermination: true // Allow clients to terminate sessions (default: true)
            },
            resumability: {
                enabled: false, // Enable stream resumability (default: false)
                historyDuration: 300000 // How long to keep message history in ms (default: 300000 - 5 minutes)
            }
        }
    }
});
await server.start();
