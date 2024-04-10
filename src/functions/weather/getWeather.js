import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";

// Define the schema using zod based on the JSON structure
const WeatherArgsSchema = z.object({
  location: z.string().describe("Location or place name"),
  date: z.string().describe("Date of forecast in 'YYYY-MM-DD' format"),
});

const getWeather = async (args) => {
    const {location, date} = args;

    if(!location) return { error: 'Invalid location', message: 'Please specify the location' };
    if(!date) return { error: 'Invalid date', message: 'Please specify the date' };

    if(QuickCache.exist('weather', location, date)) {
        const stored_data = QuickCache.retrieve('weather', location, date);
        if(stored_data) return stored_data;
    }

    // Simulated weather data generation
    const temperature = Math.floor(25 * Math.random());
    const conditions = ['Sunny', 'Cloudy', 'Rainy'];
    const index = Math.floor(conditions.length * Math.random());
    const weather_data = { location, date, temperature, unit: 'celsius', condition: conditions[index] };

    QuickCache.save('weather', JSON.stringify(weather_data), location, date);

    return weather_data;
};

// Tool metadata from the JSON schema
const toolName = 'get_weather';
const toolDescription = 'Get the weather forecast based on the given location and date';

// Creating the tool instance
const weatherTool = Tool(
  WeatherArgsSchema,
  toolName,
  toolDescription,
  getWeather
)

export { weatherTool as getWeather };
