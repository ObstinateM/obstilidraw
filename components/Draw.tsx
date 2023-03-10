import config from '@/config';
import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState
} from '@excalidraw/excalidraw/types/types';
import { Button, Input } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useState, useEffect, RefObject, forwardRef, ForwardedRef, useRef } from 'react';
import { Save, Trash } from 'react-feather';
import toast from 'react-hot-toast';

export type DrawProps = {
  initialData: ExcalidrawInitialDataState;
  id: number;
  titleRef: RefObject<HTMLInputElement>;
};

export default function Draw({ initialData, id, titleRef }: DrawProps) {
  const { data: session } = useSession();
  const [Comp, setComp] = useState<any>(null);
  const [excalidrawModule, setExcalidrawModule] = useState<any>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then(comp => {
      setComp(comp.Excalidraw);
      setExcalidrawModule(comp);
    });
  }, []);

  const saveComponent = async () => {
    try {
      if (!excalidrawAPI && !excalidrawModule) {
        return;
      }

      // Why does excalidraw export an objet rather than an array
      // Knowing that it is supposed to be an array
      const state = excalidrawAPI.getAppState();
      state.collaborators = [];

      const blob = await excalidrawModule.exportToBlob({
        elements: excalidrawAPI?.getSceneElements(),
        mimeType: 'image/png',
        appState: state,
        files: excalidrawAPI?.getFiles()
      });

      const buff = await blob.arrayBuffer();
      const base64 = Buffer.from(buff).toString('base64');

      const body = {
        id,
        title: titleRef?.current?.value,
        blob: `data:image/png;base64, ${base64}`,
        element: JSON.stringify(excalidrawAPI.getSceneElements()),
        state: JSON.stringify(state),
        file: JSON.stringify(excalidrawAPI.getFiles())
      };

      const res = await fetch(`${config.url}/api/draw/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      toast.success("Successfully saved.");
      console.log('Prod debug', res);
    } catch (error) {
      toast.error(error as any);
    }
  };

  return (
    <>
      <div
        style={{
          height: 'calc(100vh - var(--nextui--navbarHeight) - 1px)',
          borderTop: '1px solid black'
        }}
      >
        {session && Comp && (
          <Comp
            ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            initialData={initialData}
          >
            <excalidrawModule.WelcomeScreen>
              <excalidrawModule.WelcomeScreen.Center>
                <excalidrawModule.WelcomeScreen.Center.Logo />
                <excalidrawModule.WelcomeScreen.Center.Heading>
                  Obstilidraw is Excalidraw+ but self hosted
                </excalidrawModule.WelcomeScreen.Center.Heading>
                <excalidrawModule.WelcomeScreen.Center.Menu>
                  <excalidrawModule.WelcomeScreen.Center.MenuItemLoadScene />
                  <excalidrawModule.WelcomeScreen.Center.MenuItemHelp />
                </excalidrawModule.WelcomeScreen.Center.Menu>
              </excalidrawModule.WelcomeScreen.Center>
            </excalidrawModule.WelcomeScreen>
            <excalidrawModule.MainMenu>
              <excalidrawModule.MainMenu.Group title="File action">
                <excalidrawModule.MainMenu.DefaultItems.LoadScene />
                <excalidrawModule.MainMenu.Item onSelect={saveComponent} icon={<Save />}>
                  Save to cloud
                </excalidrawModule.MainMenu.Item>
                <excalidrawModule.MainMenu.DefaultItems.Export />
                <excalidrawModule.MainMenu.Item onSelect={() => {}} icon={<Trash />}>
                  Delete from cloud
                </excalidrawModule.MainMenu.Item>
              </excalidrawModule.MainMenu.Group>
              <excalidrawModule.MainMenu.Group title="Others">
                <excalidrawModule.MainMenu.DefaultItems.Help />
                <excalidrawModule.MainMenu.DefaultItems.ClearCanvas />
                <excalidrawModule.MainMenu.DefaultItems.ToggleTheme />
                <excalidrawModule.MainMenu.DefaultItems.ChangeCanvasBackground />
              </excalidrawModule.MainMenu.Group>
            </excalidrawModule.MainMenu>
            <excalidrawModule.Footer>
              <Button onPress={() => saveComponent()} color="warning" bordered>
                Save to cloud
              </Button>
            </excalidrawModule.Footer>
          </Comp>
        )}
      </div>
    </>
  );
}
