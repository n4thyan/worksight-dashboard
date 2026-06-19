const state = { rows: [], filtered: [], charts: {} };

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-GB');
const chartPalette = ['#2563eb', '#0f766e', '#7c3aed', '#ea580c', '#475569', '#16a34a'];

const el = {
  loadSample: document.getElementById('loadSampleBtn'),
  upload: document.getElementById('csvUpload'),
  print: document.getElementById('printBtn'),
  copy: document.getElementById('copySummaryBtn'),
  reset: document.getElementById('resetFiltersBtn'),
  start: document.getElementById('startDate'),
  end: document.getElementById('endDate'),
  department: document.getElementById('departmentFilter'),
  status: document.getElementById('statusFilter'),
  kpis: document.getElementById('kpiGrid'),
  count: document.getElementById('recordCount'),
  insights: document.getElementById('insightList'),
  quality: document.getElementById('qualityList'),
  table: document.getElementById('dataTableBody')
};

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitLine(lines.shift()).map((h) => h.trim().toLowerCase());
  return lines.filter(Boolean).map((line) => {
    const values = splitLine(line);
    const row = {};
    headers.forEach((header, index) => { row[header] = values[index] || ''; });
    return normalise(row);
  });
}

function splitLine(line) {
  const output = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { output.push(value.trim()); value = ''; }
    else value += char;
  }
  output.push(value.trim());
  return output;
}

function normalise(row) {
  return {
    date: row.date || '',
    department: row.department || 'Uncategorised',
    category: row.category || 'General',
    status: row.status || 'Unknown',
    revenue: Number(row.revenue || 0),
    cost: Number(row.cost || 0),
    tickets: Number(row.tickets || 0),
    response_hours: Number(row.response_hours || 0),
    satisfaction: Number(row.satisfaction || 0)
  };
}

async function loadSample() {
  const response = await fetch('data/sample-business-data.csv');
  const text = await response.text();
  loadRows(parseCsv(text));
}

function loadRows(rows) {
  state.rows = rows.filter((row) => row.date);
  const dates = state.rows.map((row) => row.date).sort();
  el.start.value = dates[0] || '';
  el.end.value = dates[dates.length - 1] || '';
  fillSelect(el.department, unique('department'), 'All departments');
  fillSelect(el.status, unique('status'), 'All statuses');
  applyFilters();
}

function unique(key) {
  return [...new Set(state.rows.map((row) => row[key]).filter(Boolean))].sort();
}

function fillSelect(select, values, label) {
  select.replaceChildren(new Option(label, 'all'));
  values.forEach((value) => select.appendChild(new Option(value, value)));
}

function applyFilters() {
  state.filtered = state.rows.filter((row) => {
    return (!el.start.value || row.date >= el.start.value)
      && (!el.end.value || row.date <= el.end.value)
      && (el.department.value === 'all' || row.department === el.department.value)
      && (el.status.value === 'all' || row.status === el.status.value);
  });
  render();
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function metrics(rows) {
  const revenue = sum(rows, 'revenue');
  const cost = sum(rows, 'cost');
  const satisfactionRows = rows.filter((row) => row.satisfaction > 0);
  return {
    revenue,
    cost,
    profit: revenue - cost,
    tickets: sum(rows, 'tickets'),
    open: rows.filter((row) => ['open', 'overdue'].includes(row.status.toLowerCase())).length,
    overdue: rows.filter((row) => row.status.toLowerCase() === 'overdue').length,
    satisfaction: satisfactionRows.length ? sum(satisfactionRows, 'satisfaction') / satisfactionRows.length : 0,
    response: rows.length ? sum(rows, 'response_hours') / rows.length : 0,
    aov: rows.length ? revenue / rows.length : 0
  };
}

function render() {
  const rows = state.filtered;
  const m = metrics(rows);
  el.count.textContent = `${rows.length} row${rows.length === 1 ? '' : 's'}`;
  renderKpis(m, rows);
  renderCharts(rows);
  renderInsights(rows, m);
  renderQuality(rows);
  renderTable(rows);
}

function renderKpis(m, rows) {
  const cards = [
    ['Revenue', money.format(m.revenue), `${rows.length} filtered records`],
    ['Profit', money.format(m.profit), `${money.format(m.cost)} tracked cost`],
    ['Avg order value', money.format(m.aov), 'Revenue per row'],
    ['Open / overdue', number.format(m.open), `${m.overdue} overdue`],
    ['Satisfaction', m.satisfaction ? `${m.satisfaction.toFixed(1)}/5` : 'n/a', `Avg response ${m.response.toFixed(1)}h`]
  ];
  el.kpis.replaceChildren(...cards.map(([title, value, note]) => {
    const card = document.createElement('article');
    card.className = 'kpi-card';
    const small = document.createElement('span');
    small.textContent = title;
    const strong = document.createElement('strong');
    strong.textContent = value;
    const p = document.createElement('p');
    p.textContent = note;
    card.append(small, strong, p);
    return card;
  }));
}

function group(rows, key, valueKey) {
  const result = {};
  rows.forEach((row) => {
    const name = row[key] || 'Unknown';
    result[name] = (result[name] || 0) + (valueKey ? Number(row[valueKey] || 0) : 1);
  });
  return Object.entries(result).sort((a, b) => b[1] - a[1]);
}

function byMonth(rows) {
  const result = {};
  rows.forEach((row) => {
    const month = row.date.slice(0, 7);
    result[month] = (result[month] || 0) + row.revenue;
  });
  return Object.entries(result).sort((a, b) => a[0].localeCompare(b[0]));
}

function renderCharts(rows) {
  drawLine('revenueChart', byMonth(rows));
  drawDoughnut('departmentChart', group(rows, 'department', 'revenue'));
  drawDoughnut('statusChart', group(rows, 'status'));
}

function drawLine(id, entries) {
  destroy(id);
  state.charts[id] = new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels: entries.map((x) => x[0]),
      datasets: [{
        label: 'Revenue',
        data: entries.map((x) => x[1]),
        tension: 0.28,
        borderWidth: 2,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        pointBackgroundColor: '#2563eb',
        pointRadius: 3,
        fill: true
      }]
    },
    options: chartOptions()
  });
}

function drawDoughnut(id, entries) {
  destroy(id);
  state.charts[id] = new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels: entries.map((x) => x[0]),
      datasets: [{
        data: entries.map((x) => x[1]),
        backgroundColor: entries.map((_, index) => chartPalette[index % chartPalette.length]),
        borderColor: '#ffffff',
        borderWidth: 3
      }]
    },
    options: { ...chartOptions(), plugins: { legend: { position: 'bottom', labels: { color: '#334155' } } } }
  });
}

function chartOptions() {
  return {
    responsive: true,
    plugins: { legend: { labels: { color: '#334155' } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.18)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.18)' } }
    }
  };
}

function destroy(id) {
  if (state.charts[id]) state.charts[id].destroy();
}

function renderInsights(rows, m) {
  const notes = [];
  const departments = group(rows, 'department', 'revenue');
  const months = byMonth(rows);
  if (!rows.length) notes.push('No rows match the current filters.');
  else {
    if (departments[0]) notes.push(`${departments[0][0]} is the highest revenue department at ${money.format(departments[0][1])}.`);
    notes.push(m.overdue ? `${m.overdue} overdue item${m.overdue === 1 ? '' : 's'} need attention.` : 'No overdue rows appear in this view.');
    if (months.length > 1) notes.push(`Latest month revenue is ${money.format(months[months.length - 1][1])}.`);
    if (m.satisfaction) notes.push(`Average satisfaction is ${m.satisfaction.toFixed(1)}/5.`);
  }
  renderList(el.insights, notes);
}

function renderQuality(rows) {
  const notes = [];
  const zeroRevenue = rows.filter((row) => row.revenue === 0).length;
  const slow = rows.filter((row) => row.response_hours > 24).length;
  notes.push(`${rows.length} rows are included in the current view.`);
  if (zeroRevenue) notes.push(`${zeroRevenue} rows have zero revenue. This may be normal for admin or support work.`);
  if (slow) notes.push(`${slow} rows have response times above 24 hours.`);
  if (!zeroRevenue && !slow) notes.push('No obvious zero-revenue or slow-response warnings in this view.');
  renderList(el.quality, notes);
}

function renderList(list, notes) {
  list.replaceChildren(...notes.map((note) => {
    const item = document.createElement('li');
    item.textContent = note;
    return item;
  }));
}

function renderTable(rows) {
  const fragment = document.createDocumentFragment();
  rows.slice(0, 80).forEach((row) => {
    const tr = document.createElement('tr');
    [row.date, row.department, row.category, row.status, money.format(row.revenue), money.format(row.cost), number.format(row.tickets), row.satisfaction ? row.satisfaction.toFixed(1) : 'n/a'].forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  el.table.replaceChildren(fragment);
}

function copySummary() {
  const m = metrics(state.filtered);
  const text = `WorkSight Dashboard summary\nRows: ${state.filtered.length}\nRevenue: ${money.format(m.revenue)}\nProfit: ${money.format(m.profit)}\nOpen/overdue: ${m.open}`;
  navigator.clipboard.writeText(text).then(() => {
    el.copy.textContent = 'Copied';
    setTimeout(() => { el.copy.textContent = 'Copy summary'; }, 1200);
  });
}

el.loadSample.addEventListener('click', loadSample);
el.upload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  loadRows(parseCsv(await file.text()));
});
el.print.addEventListener('click', () => window.print());
el.copy.addEventListener('click', copySummary);
el.reset.addEventListener('click', () => loadRows(state.rows));
[el.start, el.end, el.department, el.status].forEach((control) => control.addEventListener('change', applyFilters));

loadSample().catch(() => renderList(el.insights, ['Sample data could not be loaded. Upload a CSV file instead.']));