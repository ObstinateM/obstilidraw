import { Button, Navbar } from '@nextui-org/react';
import NavbarBase from './NavbarBase';
import { useRouter } from 'next/router';
import config from '@/config';

export default function NavbarList() {
  const router = useRouter();

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
        <Button auto ghost color="warning" onPress={onCreate} size="sm">
          New Draw
        </Button>
      }
    >
      <Navbar.Link isActive href="#">
        My Draws
      </Navbar.Link>
    </NavbarBase>
  );
}
