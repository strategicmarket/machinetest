
import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 

const RestaurantSearchSchema = z.object({
  latitude: z.number().describe("Latitude of the location"),
  longitude: z.number().describe("Longitude of the location")
});

async function getNearbyRestaurants(args) {
  const validatedArgs = RestaurantSearchSchema.parse(args);
  const { latitude, longitude } = validatedArgs;

  try {

    const response = await fetch('/api/tools/getNearbyRestaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({latitude, longitude }),
    })
    if (!response.ok) {
        console.error('Failed to fetch nearby restaurants');
        throw new Error('Failed to fetch nearby restaurants');
    }
    
    let result = await response.json()
    console.log(`----inside of the getnearby function ----`)
    console.log(result)
    return result

  } catch (error) {
    // Handle any errors that occurred during the process
    console.error("An error occurred while fetching closest restaurants:", error);
    throw error; // Re-throw the error for further handling, if necessary
    }
}


// Tool metadata
const toolName = 'get_nearby_restaurants';
const toolDescription = 'Get nearby restaurants based on the given latitude and longitude';

// Creating the tool instance
const restaurantTool = Tool(
  RestaurantSearchSchema,
  toolName,
  toolDescription,
  getNearbyRestaurants
);

export { restaurantTool as getNearbyRestaurants };
