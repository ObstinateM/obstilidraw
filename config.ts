import image from '@/image.json';

export const defaultDrawImage = image.img;

export const url = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export default {
  defaultDrawImage,
  url
};
