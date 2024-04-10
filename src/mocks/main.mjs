
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Compute equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getFile = () => {
  try {
    const filePath = path.join(__dirname, 'file.txt'); // Use the computed __dirname
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    return 'Failed to read file';
  }
};
