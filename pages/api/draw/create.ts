// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  id?: number;
  message: string;
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!(req.method === 'POST')) {
    return res.status(200).json({ message: '...' });
  }

  const token = await getToken({ req });

  if (!token || !token?.email) {
    return res.status(401).json({ message: 'Not Authentificated' });
  }

  const response = await prisma.draw.create({
    data: {
      title: 'Untitled',
      blob: 'data:image/png;base64, null',
      element: '[]',
      file: '{}',
      state: '{}',
      author: token.email
    }
  });

  return res.status(200).json({ id: response.id, message: 'Done' });
}
