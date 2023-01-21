import config from '@/config';
import { Button, Navbar } from '@nextui-org/react';
import NavbarBase from './NavbarBase';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function NavbarHome() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const onCreate = async () => {
    const res = await fetch(`${config.url}/api/draw/create`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();

    router.push(`${config.url}/draw/edit/${json.id}`);
  };

  return (
    <NavbarBase
      leftContent={
        status === 'authenticated' ? (
          <Button auto ghost color="warning" onPress={onCreate} size="sm">
            New Draw
          </Button>
        ) : (
          <></>
        )
      }
    >
      <Navbar.Link isActive href="/">
        Home
      </Navbar.Link>
      <Navbar.Link href="#">Why</Navbar.Link>
      <Navbar.Link href="#">Pricing</Navbar.Link>
      <Navbar.Link href="#">Contribution</Navbar.Link>
    </NavbarBase>
  );
}
