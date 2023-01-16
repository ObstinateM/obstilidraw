import { Input, Navbar } from '@nextui-org/react';
import NavbarBase from './NavbarBase';
import { RefObject } from 'react';

export type NavbarDrawProps = {
  title: string;
  placeholder: string;
  myRef: RefObject<HTMLInputElement>;
};

export default function NavbarDraw({ title, placeholder, myRef }: NavbarDrawProps) {
  return (
    <NavbarBase leftContent={<></>}>
      <Navbar.Link href="http://localhost:3000/draw/list">My Draws</Navbar.Link>
      <Input placeholder={placeholder} initialValue={title} ref={myRef} aria-label="Draw Title" />
    </NavbarBase>
  );
}
