import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import SignInButton from './SignInButton';

export default function NavbarApp({ providers }: any) {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <SignInButton providers={providers} />
    </>
  );
}
