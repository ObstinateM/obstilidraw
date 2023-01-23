import Head from 'next/head';
import Draw from '@/components/Draw';
import NavbarDraw from '@/components/NavbarDraw';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { createRef } from 'react';

const prisma = new PrismaClient();

export default function Edit({ data, id }: any) {
  const titleRef = createRef<HTMLInputElement>();

  return (
    <>
      <Head>
        <title>Obstilidraw</title>
        <meta name="description" content="Edit a draw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavbarDraw title={data.title} placeholder="Title" myRef={titleRef} />
      <main>
        <Draw initialData={data} id={id} titleRef={titleRef} />
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  let data;

  if (!session) {
    return {
      props: {
        data: null
      }
    };
  }

  data = await prisma.draw.findFirst({
    where: {
      id: Number(id[0]),
      author: {
        has: session?.user?.email
      }
    }
  });

  if (!data) {
    return {
      props: {
        data: null
      }
    };
  }

  data = {
    title: data!.title,
    elements: JSON.parse(data!.element),
    appState: JSON.parse(data!.state),
    files: JSON.parse(data!.file)
  };

  return {
    props: {
      data,
      id: Number(id[0])
    }
  };
}
