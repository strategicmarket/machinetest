// @ts-nocheck
import express, { Router, Request, Response } from "express";
import request from "supertest";
import { before, afterEach, describe, test, mock } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

function BUSINESSRULEPROMPT(){ 
    return `Process the provided COBOL program and extract all the business rules it contains. 
    Present the extracted rules as a JSON object, with each rule represented as a separate entity. 
    For each rule, assign three properties: 1. 'businessRuleNo', incrementing by 1 for each 
    new rule identified, 2. 'businessRuleName', and 3. 'businessRule', which should be a 
    verbatim representation of the original COBOL statement. Additionally, identify and extract 
    any system-related rules (like file operations) and categorize them separately as 'systemRules' 
    within the same JSON object. Ensure the distinction between business and system rules is clear 
    and maintain the structure and syntax of the JSON format throughout.
    Ensure that the output contains no comments, explanations, or any content 
    that deviates from the JSON object structure.`
}

// Dynamic import function
async function importFunction(modulePath, functionName) {
	console.log(modulePath, functionName )
    try {
        modulePath = modulePath.replace(/\\/g, '/');
        let moduleUrl = '';

        if (process.platform === "win32") {
            moduleUrl = new URL(`file:///${modulePath}`).href;
        } else {
            const absolutePath = path.isAbsolute(modulePath) ? modulePath : path.resolve(modulePath);
            moduleUrl = `file://${absolutePath}`;
        }
		
        const module = await import(moduleUrl);
        const functionToTest = module[functionName];
		if (typeof functionToTest !== 'function') {
			console.error("Failed to import module or function", error);
    		process.stderr.write(`Error: Function ${functionName} not found in module ${modulePath}`);
        }
		console.log(`---function to test ----`)
		console.log(moduleUrl)
		console.log(JSON.stringify(module))
		console.log(JSON.stringify(functionToTest))

        return functionToTest;
    } catch (error) {
        console.error("Failed to import module or function", error);
    	process.stderr.write(`Error: ${error.message}`);
    	//throw error; 
    }
}

let mockStore = {}; // Simple in-memory store

const defaultRedisClient = {
    getAsync: mock.fn((key) => Promise.resolve(mockStore[key] || null)),
    setAsync: mock.fn((key, value) => {
        mockStore[key] = value;
        return Promise.resolve("OK");
    }),
};

const serverRoutes = (redisClient, router = new Router(), functionToTest) => {
	router.get("/store/:key", async (req: Request, res: Response) => {
		const { key } = req.params;
		const value = req.query;		
		await redisClient.setAsync(key, JSON.stringify(value));
		return res.send("Success");
	});

	router.get("/executeFunction", async (req: Request, res: Response) => {
        try {
            const result = functionToTest();			
            return res.json({ result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
	
	router.get("/:key", async (req: Request, res: Response) => {
		const { key } = req.params;
		const rawData = await redisClient.getAsync(key);		
		if (typeof rawData === "undefined") {			
			return res.status(404).json({ error: "No data found for key" }); // Or any other appropriate response
		}
		return res.json(JSON.parse(rawData));
	});

	
	return router;
};

const createServer = async (mockRedisClient = defaultRedisClient) => {
	
	const functionToTest = await (async () => {
        // const modulePath = process.env.MODULE_PATH;
        // const functionName = process.env.FUNCTION_NAME;

        // if (!modulePath || !functionName) {
        //     console.warn("Module path or function name not provided. Skipping dynamic import.");
        //     return () => "No function to execute";
        // }
		return BUSINESSRULEPROMPT
        //return importFunction(modulePath, functionName);
    })();

    const app: Express = express();
    app.use(serverRoutes(mockRedisClient, new Router(), functionToTest));
    return app;
};

	describe("Series of Redis and Server Tests", () => {

		let app: any

		 before(async () => {
		    app = await createServer(defaultRedisClient);
		});	
		
		test("It should call redisClient.setAsync and store the object using key", async () => {
						
			await request(app).get("/store/my-key?hello=world&foo=bar");
			assert.deepEqual(defaultRedisClient.setAsync.mock.calls[0].arguments, [
				"my-key",
				'{"hello":"world","foo":"bar"}',
			]);
		});

		test("It should call redisClient.getAsync and retrieve the correct object using the key", async () => {
					
			const response = await request(app).get("/my-key");
			assert.deepEqual(response.body, {hello:"world",foo:"bar"} );
		});

		test("It should execute the function and return a string result", async () => {
			const response = await request(app).get("/executeFunction");			
			assert.strictEqual(response.status, 200);
			assert.strictEqual(typeof response.body.result, 'string', "The function's return value is not a string.");
		});


	});

	