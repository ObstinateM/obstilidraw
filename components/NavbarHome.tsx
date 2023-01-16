import { Navbar } from '@nextui-org/react';
import NavbarBase from './NavbarBase';

export default function NavbarHome() {
  return (
    <NavbarBase leftContent={<></>}>
      <Navbar.Link isActive href="/">
        Home
      </Navbar.Link>
      <Navbar.Link href="#">Why</Navbar.Link>
      <Navbar.Link href="#">Pricing</Navbar.Link>
      <Navbar.Link href="#">Contribution</Navbar.Link>
    </NavbarBase>
  );
}
