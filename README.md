## STRATEGIC MACHINES TESTS

GenAI is an astonishing productivity tool for developers, but an unreliable model for business applications that touch customers. Everyone is well acquainted with the 'hallucinations' of a GenAI process, which leads to unpredictable and even harmful outcomes for a business. 

The purpose of these scripts is to demonstrate a method for testing AI Apps for business. An AI App is defined as GenAI model which consumes functions (trustworthy components) in order to deliver an outcomes. These test scripts may be executed at the command line using the emdedded node:test runner. They are also used in a broader set of tests with GenAI at the site strategicmachines.ai.

Note that one of the intractable issues with testing Apps built on language models is that LLMs are not software in the traditional sense. The results from LLMs are unpredictable in a technical sense, and so testing techniques need to be modified accordingly. Included with set of tests is a function called machinetool which uses zod to transform a file into component parts, including the function and schema, which are used the testing pipeline to assess results.

### Stack

node - version 20+

### USAGE

git clone https://github.com/strategicmarket/machinetest
cd machinetest
pnpm i
npm run test
