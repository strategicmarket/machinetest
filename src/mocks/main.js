
// Import the fs module to interact with the file system.
import fs from 'fs';
import path from 'path'

// Define the getFile function that attempts to read from a hypothetical file.
export const getFile = () => {
  try {
    const filePath = path.join(__dirname, 'file.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    // In case of an error (e.g., file not found), return a default message.
    // Note: In the context of your mocked test, this catch block should not execute,
    // since readFileSync is mocked to always succeed.
    return 'Failed to read file';
  }
};
