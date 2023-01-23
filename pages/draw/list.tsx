import config, { defaultDrawImage } from '@/config';
import { PrismaClient } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NavbarList from '@/components/NavbarList';
import { Card, Text, Button, Row, Image, Loading } from '@nextui-org/react';
import { Trash } from 'react-feather';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ListModal from '@/components/ListModal';
import style from '@/styles/list.module.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const prisma = new PrismaClient();

export type DrawList = {
  id: number;
  title: string;
  author: string[];
  blob: string;
  createAt: Date;
  updatedAt: Date;
};

export type ListProps = {
  error: boolean;
  message: string;
  drawList: DrawList[];
};

export default function List({ error, message, drawList }: ListProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push(`${config.url}/`);
  }

  const [draws, setDraws] = useState<DrawList[]>(drawList);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onDelete = async (id: number) => {
    const res = await fetch(`${config.url}/api/draw/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id
      })
    });

    switch (res.status) {
      case 200:
        toast.success('Sucessfully deleted.');
        setDraws(d => d.filter((el: DrawList) => el.id !== id));
        break;
      case 404:
        toast.error('Draw not found in the database');
        break;
      default:
        toast.error('Server Error');
        break;
    }
  };

  if (error) {
    console.log(message);
  }

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Obstilidraw</title>
        <meta name="description" content="The list of all my draws" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavbarList />
      <ListModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        onDelete={onDelete}
        selectedId={selectedId}
      />
      <div className={style['list-container']}>
        {draws.length === 0 && (
          <>
            <div className={style['center']}>
              <Text h2>You have no draw here :c</Text>
              <Text h3>Create your first by using the button at the top right</Text>
            </div>
          </>
        )}
        {draws.map((el: DrawList) => {
          return (
            <Card css={{ mw: '330px' }} key={el.id}>
              <Card.Header>
                <Text b>{el.title}</Text>
              </Card.Header>
              <Card.Divider />
              <Card.Body css={{ py: '$10' }}>
                <Image
                  src={el.blob || defaultDrawImage}
                  alt={'Thumbnail for ' + el.title}
                  css={{ maxHeight: '200px' }}
                />
              </Card.Body>
              <Card.Divider />
              <Card.Footer>
                <Row justify="flex-end">
                  <Link href={`/draw/edit/${el.id}`}>
                    <Button css={{ width: '100%' }}>Edit</Button>
                  </Link>
                  <Button
                    auto
                    light
                    color="error"
                    icon={<Trash width="15px" />}
                    css={{ marginLeft: '10px' }}
                    onPress={() => {
                      setIsVisible(true);
                      setSelectedId(el.id);
                    }}
                  >
                    Delete
                  </Button>
                </Row>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: {
        error: true,
        message: 'You must sign in.',
        drawList: null
      }
    };
  }

  const drawList = await prisma.draw.findMany({
    select: {
      id: true,
      blob: true,
      title: true,
      author: true,
      createdAt: true,
      updatedAt: true
    },
    where: {
      author: {
        has: session.user!.email
      }
    }
  });

  return {
    props: {
      error: false,
      message: null,
      drawList: JSON.parse(JSON.stringify(drawList))
    }
  };
}
