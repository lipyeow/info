import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import type {
  A2UIComponent,
  UpdateComponentsMessage,
  ColumnComponent,
  RowComponent,
  TabsComponent,
  RichContentComponent,
  DataTableComponent,
  ImageComponent,
  HeadingComponent,
  MarkdownComponent,
  SectionComponent,
  ChatComponent,
} from './types.js';

export class A2UIRenderer {
  private componentMap: Map<string, A2UIComponent>;

  constructor(spec: UpdateComponentsMessage) {
    this.componentMap = new Map();
    for (const comp of spec.updateComponents.components) {
      this.componentMap.set(comp.id, comp);
    }
  }

  render(): TemplateResult {
    const root = this.componentMap.get('root');
    if (!root) {
      return html`<p>Error: no root component found</p>`;
    }
    return this.renderComponent(root);
  }

  renderChildById(id: string): TemplateResult {
    const comp = this.componentMap.get(id);
    if (!comp) {
      return html`<p>Error: component "${id}" not found</p>`;
    }
    return this.renderComponent(comp);
  }

  private renderComponent(comp: A2UIComponent): TemplateResult {
    switch (comp.component) {
      case 'Column':
        return this.renderColumn(comp);
      case 'Row':
        return this.renderRow(comp);
      case 'Tabs':
        return this.renderTabs(comp);
      case 'RichContent':
        return this.renderRichContent(comp);
      case 'DataTable':
        return this.renderDataTable(comp);
      case 'Image':
        return this.renderImage(comp);
      case 'Heading':
        return this.renderHeading(comp);
      case 'Markdown':
        return this.renderMarkdown(comp);
      case 'Section':
        return this.renderSection(comp);
      case 'Chat':
        return this.renderChat(comp);
      default:
        return html`<p>Unknown component: ${(comp as A2UIComponent).component}</p>`;
    }
  }

  private renderColumn(comp: ColumnComponent): TemplateResult {
    return html`
      <div class="a2ui-column">
        ${comp.children.map((childId) => this.renderChildById(childId))}
      </div>
    `;
  }

  private renderRow(comp: RowComponent): TemplateResult {
    return html`
      <div class="header-row">
        ${comp.children.map((childId) => this.renderChildById(childId))}
      </div>
    `;
  }

  private renderTabs(comp: TabsComponent): TemplateResult {
    return html`
      <a2ui-tabs-host
        .tabSpec=${comp.tabs}
        .renderer=${this}
      ></a2ui-tabs-host>
    `;
  }

  private renderRichContent(comp: RichContentComponent): TemplateResult {
    return html`
      <rich-content .htmlContent=${comp.htmlContent}></rich-content>
    `;
  }

  private renderDataTable(comp: DataTableComponent): TemplateResult {
    return html`
      <data-table
        data-url=${comp.dataUrl}
        label=${comp.label}
        .colspecs=${comp.colspecs}
        .options=${comp.options}
      ></data-table>
    `;
  }

  private renderImage(comp: ImageComponent): TemplateResult {
    const styles: string[] = [];
    if (comp.float) styles.push(`float:${comp.float}`);
    if (comp.width) styles.push(`width:${comp.width}`);
    if (comp.margin) styles.push(`margin:${comp.margin}`);
    const imgStyles: string[] = [];
    if (comp.width) imgStyles.push(`width:${comp.width}`);
    if (comp.height) imgStyles.push(`height:${comp.height}`);
    return html`
      <figure class="a2ui-image" style=${styles.join(';')}>
        <img src=${comp.src}
             alt=${comp.alt ?? ''}
             style=${imgStyles.join(';')}
             border=${comp.border ?? ''} />
        ${comp.caption
          ? html`<figcaption>${unsafeHTML(comp.caption)}</figcaption>`
          : nothing}
      </figure>
    `;
  }

  private renderHeading(comp: HeadingComponent): TemplateResult {
    const tag = `h${comp.level}`;
    return html`${unsafeHTML(`<${tag}>${comp.text}</${tag}>`)}`;
  }

  private renderMarkdown(comp: MarkdownComponent): TemplateResult {
    const htmlStr = marked.parse(comp.content) as string;
    return html`<div class="a2ui-markdown">${unsafeHTML(htmlStr)}</div>`;
  }

  private renderSection(comp: SectionComponent): TemplateResult {
    return html`
      <div class="a2ui-section">
        ${comp.children.map((childId) => this.renderChildById(childId))}
      </div>
    `;
  }

  private renderChat(comp: ChatComponent): TemplateResult {
    return html`<a2ui-chat
      .model=${comp.model ?? 'gpt-4o-mini'}
      .storageKeyPrefix=${comp.storageKeyPrefix ?? 'a2ui-chat'}
    ></a2ui-chat>`;
  }
}
