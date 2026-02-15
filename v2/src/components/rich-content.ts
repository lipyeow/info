import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('rich-content')
export class RichContent extends LitElement {
  @property({ type: String, attribute: 'html-content' })
  htmlContent = '';

  // Use light DOM so global CSS applies
  createRenderRoot() {
    return this;
  }

  render() {
    return html`${unsafeHTML(this.htmlContent)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rich-content': RichContent;
  }
}
