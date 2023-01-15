import { PrismaClient } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NavbarApp from '@/components/NavbarApp';
import { Card, Grid, Text, Button, Row, Image } from '@nextui-org/react';
import { Trash } from 'react-feather';
import { useRouter } from 'next/router';
import Link from 'next/link';

const prisma = new PrismaClient();

export type ListProps = {
  error: boolean;
  message: string;
  drawList: {
    id: number;
    title: string;
    author: string[];
    blob: string;
    createAt: Date;
    updatedAt: Date;
  }[];
};

export default function List({ error, message, drawList }: ListProps) {
  const onDelete = async (id: number) => {
    const res = await fetch('http://localhost:3000/api/draw/delete', {
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
        console.log('DONE');
        break;
      case 404:
        console.log('Not found');
        break;
      default:
        console.log('Server error');
        break;
    }
  };

  return (
    <>
      <NavbarApp />
      {drawList.map((el: any) => {
        return (
          <Grid.Container gap={2} key={el.id}>
            <Grid sm={12} md={5}>
              <Card css={{ mw: '330px' }}>
                <Card.Header>
                  <Text b>{el.title}</Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ py: '$10' }}>
                  <Image src={el.blob} alt={'Thumbnail for ' + el.title} />
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
                      onClick={() => onDelete(el.id)}
                    >
                      Delete
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Grid>
          </Grid.Container>
        );
      })}
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
