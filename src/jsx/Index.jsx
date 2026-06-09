import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import UNCTADSitePreview from './components/general/UNCTADSitePreview.jsx';

const isLocalhost = window.location.hostname !== 'unctad.org';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}`);
const root = createRoot(container);
root.render(
  isLocalhost ? (
    <UNCTADSitePreview>
      <App />
    </UNCTADSitePreview>
  ) : (
    <App />
  )
);
