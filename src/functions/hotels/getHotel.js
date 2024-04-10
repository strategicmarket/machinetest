
import { z } from 'zod';
import { Tool } from '@/catalog/tool'; 
import QuickCache from "@/lib/quickcache";
import { getUniqueId } from "@/lib/utils";

const FLAG_ALLOW_UNKNOWN_ERROR = false;

// Define the schema using zod based on the JSON structure
const HotelArgsSchema = z.object({
  location: z.string().describe("Location or branch of hotel"),
  hotel: z.string().describe("Name of the hotel"), // 'hotel' is now required
});

const getHotel = async (args) => {
    const {location, hotel} = args
    let chance = Math.round(15 * Math.random())

    if(FLAG_ALLOW_UNKNOWN_ERROR) {
        if(chance === 13) {
            return { error: 'Unknown error', message: 'Failed to get hotel information', location, hotel }
        }
    }

    if(!location) return { error: 'Invalid location', message: 'Please specify the location or branch' }
    if(!hotel) return { error: 'Invalid hotel name', message: 'Please specify the name of hotel' }

    if(QuickCache.exist('hotel', location, hotel)) {
        const stored_data = QuickCache.retrieve('hotel', location, hotel)
        if(stored_data) return stored_data
    }
   
    chance = Math.round(10 * Math.random())
    if(chance === 8) {
        return { location, hotel, message: 'Hotel information not found' }
    }

    let description1 = `Welcome to ${hotel}, the epitome of luxury and comfort.\n` +
        `Nestled in the heart of the ${location}, our hotel offers a stunning view of the skyline.\n` +
        `Our rooms are designed with elegance and equipped with modern amenities to ensure a memorable stay.\n` +
        `Indulge in our world-class cuisine at our in-house restaurant, or unwind at our state-of-the-art fitness center and spa.\n` +
        `With our dedicated staff ready to cater to your needs 24/7, we guarantee an unparalleled hospitality experience at ${hotel}.\n` +
        `We look forward to welcoming you soon!`
    
    let description2 = `Escape the hustle and bustle of everyday life and immerse yourself in the tranquil ambiance of ${hotel}.\n` +
        `Nestled amidst the lush greenery of a secluded paradise, our hotel offers a sanctuary of relaxation and rejuvenation.\n` +
        `Our spacious and elegantly appointed rooms provide a haven of comfort, while our attentive staff is dedicated to ensuring your stay is nothing short of exceptional.`

    let description3 = `Nestled in the heart of ${location}, ${hotel} offers a blend of comfort and convenience.\n` +
        `Our hotel is designed with a touch of luxury and furnished with a bespoke blend of amenities to provide an unforgettable stay for our guests.\n` +
        `Our rooms are spacious and feature modern decor and amenities.\n` +
        `Some rooms also offer stunning city views!`
    
    let description4 = `Whether you’re visiting for business or leisure, ${hotel} is the perfect place to experience ${location} and its surroundings.\n` +
        `Book your stay with us for an unforgettable experience!`

    let descriptions = [description1, description2, description3, description4]

    chance = Math.floor(descriptions.length * Math.random())
    const description = descriptions[chance]
    const price = 3000 + Math.floor(20000 * Math.random());
    const list_of_amenities = ['pool', 'spa', 'sauna', 'fitness center', 'business center', 'free wifi', 'free breakfast']

    let amenities = []

    for(let amenity of list_of_amenities) {
        chance = Math.round(10 * Math.random())
        if(chance > 6) continue
        amenities.push(amenity)
    }

    // Note: The images in the links are just placeholder but they exist, for testing.
    // If you want to use your own images or links, by experience, you need https and relative paths do not work.
    
    const link_name = hotel.toLowerCase().split(' ').join('_')
    const website = `https://example.com/hotel/${link_name}/${getUniqueId()}`
    
    chance = Math.floor(10 * Math.random())
    const images = [{ alt: hotel, src: chance > 5 ? 'https://i.postimg.cc/jjc1LSrH/d5592424-e3f0-4dfa-afb2-2dcc7308e321.jpg' : 'https://i.postimg.cc/Xv4hjytN/dea57a4a-532b-43d2-85bb-0e0172d8c594.jpg' }]
    

    const hotel_data = { location, hotel, description, price: price.toLocaleString(), amenities, website, images }

    QuickCache.save('hotel', JSON.stringify(hotel_data), location, hotel);

    return hotel_data;
}

// Tool metadata from the JSON schema
const toolName = 'get_hotel';
const toolDescription = 'Get hotel information based no location and hotel name provided';

// Creating the tool instance
const hotelTool = Tool(
  HotelArgsSchema,
  toolName,
  toolDescription,
  getHotel
)

export { hotelTool as getHotel };
