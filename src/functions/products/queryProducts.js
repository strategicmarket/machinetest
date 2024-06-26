import { z } from 'zod';
import { Tool } from '@/catalog/tool';
import { APPROVED_OPERATORS } from '@/constants'

// validate query structure
const queryProductSchema =  z.object({
  query: z.object({}).catchall(z.any()), // Allows any object   
})

function traverseAndValidate(node, errors = [], path = '') {
  if (Array.isArray(node)) {
    node.forEach((item, index) => traverseAndValidate(item, errors, `${path}[${index}]`));
  } else if (typeof node === 'object' && node !== null) {
    Object.entries(node).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (key.startsWith('$')) {
        // Validate operator
        if (!APPROVED_OPERATORS.includes(key)) {
          errors.push(`Unapproved operator used: ${currentPath}`);
        }
      }
      // Recursively validate nested structures
      if (typeof value === 'object') {
        traverseAndValidate(value, errors, currentPath);
      }
    });
  }
  return errors;
}

// Tool metadata
const toolName = 'query_products';
const toolDescription = 'Process the mongodb query generated by AI, after validation against defined critieria'

const queryProducts = async (params) => {

  try {
    // validate the structure of query
    queryProductSchema.parse(params);

    // approved operators only - security caution    
    const errors = traverseAndValidate(params.query);

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      // return erros
      return { success: false, errors };
    }    

    const response = await fetch('/api/tools/findProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.query),
    })
    if (!response.ok) {
      return { success: false, message: 'Failed to fetch products' };
    }
  
    let result = await response.json()
    return { success: true, data: result.data };
   
  } catch (error) {
    // Handle all errors in a unified manner
    console.error("Error during query processing:", error);
    return { success: false, message: `Error during query processing: ${error.message || 'Unknown error'}` };
    }
  }
// Creating the tool instance
const queryProductsTool = Tool(
    queryProductSchema,
    toolName,
    toolDescription,
    queryProducts
  );
  
  export { queryProductsTool as queryProducts};
