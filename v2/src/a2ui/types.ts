import type { ColSpec, TableOptions } from '../components/data-table.js';

export interface ComponentBase {
  id: string;
  component: string;
}

export interface ColumnComponent extends ComponentBase {
  component: 'Column';
  children: string[];
}

export interface RowComponent extends ComponentBase {
  component: 'Row';
  children: string[];
}

export interface TabItem {
  title: string;
  child: string;
}

export interface TabsComponent extends ComponentBase {
  component: 'Tabs';
  tabs: TabItem[];
}

export interface RichContentComponent extends ComponentBase {
  component: 'RichContent';
  htmlContent: string;
}

export interface DataTableComponent extends ComponentBase {
  component: 'DataTable';
  dataUrl: string;
  label: string;
  colspecs: ColSpec[];
  options: TableOptions;
}

export interface ImageComponent extends ComponentBase {
  component: 'Image';
  src: string;
  alt?: string;
  caption?: string;
  float?: 'left' | 'right';
  width?: string;
  height?: string;
  margin?: string;
  border?: string;
}

export interface HeadingComponent extends ComponentBase {
  component: 'Heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface MarkdownComponent extends ComponentBase {
  component: 'Markdown';
  content: string;
}

export interface SectionComponent extends ComponentBase {
  component: 'Section';
  children: string[];
}

export interface ChatComponent extends ComponentBase {
  component: 'Chat';
  model?: string;
  storageKeyPrefix?: string;
}

export type A2UIComponent =
  | ColumnComponent
  | RowComponent
  | TabsComponent
  | RichContentComponent
  | DataTableComponent
  | ImageComponent
  | HeadingComponent
  | MarkdownComponent
  | SectionComponent
  | ChatComponent;

export interface UpdateComponentsMessage {
  version: string;
  updateComponents: {
    surfaceId: string;
    components: A2UIComponent[];
  };
}
