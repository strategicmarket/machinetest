import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 

// Define the schema using zod based on the JSON structure
const SunriseSunsetArgsSchema = z.object({
  coordinates: z.string().describe("The coordinates of the location formatted like 'lat,long'")
});

const getTimeofSunriseSunset = async (args) => {
    // Validate args using Zod schema
    const validatedArgs = SunriseSunsetArgsSchema.parse(args);
    const [lat, lng] = validatedArgs.coordinates.split(",");
    
    // Fetch the data from the API
    const data = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}`)
                      .then((res) => res.json());

    return data;
};

// Tool metadata from the JSON schema
const toolName = 'get_daylight';
const toolDescription = 'Determine sunrise and sunset in my location';

// Creating the tool instance
const sunriseSunsetTool = Tool(
  SunriseSunsetArgsSchema,
  toolName,
  toolDescription,
  getTimeofSunriseSunset
)

export { sunriseSunsetTool as getTimeofSunriseSunset };
