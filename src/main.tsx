import { StrictMode, useState, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enableMocking } from './lib/mswSetup.tsx'



function Root() {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (import.meta.env.NODE_ENV === 'development') {
        await enableMocking();
      }
      setMswReady(true);
    }
    init();
  }, []);

  if (!mswReady) return <div>Loading...</div>;

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);