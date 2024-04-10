import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";
import { getUniqueId } from "@/lib/utils";

const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const EventArgsSchema = z.object({
  location: z.string().describe("Location or place of the event"),
  date: z.string().describe("Date of the event in 'YYYY-MM-DD' format"),
  event: z.string().optional().describe("Name of the event")
});

const getEvent = async (args) => {
    const {location, date, event} = args;
    let chance = Math.round(15 * Math.random());

   if(FLAG_ALLOW_UNKNOWN_ERROR) {
       if(chance === 13) {
           return { error: 'Unknown error', message: 'Failed to get event information', event, location, date };
       }
   }

   if(!location) return { error: 'Invalid location', message: 'Please specify the location' };
   if(!date) return { error: 'Invalid date', message: 'Please specify the date' };
   if(!event) return { error: 'Invalid event', message: 'Please specify the event name' };

   if(QuickCache.exist('event', location, date, event)) {
       const stored_data = QuickCache.retrieve('event', location, date, event);
       if(stored_data) return stored_data;
   }

   const times = ['10:00 - 18:00', '11:00 - 15:00', '13:00 - 18:00', '15:00 - 20:00', '18:00 - 22:00'];
   chance = Math.floor(times.length * Math.random());
   const stime = times[chance];

   const places = ['People Hall', 'Community Center', 'City Stadium', 'City Park', 'River Park', 'United Stadium', 'Sports Center'];
   chance = Math.floor(places.length * Math.random());
   const splace = places[chance];

   const event_id = getUniqueId();

   const links = [{ title: `Event site`, url: `https://example.com/event/${event_id}`, target: '_blank' }, { title: 'Venue information', url: `https://example.com/venue/${getUniqueId()}`, target: '_blank' }];

   chance = Math.floor(10 * Math.random());

   const images = [{ alt: event, src: chance > 5 ? 'https://i.postimg.cc/cH55BkC6/5592e301-0407-473a-ada0-e413f0791076.jpg' : 'https://i.postimg.cc/xCd4HV0W/614a6c2b-b881-42f2-a8d4-95f8033b55fb.jpg' }];
   
   const event_data = { location, date, event, time: stime, place: splace, links, images };

   QuickCache.save('event', JSON.stringify(event_data), location, date, event);

   return event_data;
};

// Tool metadata from the JSON schema
const toolName = 'get_event';
const toolDescription = 'Get event information based on the given event name, location and date';

// Creating the tool instance
const eventTool = Tool(
  EventArgsSchema,
  toolName,
  toolDescription,
  getEvent
)

export { eventTool as getEvent };
