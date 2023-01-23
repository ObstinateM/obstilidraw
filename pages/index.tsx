import { Button } from '@nextui-org/react';
import Head from 'next/head';
import style from '@/styles/index.module.css';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Obstilidraw</title>
        <meta name="description" content="A free alternative to excalidraw+" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={style['main']}>
        <h1>You must sign-in in order to use the app.</h1>
        <Button color="warning" shadow onPress={() => signIn('google')}>
          Connect with Google
        </Button>
      </main>
    </>
  );
}
