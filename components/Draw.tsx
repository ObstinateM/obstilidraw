import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState
} from '@excalidraw/excalidraw/types/types';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Draw({ initialData }: { initialData: ExcalidrawInitialDataState }) {
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
      title: 'Hello world!',
      blob: `data:image/png;base64, ${base64}`,
      element: JSON.stringify(excalidrawAPI.getSceneElements()),
      state: JSON.stringify(state),
      file: JSON.stringify(excalidrawAPI.getFiles())
    };

    await fetch('http://localhost:3000/api/draw/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  };

  return (
    <>
      <button onClick={saveComponent}>Update</button>
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
