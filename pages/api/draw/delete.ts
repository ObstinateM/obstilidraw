// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type Data = {
  message: string;
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!(req.method === 'DELETE')) {
    return res.status(200).json({ message: '...' });
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ message: 'Not Authentificated' });
  }

  const prismaRes = await prisma.draw.findUnique({
    select: {
      id: true,
      author: true
    },
    where: {
      id: req.body.id
    }
  });

  if (!prismaRes) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (prismaRes.author[0] === (token.email as string)) {
    await prisma.draw.delete({
      where: {
        id: req.body.id
      }
    });
  }

  return res.status(200).json({ message: 'Done' });
}
