
import { z } from 'zod';
import {format} from 'date-fns'
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";


// Define the schema using zod
const EventArgsSchema = z.object({
  radius: z.string().describe("Radius of the search area in miles"),
  startDate: z.string().describe("Start date of the event search in 'YYYY-MM-DDTHH:mm:ssZ' format"),
  endDate: z.string().describe("End date of the event search in 'YYYY-MM-DDTHH:mm:ssZ' format"),
  classificationName: z.string().optional().describe("Classification name like 'music' or 'sports'"),
  city: z.string().describe("City of the event")
});

const findTmEventsNearby = async (args) => {
  // Validate the arguments against the schema
  const validatedArgs = EventArgsSchema.parse(args);
  const {  radius, startDate, endDate, classificationName, city  } = validatedArgs; 

  // Format dates to 'YYYY-MM-DDTHH:mm:ssZ' format
  let startDateTime = format(new Date(startDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  let endDateTime = format(new Date(endDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  try {
    const response = await fetch('/api/tools/findTmEventsNearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classificationName, city, radius, startDateTime, endDateTime }),
    })
      if (!response.ok) {
          console.error('Failed to fetch event from Ticket Master');NamedNodeMap, city
          throw new Error('Failed to fetch event from Ticket Master');
      }
      
      let result = await response.json()         

      QuickCache.save('event', JSON.stringify(result), startDate, endDate);

      return result
  } catch (error) {
      console.error('Error fetching events:', error.message);
      return null;
  }
};

// Tool metadata
const toolName = 'get_tm_events_nearby';
const toolDescription = 'Get TicketMaster event information nearby based on location and date range';

// Creating the tool instance
const findTmEventsTool = Tool(
  EventArgsSchema,
  toolName,
  toolDescription,
  findTmEventsNearby
);

export { findTmEventsTool as findTmEventsNearby };

