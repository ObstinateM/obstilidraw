import { Button, Loading, Text } from '@nextui-org/react';
import Head from 'next/head';
import style from '@/styles/index.module.css';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Obstilidraw</title>
          <meta name="description" content="A free alternative to excalidraw+" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={style['main']}>
          <Loading />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Obstilidraw</title>
        <meta name="description" content="A free alternative to excalidraw+" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style['main']}>
        {status === 'unauthenticated' && (
          <>
            <h1>You must sign-in in order to use the app.</h1>
            <Button color="warning" shadow onPress={() => signIn('google')}>
              Connect with Google
            </Button>
          </>
        )}

        {status === 'authenticated' && (
          <>
            <h1>You&apos;re logged in</h1>
            <Link href="/draw/list">Visit your draws</Link>
            <Text>This home page is early</Text>
          </>
        )}
      </main>
    </>
  );
}
