// tables.js — sortable, filterable data tables for NusaStat.
// buildSortableTable renders a table whose column headers sort the rows
// when clicked; a search input filters rows by text. All state lives in
// the returned object so the page can re-render on filter changes.

// Escape text that goes into table cells.
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// columns: [{ key, label, numeric, format(value, row) }]
// rows: array of plain objects.
export function buildSortableTable(container, columns, rows, options) {
  const state = {
    sortKey: (options && options.defaultSort) || columns[0].key,
    sortDir: (options && options.defaultDir) || 1,
    query: '',
    filter: null,
    columns,
    rows,
  };

  function visibleRows() {
    let out = state.rows.slice();
    if (state.filter) out = out.filter(state.filter);
    if (state.query) {
      const q = state.query.toLowerCase();
      out = out.filter((r) => columns.some((c) => String(r[c.key]).toLowerCase().includes(q)));
    }
    const col = columns.find((c) => c.key === state.sortKey);
    out.sort((a, b) => {
      const av = a[state.sortKey];
      const bv = b[state.sortKey];
      const cmp = col && col.numeric ? av - bv : String(av).localeCompare(String(bv));
      return cmp * state.sortDir;
    });
    return out;
  }

  function render() {
    const shown = visibleRows();
    let html = '<table class="data-table"><thead><tr>';
    for (const c of columns) {
      const active = c.key === state.sortKey;
      const arrow = active ? (state.sortDir === 1 ? ' ▲' : ' ▼') : '';
      html += '<th scope="col"><button type="button" class="sort-btn' + (active ? ' active' : '') + '" data-sort="' + c.key + '" aria-sort="' + (active ? (state.sortDir === 1 ? 'ascending' : 'descending') : 'none') + '">' + esc(c.label) + arrow + '</button></th>';
    }
    html += '</tr></thead><tbody>';
    if (shown.length === 0) {
      html += '<tr><td colspan="' + columns.length + '" class="empty-row">No provinces match that search.</td></tr>';
    }
    for (const r of shown) {
      html += '<tr>';
      for (const c of columns) {
        const v = c.format ? c.format(r[c.key], r) : esc(r[c.key]);
        html += '<td class="' + (c.numeric ? 'num' : '') + '">' + v + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    html += '<p class="table-count">' + shown.length + ' of ' + state.rows.length + ' rows shown.</p>';
    container.innerHTML = html;
    container.querySelectorAll('[data-sort]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sort');
        if (state.sortKey === key) {
          state.sortDir = -state.sortDir;
        } else {
          state.sortKey = key;
          state.sortDir = 1;
        }
        render();
      });
    });
  }

  render();
  return {
    setQuery(q) { state.query = q; render(); },
    setFilter(fn) { state.filter = fn; render(); },
    render,
  };
}
