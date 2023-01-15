// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  message: string;
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!(req.method === 'PUT')) {
    return res.status(200).json({ message: '...' });
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ message: 'Not Authentificated' });
  }

  await prisma.draw.update({
    where: {
      id: 10
    },
    data: {
      ...req.body
    }
  });

  return res.status(200).json({ message: 'Done' });
}
