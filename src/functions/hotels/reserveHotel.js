import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";
import { getUniqueId } from "@/lib/utils";

const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const ReservationSchema = z.object({
  hotel: z.string().describe("Name of the hotel"),
  location: z.string().describe("Location or branch of the hotel"),
  fullName: z.string().describe("Full name of the user making reservation"),
  numberOfGuests: z.number().describe("Total number of people who will be staying in the room"),
  checkInDate: z.string().describe("Date when the guests will arrive in 'YYYY-MM-DD' format"),
  checkOutDate: z.string().describe("Date when the guests will leave in 'YYYY-MM-DD' format"),
  roomType: z.enum(["single", "double", "suite"]).describe("Type of room desired"),
  specialRequests: z.array(z.string()).optional().describe("Any specific requests like a room on a certain floor, near the elevator, extra bed, etc."),
});

const reserveHotel = async (args) => {
    const {
        hotel, 
        location, 
        fullName, 
        numberOfGuests, 
        checkInDate, 
        checkOutDate,
        roomType,
        specialRequests
    } = args;

    if(FLAG_ALLOW_UNKNOWN_ERROR) {

        let chance = Math.round(15 * Math.random())

        if(chance === 13) {
            return { error: 'Unknown error', message: 'Failed to make hotel reservation. Please try again.', hotel, location }
        }

    }

    if(!location) return { error: 'Invalid location', message: 'Please specify the location or branch' }
    if(!hotel) return { error: 'Invalid hotel name', message: 'Please specify the name of hotel' }
    if(!fullName) return { error: 'Invalid name', message: 'Please specify your full name' }
    if(!numberOfGuests) return { error: 'Invalid guest number', message: 'Please specify the number of guests' }
    if(!checkInDate) return { error: 'Invalid Check-In date', message: 'Please specify the Check-In date' }
    if(!checkOutDate) return { error: 'Invalid Check-out data', message: 'Please specify the Check-out date' }
    if(!roomType) return { error: 'Invalid room type', message: 'Please specify the room type' }
    
    if(fullName.toLowerCase().indexOf('full name') >= 0) {
        return { status: 'No name provided', message: 'Please ask user provide your full name', hotel, location, numberOfGuests, checkInDate, checkOutDate, roomType, specialRequests }
    }

    const reservationId = getUniqueId();
    const reservation_data = {
        status: 'Reservation successful',
        reservationId: reservationId,
        message: 'Your reservation has been completed. Please present your reservationId at the front desk.',
        hotel,
        location,
        fullName,
        numberOfGuests,
        checkInDate,
        checkOutDate,
        roomType,
        specialRequests
    }

    QuickCache.save('reservation', JSON.stringify(reservation_data), location, hotel, reservationId);

    return reservation_data;
};

// Tool metadata from the JSON schema
const toolName = 'reserve_hotel';
const toolDescription = 'Reserve a room for the user in the hotel';

// Creating the tool instance
const reserveHotelTool = Tool(
  ReservationSchema,
  toolName,
  toolDescription,
  reserveHotel
)

export { reserveHotelTool as reserveHotel };
