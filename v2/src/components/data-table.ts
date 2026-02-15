import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  TableController,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type SortingState,
  type GroupingState,
  type ExpandedState,
} from '@tanstack/lit-table';

export interface ColSpec {
  title: string;
  field: string;
  cellStyle?: Record<string, string>;
  defaultSort?: 'asc' | 'desc';
  defaultGroupOrder?: number;
  link?: {
    prefix?: string;
    text?: string;
  };
}

export interface TableOptions {
  search?: boolean;
  paging?: boolean;
  filtering?: boolean;
  exportButton?: boolean;
  maxBodyHeight?: string;
  padding?: 'dense' | 'normal';
  grouping?: boolean;
  headerStyle?: Record<string, string>;
  tableLayout?: string;
}

@customElement('data-table')
export class DataTable extends LitElement {
  @property({ type: String, attribute: 'data-url' })
  dataUrl = '';

  @property({ type: String })
  label = '';

  @property({ type: Array })
  colspecs: ColSpec[] = [];

  @property({ type: Object })
  options: TableOptions = {};

  @state()
  private _data: Record<string, unknown>[] = [];

  @state()
  private _sorting: SortingState = [];

  @state()
  private _globalFilter = '';

  @state()
  private _grouping: GroupingState = [];

  @state()
  private _expanded: ExpandedState = true;

  @state()
  private _loading = true;

  private tableController = new TableController<Record<string, unknown>>(this);

  // Use light DOM for global CSS
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.dataUrl) {
      this._fetchData();
    }
  }

  private async _fetchData() {
    try {
      const resp = await fetch(this.dataUrl);
      this._data = await resp.json();

      // Set initial sorting from colspec defaultSort
      const sortCol = this.colspecs.find((c) => c.defaultSort);
      if (sortCol) {
        this._sorting = [{ id: sortCol.field, desc: sortCol.defaultSort === 'desc' }];
      }

      // Set initial grouping from colspec defaultGroupOrder
      if (this.options.grouping) {
        const groupCols = this.colspecs
          .filter((c) => c.defaultGroupOrder !== undefined)
          .sort((a, b) => (a.defaultGroupOrder ?? 0) - (b.defaultGroupOrder ?? 0));
        if (groupCols.length > 0) {
          this._grouping = groupCols.map((c) => c.field);
        }
      }
    } catch (err) {
      console.error('DataTable fetch error:', err);
      this._data = [];
    } finally {
      this._loading = false;
    }
  }

  private _buildColumns(): ColumnDef<Record<string, unknown>, unknown>[] {
    return this.colspecs.map((cs) => {
      const col: ColumnDef<Record<string, unknown>, unknown> = {
        accessorKey: cs.field,
        header: cs.title,
        enableGrouping: this.options.grouping ?? false,
      };

      if (cs.link) {
        const prefix = cs.link.prefix ?? '';
        const linkText = cs.link.text ?? '';
        col.cell = (info) => {
          const val = info.getValue() as string;
          if (!val) return '';
          const href = prefix + val;
          const display = linkText.length === 0 ? val : linkText;
          return html`<a href="${href}" target="_blank" rel="noopener">${display}</a>`;
        };
      }

      if (cs.cellStyle) {
        col.meta = { cellStyle: cs.cellStyle };
      }

      return col;
    });
  }

  private _handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    if (typeof updaterOrValue === 'function') {
      this._sorting = updaterOrValue(this._sorting);
    } else {
      this._sorting = updaterOrValue;
    }
  };

  private _handleSearchInput(e: InputEvent) {
    this._globalFilter = (e.target as HTMLInputElement).value;
  }

  private _exportCsv() {
    const table = this.tableController.table({
      columns: this._buildColumns(),
      data: this._data,
      getCoreRowModel: getCoreRowModel(),
    });

    const headers = this.colspecs.map((c) => c.title);
    const fields = this.colspecs.map((c) => c.field);
    const rows = table.getRowModel().rows.map((row) =>
      fields.map((f) => {
        const val = row.original[f];
        const str = String(val ?? '');
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
    );

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    if (this._loading) {
      return html`<div class="data-table-container"><p>Loading...</p></div>`;
    }

    const columns = this._buildColumns();
    const isDense = this.options.padding === 'dense';
    const maxHeight = this.options.maxBodyHeight ?? 'none';

    const tableOptions: Parameters<typeof this.tableController.table>[0] = {
      columns,
      data: this._data,
      state: {
        sorting: this._sorting,
        globalFilter: this._globalFilter,
        grouping: this._grouping,
        expanded: this._expanded,
      },
      onSortingChange: this._handleSortingChange,
      onExpandedChange: (updater) => {
        if (typeof updater === 'function') {
          this._expanded = updater(this._expanded);
        } else {
          this._expanded = updater;
        }
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      globalFilterFn: 'includesString',
    };

    if (this.options.grouping && this._grouping.length > 0) {
      tableOptions.getGroupedRowModel = getGroupedRowModel();
      tableOptions.getExpandedRowModel = getExpandedRowModel();
    }

    const table = this.tableController.table(tableOptions);
    const rowCount = table.getRowModel().rows.length;

    return html`
      <div class="data-table-container">
        <div class="data-table-toolbar">
          <div class="data-table-title">${unsafeHTML(this.label)}</div>
          <div class="data-table-toolbar-right">
            ${this.options.search
              ? html`<input
                  class="data-table-search"
                  type="text"
                  placeholder="Search..."
                  .value=${this._globalFilter}
                  @input=${this._handleSearchInput}
                />`
              : nothing}
            ${this.options.exportButton
              ? html`<button class="data-table-export" @click=${this._exportCsv}>
                  Export CSV
                </button>`
              : nothing}
          </div>
        </div>

        <div class="data-table-scroll" style="max-height: ${maxHeight}">
          <table class="data-table-table ${isDense ? 'dense' : ''}">
            <thead>
              ${repeat(
                table.getHeaderGroups(),
                (hg) => hg.id,
                (hg) => html`
                  <tr>
                    ${hg.headers.map(
                      (header) => html`
                        <th
                          colspan="${header.colSpan}"
                          @click=${header.column.getToggleSortingHandler()}
                          style="cursor: ${header.column.getCanSort() ? 'pointer' : 'default'}"
                        >
                          ${header.isPlaceholder
                            ? null
                            : html`${flexRender(header.column.columnDef.header, header.getContext())}${
                                header.column.getIsSorted() === 'asc'
                                  ? html`<span class="sort-indicator">\u25B2</span>`
                                  : header.column.getIsSorted() === 'desc'
                                    ? html`<span class="sort-indicator">\u25BC</span>`
                                    : nothing
                              }`}
                        </th>
                      `
                    )}
                  </tr>
                `
              )}
            </thead>
            <tbody>
              ${repeat(
                table.getRowModel().rows,
                (row) => row.id,
                (row) => {
                  if (row.getIsGrouped()) {
                    // Group header row
                    const groupCol = row.groupingColumnId!;
                    const groupValue = row.getValue(groupCol);
                    return html`
                      <tr class="group-header" @click=${row.getToggleExpandedHandler()}>
                        <td colspan="${columns.length}">
                          ${row.getIsExpanded() ? '\u25BC' : '\u25B6'}
                          ${String(groupValue)} (${row.subRows.length})
                        </td>
                      </tr>
                      ${row.getIsExpanded()
                        ? row.subRows.map(
                            (subRow) => html`
                              <tr>
                                ${subRow.getVisibleCells().map((cell) => {
                                  const meta = cell.column.columnDef.meta as { cellStyle?: Record<string, string> } | undefined;
                                  const style = meta?.cellStyle
                                    ? Object.entries(meta.cellStyle).map(([k, v]) => `${k}:${v}`).join(';')
                                    : '';
                                  return html`<td style="${style}">${flexRender(cell.column.columnDef.cell, cell.getContext())}</td>`;
                                })}
                              </tr>
                            `
                          )
                        : nothing}
                    `;
                  }
                  return html`
                    <tr>
                      ${row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as { cellStyle?: Record<string, string> } | undefined;
                        const style = meta?.cellStyle
                          ? Object.entries(meta.cellStyle).map(([k, v]) => `${k}:${v}`).join(';')
                          : '';
                        return html`<td style="${style}">${flexRender(cell.column.columnDef.cell, cell.getContext())}</td>`;
                      })}
                    </tr>
                  `;
                }
              )}
            </tbody>
          </table>
        </div>

        <div class="data-table-footer">${rowCount} record${rowCount !== 1 ? 's' : ''}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'data-table': DataTable;
  }
}
