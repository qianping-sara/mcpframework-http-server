import { Client } from "@modelcontextprotocol/sdk/client";
import { HttpStreamClientTransport } from "@modelcontextprotocol/sdk/client/http-stream";

// 根据环境确定服务器 URL
const serverUrl = process.env.NODE_ENV === 'production'
  ? 'YOUR_PRODUCTION_SERVER_URL/mcp' // 替换为您的生产服务器 URL
  : 'http://localhost:8080/mcp';

// 创建 HTTP Stream Transport
const transport = new HttpStreamClientTransport({
  url: serverUrl,
});

// 创建 MCP 客户端实例
const client = new Client({
  name: "simple-mcp-client",
  version: "1.0.0",
});

let isConnected = false; // 添加状态变量

// 连接到服务器
async function connectToServer() {
  try {
    console.log(`Connecting to server at ${serverUrl}...`);
    // 监听 transport 的事件
    transport.on("log", (log: any) => console.log("Server Log:", log)); // 添加类型注解
    transport.on("close", () => {
      console.log("Connection closed.");
      isConnected = false; // 更新状态
    });
    await client.connect(transport);
    isConnected = true; // 更新状态
    console.log("Successfully connected to server.");
  } catch (error) {
    console.error("Failed to connect to server:", error);
    isConnected = false;
  }
}

// 断开连接
async function disconnectFromServer() {
  if (!isConnected) {
    console.log("Client is not connected.");
    return;
  }
  try {
    console.log("Disconnecting from server...");
    await client.close(); // close 应该会触发 transport 的 close 事件
    console.log("Successfully disconnected (request sent).");
  } catch (error) {
    console.error("Failed to disconnect:", error);
    // 即使出错，也可能连接已断开，依赖 close 事件更新状态
  }
}

// 列出可用工具
async function listTools() {
  if (!isConnected) { // 使用状态变量
    console.log("Client is not connected.");
    return;
  }
  try {
    console.log("Listing available tools...");
    const tools = await client.listTools();
    console.log("Available tools:", JSON.stringify(tools, null, 2));
    return tools;
  } catch (error) {
    console.error("Failed to list tools:", error);
    // 如果列出工具失败，可能连接也断了
    // isConnected = false; // 可以选择在这里也更新状态
  }
}

// 调用工具
async function callTool(name: string, args: any) {
  if (!isConnected) { // 使用状态变量
    console.log("Client is not connected.");
    return;
  }
  try {
    console.log(`Calling tool "${name}" with arguments:`, args);
    const result = await client.callTool({ name, arguments: args });
    console.log(`Result from tool "${name}":`, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error(`Failed to call tool "${name}":`, error);
    // isConnected = false; // 可以选择在这里也更新状态
  }
}

// --- 示例用法 ---
async function runClient() {
  await connectToServer();

  if (isConnected) { // 使用状态变量
    // 列出工具
    await listTools();

    // 示例：调用一个假设存在的工具 'echo'
    // 您需要将其替换为服务器上实际存在的工具名和参数
    // const echoResult = await callTool('echo', { message: 'Hello from client!' });

    // 示例：调用假设的 list_files 工具（如果服务器提供）
    // const filesResult = await callTool('list_files', { path: '.' });

    // 等待一段时间或根据需要保持连接
    // await new Promise(resolve => setTimeout(resolve, 5000));

    // 断开连接
    // await disconnectFromServer();
  }
}

// 运行客户端逻辑
runClient().catch(console.error);

// 导出函数以便在其他地方使用（如果需要）
export { connectToServer, disconnectFromServer, listTools, callTool, client, isConnected }; // 导出状态变量 