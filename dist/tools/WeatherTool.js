import { MCPTool } from "mcp-framework";
import { z } from "zod";
class WeatherTool extends MCPTool {
    name = "weather";
    description = "Get weather information for a city";
    schema = {
        city: {
            type: z.string(),
            description: "City name to get weather for",
        },
    };
    async execute({ city }) {
        // In a real scenario, this would call a weather API
        // For now, we return this sample data
        return {
            city,
            temperature: 22,
            condition: "Sunny",
            humidity: 45,
        };
    }
}
export default WeatherTool;
