import image from '@/image.json';

export const defaultDrawImage = image.img;

export const url = process.env.NEXTAUTH_URL ?? 'https://draw.obstinate.fr';

export default {
  defaultDrawImage,
  url
};
