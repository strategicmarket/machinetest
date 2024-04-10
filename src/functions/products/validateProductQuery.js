import { z } from 'zod';
import { Tool } from '@/catalog/tool';

// Define the product search schema
const validateProductQuerySchema = z.object({
  id: z.string().optional().describe('unique id for product'),
  url: z.string().optional().describe('url for product'),
  images: z.string().optional().describe('a string of urls with product images'),
  name: z.string().optional().describe('long name for the product'),
  description: z.string().optional().describe('marketing description of the product'),
  brand: z.string().optional().describe('name of brand and company which produces the product'),
  price: z.number().optional().describe('price of the product in us currency'),
  currency: z.string().optional().describe('currency for price listed'),
  in_stock: z.boolean().optional().describe('Boolean indicator on product availability'),
  color: z.string().optional(). describe('color of the product if applicable'),
  avg_rating: z.string().optional().describe('product rating via the website'),
  overview: z.string().optional().describe('technical description of the product'),
  specifications: z.string().optional().describe('collection of elements in a string format with precise technical dimensions or attributes of the product'),
  vector: z.string().optional().describe('a summary of product, description and price')
}).strict()


// Tool metadata
const toolName = 'validate_product_query';
const toolDescription = ' validate the properties used in the query based on the approved schema for the database '

const validateProductQuery = async (params) => {

  
  try {
    const validatedArgs = validateProductQuerySchema.parse(params);
   
    return {result: true, data: validatedArgs}

  } catch (error) {
    // Handle ZodError for schema issues
    if (error instanceof z.ZodError) {
      const detailedErrors = error.errors.map(err => ({
        field: err.path[0] || 'Unknown', 
        message: err.message
      }));
      console.error("Schema validation failed:", detailedErrors);
      return {result: false, errors: detailedErrors};

    } else {
      console.error("Unexpected error during validation:", error);
      return {result: false, message: "An unexpected error occurred"};
    }
  }     
 
  };

// Creating the tool instance
const validateProductQueryTool = Tool(
    validateProductQuerySchema,
    toolName,
    toolDescription,
    validateProductQuery
  );
  
  export { validateProductQueryTool as validateProductQuery};
