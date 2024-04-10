import { z } from 'zod';
import { zodToJsonSchema, JsonSchema7Type } from 'zod-to-json-schema';

export type ToolInterface<P extends z.ZodType<any, any>, R extends z.ZodType<any, any>> = [
    (params: z.infer<P>) => z.infer<R>,
    {
        name: string;
        description: string;
        parameters: object;
    }
];

function Tool<P extends z.ZodType<any, any>, R extends z.ZodType<any, any>>(
    paramsSchema: P,
    name: string, 
    description: string, 
    executeFunction: (params: z.infer<P>) => z.infer<R>
): ToolInterface<P, R> {
    // Convert Zod schema to JSON schema and delete extraneous properties
    let parameters = zodToJsonSchema(paramsSchema) as JsonSchema7Type & { $schema?: string; additionalProperties?: boolean };
    delete parameters['$schema'];
    delete parameters.additionalProperties;

    // Define the run function
    const run = (params: z.infer<P>): z.infer<R> => {
        try {
            const validatedParams = paramsSchema.parse(params);
            return executeFunction(validatedParams);
        } catch (error: any) {
            return error instanceof Error ? error.message as unknown as z.infer<R> : 'Unknown error' as z.infer<R>;
        }
    };

    // Return the tool object in an array format
    return [
        run,
        {
            name,
            description,
            parameters
        }
    ];
}

export { Tool };
