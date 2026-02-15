# lipyeow.github.io/info (v2)

A personal homepage built on a declarative component system (A2UI) rendered with Lit web components.

## Architecture

### Mental Model

The site is driven by a single **spec file** (`src/app-spec.ts`) that describes the entire page as a tree of typed components. A **renderer** (`src/a2ui/renderer.ts`) walks the tree and produces Lit `TemplateResult` HTML for each node. This means:

- **Content lives in `app-spec.ts`** — you edit text, add sections, and reorganize the page here.
- **Rendering logic lives in `renderer.ts`** — you only touch this when adding a new component *type*.
- **Tabular data lives in `public/data/*.json`** — tables fetch their rows at runtime via URL.

### Component Tree

```
root (Column)
├── header (Row)
│   ├── header-img (Image)
│   └── header-bio (RichContent)
└── tabs (Tabs)
    ├── tab-panel-0 (Column) — Computer Scientist
    │   ├── cs-intro (Markdown)
    │   ├── cs-edu-heading (Heading)
    │   ├── cs-edu-list (Markdown)
    │   ├── cs-pubs-heading (Heading)
    │   └── cs-pubs (DataTable → pubs.json)
    ├── tab-panel-1 (Column) — Educator
    │   ├── edu-intro (Markdown)
    │   ├── edu-students-heading (Heading)
    │   ├── edu-students (DataTable → students.json)
    │   ├── edu-courses-heading (Heading)
    │   └── edu-teaching (DataTable → teaching.json)
    ├── tab-panel-2 (Column) — Software Engineer
    │   ├── swe-intro (Markdown)
    │   ├── swe-patents-heading (Heading)
    │   ├── swe-patents-list (Markdown)
    │   ├── swe-projects-heading (Heading)
    │   └── swe-projects (DataTable → projects.json)
    └── tab-panel-3 (Column) — Martial Artist
        ├── ma-intro (Markdown)
        ├── ma-ilc-section (Section)
        │   ├── ma-ilc-img (Image, float left)
        │   ├── ma-ilc-heading (Heading)
        │   └── ma-ilc-text (Markdown)
        ├── ma-kalis-section (Section)
        │   └── ...
        └── ma-taiji-section (Section)
            └── ...
```

### A2UI Component Types

| Type | Renders as | Purpose |
|---|---|---|
| `Column` | `<div class="a2ui-column">` (flex column) | Vertical stack of children |
| `Row` | `<div class="header-row">` (flex row) | Horizontal layout (used for header) |
| `Tabs` | `<a2ui-tabs-host>` | Tab bar + tab panels |
| `RichContent` | `<rich-content>` (raw HTML via `unsafeHTML`) | Escape hatch for complex HTML |
| `DataTable` | `<data-table>` | Sortable/searchable/exportable table from JSON URL |
| `Image` | `<figure>` with `<img>` + optional `<figcaption>` | Images with float, caption, sizing |
| `Heading` | `<h1>`–`<h6>` | Section headings |
| `Markdown` | `<div class="a2ui-markdown">` (parsed via `marked`) | Prose content in Markdown |
| `Section` | `<div class="a2ui-section">` (block flow + clearfix) | Groups children with float clearing |

**Column vs Section**: `Column` uses flexbox — floated children won't work inside it. `Section` uses normal block flow with a clearfix `::after`, so `Image` components with `float` must be inside a `Section`, not a `Column`.

### File Map

```
v2/
├── index.html              Entry point (loads src/main.ts)
├── vite.config.ts          Vite config (base: '/info/')
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.ico
│   ├── data/               JSON data files for DataTable components
│   │   ├── pubs.json
│   │   ├── students.json
│   │   ├── teaching.json
│   │   ├── projects.json
│   │   └── education.json
│   └── img/                Static images
└── src/
    ├── main.ts             Bootstraps <app-root>, imports components & styles
    ├── app-spec.ts         Declarative page spec (all content lives here)
    ├── a2ui/
    │   ├── types.ts        Component interfaces & union type
    │   ├── renderer.ts     Spec → Lit HTML (one method per component type)
    │   └── tabs-host.ts    <a2ui-tabs-host> web component
    ├── components/
    │   ├── rich-content.ts <rich-content> web component (raw HTML)
    │   └── data-table.ts   <data-table> web component (TanStack Table)
    └── styles/
        ├── global.css      Layout, tabs, responsive rules
        └── data-table.css  Table-specific styles
```

### Key Dependencies

| Package | Purpose |
|---|---|
| `lit` | Web component framework (light DOM, `html` tagged templates) |
| `marked` | Markdown → HTML parser (synchronous `marked.parse()`) |
| `@tanstack/lit-table` + `@tanstack/table-core` | Headless table engine (sort, group, filter, export) |

All components use **light DOM** (`createRenderRoot() { return this; }`) so that `global.css` applies everywhere without shadow DOM piercing.

## Local Development Setup

### Prerequisites

- Node.js >= 18
- npm (comes with Node)

### Install & Run

```sh
cd v2
npm install
npm run dev
```

Vite dev server starts at `http://localhost:5173/info/`. Changes to any `src/` file trigger hot reload.

### Available Scripts

| Script | Command | What it does |
|---|---|---|
| `npm run dev` | `vite` | Start dev server with HMR |
| `npm run build` | `tsc && vite build` | Type-check then build to `dist/` |
| `npm run preview` | `vite preview` | Serve the `dist/` build locally |
| `npm run deploy` | `npm run build && gh-pages -d dist` | Build and push to `gh-pages` branch |

## Updating Content

### Edit text or restructure the page

All content is in **`src/app-spec.ts`**. Each component is an object in the `components` array with a unique `id`. Parent components reference children by `id` string.

**Add a paragraph**: Create a new `Markdown` component and add its `id` to the parent's `children` array.

```ts
{
  id: 'my-new-text',
  component: 'Markdown',
  content: `This is **bold** and this is a [link](https://example.com).`,
},
```

**Add a heading**: Use a `Heading` component (avoids raw HTML).

```ts
{
  id: 'my-heading',
  component: 'Heading',
  level: 2,
  text: 'New Section Title',
},
```

**Add an image with float**: Wrap it in a `Section` so the clearfix works.

```ts
{
  id: 'my-section',
  component: 'Section',
  children: ['my-img', 'my-section-text'],
},
{
  id: 'my-img',
  component: 'Image',
  src: 'https://example.com/photo.jpg',
  float: 'left',
  width: '400px',
  margin: '0 1em 1em 0',
  caption: '<i>Photo caption here</i>',
},
{
  id: 'my-section-text',
  component: 'Markdown',
  content: `Text that wraps around the floated image.`,
},
```

### Update table data

Edit the JSON files in `public/data/`. Each file is an array of objects whose keys match the `field` values in the `colspecs` of the corresponding `DataTable` component.

For example, to add a publication, append to `public/data/pubs.json`:

```json
{
  "title": "Paper Title",
  "venue": "SIGMOD",
  "year": 2026,
  "authors": "Lim, L. et al.",
  "pdf": "cv/papers/paper.pdf"
}
```

### Add a new tab

In `app-spec.ts`:

1. Add a new entry to the `tabs` component's `tabs` array:
   ```ts
   { title: 'New Tab', child: 'tab-panel-4' },
   ```
2. Define `tab-panel-4` as a `Column` with its children.
3. Define the children components.

## Creating New Component Types

If the existing 9 types don't cover your needs:

1. **Define the interface** in `src/a2ui/types.ts`:
   ```ts
   export interface MyWidgetComponent extends ComponentBase {
     component: 'MyWidget';
     // ... fields
   }
   ```
   Add it to the `A2UIComponent` union type.

2. **Add a render method** in `src/a2ui/renderer.ts`:
   ```ts
   private renderMyWidget(comp: MyWidgetComponent): TemplateResult {
     return html`<div class="a2ui-my-widget">...</div>`;
   }
   ```
   Add a `case 'MyWidget':` to `renderComponent()`.

3. **Add CSS** in `src/styles/global.css` (or a new stylesheet imported in `main.ts`).

4. **Use it** in `app-spec.ts` like any other component.

If the component needs its own state or lifecycle (like `DataTable` or `TabsHost`), create a Lit web component in `src/components/` and have the render method emit its custom element tag.

## Testing Locally

```sh
cd v2
npm run build        # type-check + bundle
npm run preview      # serve dist/ at http://localhost:4173/info/
```

Things to verify visually:

- Header: image left, bio right; stacks vertically on narrow screens
- All 4 tabs render and switch correctly
- Tables load data, sort, search, and export to CSV
- Martial Artist tab: images float beside text, clearfix separates sections
- Mobile (resize to < 768px): images go full-width, tabs scroll horizontally

## Deploying to GitHub Pages

```sh
cd v2
npm run deploy
```

This runs `tsc && vite build` then pushes `dist/` to the `gh-pages` branch via `gh-pages`. The site is served at `https://lipyeow.github.io/info/`.

Make sure the repo's GitHub Pages settings (Settings > Pages) are configured to deploy from the **`gh-pages` branch, root (`/`)**.
