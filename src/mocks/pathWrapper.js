// pathWrapper.js
import path from 'path';

export const dirname = (filePath) => {
  return path.dirname(filePath);
}

export const basename = (filePath) => {
  return path.basename(filePath);
}

  