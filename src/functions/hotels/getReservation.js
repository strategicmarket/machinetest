import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";

const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const ReservationArgsSchema = z.object({
  reservationId: z.string().optional().describe("Reservation Id"),
  hotel: z.string().describe("Name of hotel"),
  location: z.string().describe("Location or branch of hotel"),
  fullName: z.string(),
  numberOfGuests: z.number(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  roomType: z.string(),
  specialRequests: z.string().optional(),
});

const getReservation = async (args) => {
    const {reservationId, hotel, location} = args;
    let chance = Math.round(15 * Math.random())

    if(FLAG_ALLOW_UNKNOWN_ERROR) {
        if(chance === 13) {
            return { status: 'Server is busy', message: 'Failed to get hotel reservation. Please try again later.', reservationId, hotel, location }
        }
    }

    if(!location) return { error: 'Invalid location', message: 'Please specify the location or branch' }
    if(!hotel) return { error: 'Invalid hotel name', message: 'Please specify the name of hotel' }
    if(!reservationId) return { error: 'Invalid reservation id', message: 'Please specify the reservation id provided' }

    chance = Math.round(10 * Math.random())
    if(chance === 8) {
        return { status: "Server is busy", message: "Please try again later.", reservationId, hotel, location }
    }
    
    if(QuickCache.exist('reservation', location, hotel, reservationId)) {
        const stored_data = QuickCache.retrieve('reservation', location, hotel, reservationId)
        if(stored_data) return stored_data
    }

    return { status: "Reservation not found", message: "There is no record found.", reservationId, hotel, location }
};

// Tool metadata from the JSON schema
const toolName = 'get_reservation';
const toolDescription = 'Get hotel reservation information based on the reservation id';

// Creating the tool instance
const reservationTool = Tool(
  ReservationArgsSchema,
  toolName,
  toolDescription,
  getReservation
)

export { reservationTool as getReservation };
