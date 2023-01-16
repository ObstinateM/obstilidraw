import { Button, Navbar } from '@nextui-org/react';
import NavbarBase from './NavbarBase';
import { useRouter } from 'next/router';

export default function NavbarList() {
  const router = useRouter();

  const onCreate = async () => {
    const res = await fetch('http://localhost:3000/api/draw/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();

    router.push(`http://localhost:3000/draw/edit/${json.id}`);
  };

  return (
    <NavbarBase
      leftContent={
        <Button auto ghost color="warning" onPress={onCreate} size="sm">
          New Draw
        </Button>
      }
    >
      <Navbar.Link href="http://localhost:3000/">Home</Navbar.Link>
      <Navbar.Link isActive href="#">
        My Draws
      </Navbar.Link>
    </NavbarBase>
  );
}
