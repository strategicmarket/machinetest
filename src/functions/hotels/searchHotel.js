import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";


const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const HotelArgsSchema = z.object({
  location: z.string().describe("Location or place name where the user wants to find a hotel")
});

const searchHotel = async (args) => {
    const { location } = args;
    let chance = Math.round(15 * Math.random());

    if(FLAG_ALLOW_UNKNOWN_ERROR) {
        if(chance === 13) {
            return { error: 'Unknown error', message: 'Failed to search for hotels in specified location', location }
        }
    }

    if(!location) return { error: 'Invalid location', message: 'Please specify the location' };

    if(QuickCache.exist('hotels', location)) {
        const stored_data = QuickCache.retrieve('hotels', location)
        if(stored_data) return stored_data
    }

    chance = Math.round(10 * Math.random())
    if(chance === 8) {
        return { location, items: [], message: 'Found no hotels in the given location.' }
    }

    const prefixes = ["Supreme", "Great", "Grand", "Park", "Central", "Royal", "Century", "The", "Green", "Millenium", "Emerald"]
    const names = ["Sakura", "Garden", "River", "City", "View", "Onitsuka", "Falcon", "Lion", "Oak", "Southern", "Northern", "Eastern", "Western"]
    const suffixes = ["Hotel", "Inn", "Suites", "Lodge", "Guesthouse", "Hostel", "Mansion"]

    chance = 1 + Math.round(6 * Math.random())

    let items = []

    for(let i = 0; i < chance; i++) {

        const index1 = Math.floor(prefixes.length * Math.random())
        const index2 = Math.floor(names.length * Math.random())
        const index3 = Math.floor(suffixes.length * Math.random())
                
        items.push([prefixes[index1], names[index2], suffixes[index3]].join(' '))

    }

    const hotels_data = { location, items, message: `Found ${items.length} hotels` };

    QuickCache.save('hotels', JSON.stringify(hotels_data), location);

    return hotels_data;
};

// Tool metadata from the JSON schema
const toolName = 'search_hotel';
const toolDescription = 'Search for hotels based on the given location';

// Creating the tool instance
const searchHotelTool = Tool(
  HotelArgsSchema,
  toolName,
  toolDescription,
  searchHotel
)

export { searchHotelTool as searchHotel };
