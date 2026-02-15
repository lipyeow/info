import { LitElement, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Register custom components
import './components/rich-content.js';
import './components/data-table.js';

// Import styles
import './styles/global.css';
import './styles/data-table.css';

// Import spec data
import {
  headerImageHtml,
  headerBioHtml,
  computerScientistHtml,
  educatorHtml,
  coursesHeadingHtml,
  softwareEngineerHtml,
  martialArtistHtml,
  tabDefs,
  tPub,
  tStu,
  tTeach,
  tProjects,
} from './spec/app-messages.js';
import type { TableDef } from './spec/app-messages.js';

function renderTable(t: TableDef) {
  return html`
    <data-table
      data-url=${t.dataUrl}
      label=${t.label}
      .colspecs=${t.colspecs}
      .options=${t.options}
    ></data-table>
  `;
}

@customElement('app-root')
export class AppRoot extends LitElement {
  @state()
  private _activeTab = 0;

  // Use light DOM so global CSS applies
  createRenderRoot() {
    return this;
  }

  private _handleTabClick(idx: number) {
    this._activeTab = idx;
  }

  render() {
    return html`
      <!-- Header -->
      <div class="header-row">
        <rich-content .htmlContent=${headerImageHtml}></rich-content>
        <rich-content .htmlContent=${headerBioHtml}></rich-content>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar">
        ${tabDefs.map(
          (tab, idx) => html`
            <button
              class=${this._activeTab === idx ? 'active' : ''}
              @click=${() => this._handleTabClick(idx)}
            >
              ${tab.label}
            </button>
          `
        )}
      </div>

      <!-- Tab Panels -->
      <div class="tab-panel ${this._activeTab === 0 ? 'active' : ''}">
        <rich-content .htmlContent=${computerScientistHtml}></rich-content>
        ${renderTable(tPub)}
      </div>

      <div class="tab-panel ${this._activeTab === 1 ? 'active' : ''}">
        <rich-content .htmlContent=${educatorHtml}></rich-content>
        ${renderTable(tStu)}
        <rich-content .htmlContent=${coursesHeadingHtml}></rich-content>
        ${renderTable(tTeach)}
      </div>

      <div class="tab-panel ${this._activeTab === 2 ? 'active' : ''}">
        <rich-content .htmlContent=${softwareEngineerHtml}></rich-content>
        ${renderTable(tProjects)}
      </div>

      <div class="tab-panel ${this._activeTab === 3 ? 'active' : ''}">
        <rich-content .htmlContent=${martialArtistHtml}></rich-content>
      </div>
    `;
  }
}

// Mount the app
const appEl = document.querySelector('#app');
if (appEl) {
  const root = document.createElement('app-root');
  appEl.appendChild(root);
}
