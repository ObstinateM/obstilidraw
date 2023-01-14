import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState
} from '@excalidraw/excalidraw/types/types';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Draw({ initialData }: { initialData: ExcalidrawInitialDataState }) {
  const { data: session } = useSession();
  const [Comp, setComp] = useState<any>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  useEffect(() => {
    import('@excalidraw/excalidraw').then(comp => {
      setComp(comp.Excalidraw);
    });
  }, []);

  const saveComponent = async () => {
    if (!excalidrawAPI) {
      return;
    }

    // Why does excalidraw export an objet rather than an array
    // Knowing that it is supposed to be an array
    const state = excalidrawAPI.getAppState();
    state.collaborators = [];

    const body = {
      element: JSON.stringify(excalidrawAPI.getSceneElements()),
      state: JSON.stringify(state),
      file: JSON.stringify(excalidrawAPI.getFiles())
    };

    const res = await fetch('http://localhost:3000/api/draw/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  return (
    <>
      <button onClick={saveComponent}>Save</button>
      <div style={{ height: '500px', border: '2px solid black', borderRadius: '3px' }}>
        {session && Comp && (
          <Comp
            ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            initialData={initialData}
          />
        )}
      </div>
    </>
  );
}
