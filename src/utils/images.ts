import axios from 'axios';
import fsPromises, { unlink } from 'fs/promises';
import { tmpNameSync } from 'tmp';

export const temporarilyFetchImage = async (url: string) => {
  const { data: image } = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
  });

  const imagePath = tmpNameSync();

  await fsPromises.writeFile(imagePath, Buffer.from(image));

  return {
    path: imagePath,
    unlink: async () => unlink(imagePath),
  };
};
