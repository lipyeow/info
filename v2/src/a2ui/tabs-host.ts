import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TabItem } from './types.js';
import type { A2UIRenderer } from './renderer.js';

@customElement('a2ui-tabs-host')
export class A2UITabsHost extends LitElement {
  @property({ type: Array })
  tabSpec: TabItem[] = [];

  @property({ attribute: false })
  renderer!: A2UIRenderer;

  @state()
  private _activeTab = 0;

  createRenderRoot() {
    return this;
  }

  private _handleTabClick(idx: number) {
    this._activeTab = idx;
  }

  render() {
    return html`
      <div class="tab-bar">
        ${this.tabSpec.map(
          (tab, idx) => html`
            <button
              class=${this._activeTab === idx ? 'active' : ''}
              @click=${() => this._handleTabClick(idx)}
            >
              ${tab.title}
            </button>
          `
        )}
      </div>
      ${this.tabSpec.map(
        (tab, idx) => html`
          <div class="tab-panel ${this._activeTab === idx ? 'active' : ''}">
            ${this.renderer.renderChildById(tab.child)}
          </div>
        `
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'a2ui-tabs-host': A2UITabsHost;
  }
}
