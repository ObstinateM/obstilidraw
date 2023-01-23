import config from '@/config';
import { Navbar, Text, Avatar, Dropdown, Button } from '@nextui-org/react';
import { styled } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import style from '@/styles/navbar.module.css';
import { Key } from 'react';
import { Frown, PenTool } from 'react-feather';
import { toast } from 'react-hot-toast';

export type NavbarBaseProps = {
  children?: any;
  leftContent?: any;
};

const Box = styled('div', {
  boxSizing: 'border-box'
});

export default function NavbarBase({ children, leftContent }: NavbarBaseProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push(`${config.url}/`);
  }

  const onDropdown = (actionKey: Key) => {
    switch (actionKey) {
      case 'profile':
        break;
      case 'new_draw':
        onCreate();
        break;
      case 'my_draw':
        router.push(`${config.url}/draw/list`);
        break;
      case 'settings':
        toast("There isn't settings for now", {
          duration: 2000,
          position: 'top-right',
          icon: <Frown />
        });
        break;
      case 'help_and_feedback':
        window.open('https://github.com/ObstinateM/obstilidraw/issues/new');
        break;
      case 'logout':
        signOut();
        break;
    }
  };

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
    <Box
      css={{
        maxW: '100%'
      }}
    >
      <Navbar variant="static" className={style.navbar}>
        <Navbar.Brand
          css={{
            '@xs': {
              w: '12%'
            }
          }}
        >
          <PenTool width="20" height="20" />
          <Text b color="inherit" css={{ marginLeft: '3px' }}>
            ObstiLidraw
          </Text>
        </Navbar.Brand>
        <Navbar.Content enableCursorHighlight activeColor="warning" hideIn="xs" variant="underline">
          {children}
        </Navbar.Content>
        <Navbar.Content
          css={{
            '@xs': {
              w: '12%',
              jc: 'flex-end'
            }
          }}
        >
          <Navbar.Item
            css={{
              '@xsMax': {
                w: '100%',
                jc: 'center'
              }
            }}
          >
            {leftContent}
          </Navbar.Item>
          <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="warning"
                  size="md"
                  referrerPolicy="no-referrer"
                  src={session!.user!.image as string}
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu aria-label="User menu actions" color="warning" onAction={onDropdown}>
              <Dropdown.Item key="profile" css={{ height: '$18' }}>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: 'flex' }}>
                  {session!.user!.name}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="new_draw" withDivider>
                New Draw
              </Dropdown.Item>
              <Dropdown.Item key="my_draw">My Draws</Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                My Settings
              </Dropdown.Item>
              <Dropdown.Item key="help_and_feedback">Help & Feedback</Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Content>
      </Navbar>
    </Box>
  );
}
