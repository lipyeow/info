import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

// Register custom components
import './components/rich-content.js';
import './components/data-table.js';
import './components/chat.js';
import './a2ui/tabs-host.js';

// Import styles
import './styles/global.css';
import './styles/data-table.css';
import './styles/chat.css';

// Import A2UI spec and renderer
import { appSpec } from './app-spec.js';
import { A2UIRenderer } from './a2ui/renderer.js';

@customElement('app-root')
export class AppRoot extends LitElement {
  private renderer = new A2UIRenderer(appSpec);

  // Use light DOM so global CSS applies
  createRenderRoot() {
    return this;
  }

  render() {
    return this.renderer.render();
  }
}

// Mount the app
const appEl = document.querySelector('#app');
if (appEl) {
  const root = document.createElement('app-root');
  appEl.appendChild(root);
}
