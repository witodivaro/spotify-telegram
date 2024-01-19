import axios from 'axios';
import fsPromises, { unlink } from 'fs/promises';
import path from 'path';

export const temporarilyFetchImage = async (url: string, fileName: string) => {
  const { data: image } = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });
  const imagePath = path.join(__dirname, '..', '..', `${fileName}.jpeg`);

  await fsPromises.writeFile(imagePath, Buffer.from(image));

  return {
    path: imagePath,
    unlink: async () => unlink(imagePath),
  };
};
