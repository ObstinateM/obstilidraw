import { Button } from '@nextui-org/react';
import { signIn } from 'next-auth/react';

export default function SignInButton({ providers }: any) {
  return (
    <>
      Not signed in <br />
      {providers &&
        Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <Button flat color="primary" auto onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
    </>
  );
}
