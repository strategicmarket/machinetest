import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";

const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const EventArgsSchema = z.object({
  location: z.string().describe("Location or place name of the event"),
  date: z.string().describe("Date of the event in 'YYYY-MM-DD' format")
});

const getEvents = async (args) => {
  const { location, date } = args;

  if (FLAG_ALLOW_UNKNOWN_ERROR) {
    let chance = Math.round(15 * Math.random());
    if (chance === 13) {
      return { error: 'Unknown error', message: 'Failed to get events in specified location and date', location, date };
    }
  }

  if (!location) return { error: 'Invalid location', message: 'Please specify the location' };
  if (!date) return { error: 'Invalid date', message: 'Please specify the date' };

  if (QuickCache.exist('events', location, date)) {
    const stored_data = QuickCache.retrieve('events', location, date);
    if (stored_data) return stored_data;
  }

  const events = ['Outdoor Fiesta', 'Sumo Exhibition', 'Art Festival', 'Street Dance Parade', 'Farm Marche', 'Folk Concert', 'Soul Food Festival', 'Earth Day', 'Ramen Festival', 'Jazz Festival'];
  const index = Math.floor(events.length * Math.random());

  const events_data = { location, date, event: events[index] };
  QuickCache.save('events', JSON.stringify(events_data), location, date);

  return events_data;
};

// Tool metadata from the JSON schema
const toolName = 'get_events';
const toolDescription = 'Get events based on the given location and date';

// Creating the tool instance
const eventsTool = Tool(
  EventArgsSchema,
  toolName,
  toolDescription,
  getEvents
)

export { eventsTool as getEvents };
