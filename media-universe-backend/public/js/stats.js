// public/js/stats.js — Page 10: Statistics (User Flow 10) and account management.
//   admin     -> sees every number and the account list (read only)
//   developer -> can also change roles and delete accounts

// Horizontal bars: one per row, value printed as text, details on hover.
// rows: [{ name, value, tip, href? }]
function bars(rows) {
  if (!rows.length) return '<p class="muted">No data yet.</p>';
  const max = Math.max(...rows.map((r) => r.value), 1);
  return rows.map((r) => {
    const name = r.href ? `<a href="${r.href}">${esc(r.name)}</a>` : esc(r.name);
    return `
      <div class="bar-row">
        <span class="name" title="${esc(r.name)}">${name}</span>
        <span class="track"><span class="bar" style="display:block;width:${(r.value / max) * 100}%"></span></span>
        <span class="num">${esc(r.label ?? r.value)}</span>
        <span class="bar-tip">${esc(r.tip)}</span>
      </div>`;
  }).join('');
}

async function loadOverview() {
  const s = await api('/stats');
  const t = s.totals;
  const tiles = [
    ['Titles', t.media], ['Movies', t.movies], ['Series', t.series], ['Books', t.books],
    ['Universes', t.universes], ['Accounts', t.accounts], ['Watchlist saves', t.watchlist_entries],
    ['Total visits', t.visits]
  ];
  $('#tiles').innerHTML = tiles.map(([label, value]) =>
    `<div class="tile"><div class="value">${value}</div><div class="label">${label}</div></div>`).join('');

  $('#by-genre').innerHTML = bars(s.media_by_genre.filter((g) => g.count > 0).map((g) => ({
    name: g.genre_name, value: g.count, tip: `${g.count} titles · average ★ ${g.avg_rating}`
  })));
  $('#by-universe').innerHTML = bars(s.media_by_universe.map((u) => ({
    name: u.universe_name, value: u.count, tip: `${u.count} titles · average ★ ${u.avg_rating}`
  })));
  $('#top-watch').innerHTML = bars(s.top_watchlisted.map((m) => ({
    name: m.title, value: m.watchlist_count, href: `media.html?id=${m.id}`,
    tip: `saved by ${m.watchlist_count} user${m.watchlist_count === 1 ? '' : 's'}`
  })));
  $('#top-rated').innerHTML = bars(s.top_rated.map((m) => ({
    name: m.title, value: m.rating, label: m.rating.toFixed(1), href: `media.html?id=${m.id}`, tip: `★ ${m.rating.toFixed(1)}`
  })));
}

async function loadGroups() {
  const by = $('#group-by').value, sort = $('#sort-by').value;
  const data = await api(`/stats/group?by=${by}&sort=${sort}`);
  const max = Math.max(...data.groups.map((g) => g.media_count), 1);
  $('#group-table').innerHTML = `
    <thead><tr>
      <th>${esc($('#group-by').selectedOptions[0].textContent)}</th><th style="width:30%">Titles</th>
      <th class="num">Count</th><th class="num">Avg rating</th><th class="num">Best</th><th class="num">Watchlist saves</th>
    </tr></thead>
    <tbody>${data.groups.map((g) => `
      <tr>
        <td>${esc(g.group_name)}</td>
        <td><div class="bar-row" style="grid-template-columns:1fr;padding:0"><span class="track">
          <span class="bar" style="display:block;width:${(g.media_count / max) * 100}%"></span></span></div></td>
        <td class="num">${g.media_count}</td>
        <td class="num">${g.avg_rating.toFixed(2)}</td>
        <td class="num">${g.best_rating.toFixed(1)}</td>
        <td class="num">${g.watchlist_count}</td>
      </tr>`).join('')}
    </tbody>`;
}

// ------------------------------------------------------------ visits over time
const SVG_NS = 'http://www.w3.org/2000/svg';
const shortDate = (day) => new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const plural = (n) => `${n.toLocaleString()} visit${n === 1 ? '' : 's'}`;

// Round the top of the y axis up to a clean number, with whole-number ticks.
function yTicks(max) {
  const rough = Math.max(max, 1) / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = Math.max(1, [1, 2, 5, 10].map((s) => s * power).find((s) => s >= rough));
  const ticks = [];
  for (let v = 0; v < max || v === 0; v += step) ticks.push(v);
  ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

// One line in plain SVG. Redrawn at the real width so text never scales.
// points: [{ day, visits }]
function lineChart(box, points) {
  const width = box.clientWidth, height = 260;
  const m = { top: 14, right: 44, bottom: 28, left: 40 };
  const ticks = yTicks(Math.max(...points.map((p) => p.visits)));
  const top = ticks[ticks.length - 1];
  const x = (i) => m.left + (i / (points.length - 1)) * (width - m.left - m.right);
  const y = (v) => height - m.bottom - (v / top) * (height - m.top - m.bottom);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.visits).toFixed(1)}`).join('');
  const last = points.length - 1;
  const labelCount = width < 480 ? 3 : Math.min(points.length, 7);   // 7 days: every day gets a label
  const labelled = [...new Set(Array.from({ length: labelCount }, (_, i) => Math.round((i * last) / (labelCount - 1))))];

  box.innerHTML = `
    <svg xmlns="${SVG_NS}" width="${width}" height="${height}" tabindex="0" role="img"
         aria-label="Visits per day from ${esc(points[0].day)} to ${esc(points[last].day)}. Use the arrow keys to read each day.">
      ${ticks.map((t) => `
        <line class="grid-line" x1="${m.left}" x2="${width - m.right}" y1="${y(t)}" y2="${y(t)}"></line>
        <text class="axis-text" x="${m.left - 8}" y="${y(t) + 4}" text-anchor="end">${t.toLocaleString()}</text>`).join('')}
      ${labelled.map((i) => `
        <text class="axis-text" x="${x(i)}" y="${height - 8}" text-anchor="${i === 0 ? 'start' : i === last ? 'end' : 'middle'}">${esc(shortDate(points[i].day))}</text>`).join('')}
      <path class="line-area" d="${path}L${x(last)},${y(0)}L${x(0)},${y(0)}Z"></path>
      <path class="line-mark" d="${path}"></path>
      <circle class="line-dot" cx="${x(last)}" cy="${y(points[last].visits)}" r="5"></circle>
      <text class="end-label" x="${x(last) + 10}" y="${y(points[last].visits) + 4}">${points[last].visits.toLocaleString()}</text>
      <line class="crosshair hidden" y1="${m.top}" y2="${y(0)}"></line>
      <circle class="line-dot hover-dot hidden" r="5"></circle>
    </svg>
    <div class="chart-tip hidden"><strong></strong><span></span></div>`;

  const svg = $('svg', box), tip = $('.chart-tip', box), cross = $('.crosshair', box), dot = $('.hover-dot', box);
  let current = last;
  const show = (i) => {
    current = i;
    const p = points[i];
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i));
    dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(p.visits));
    $('strong', tip).textContent = plural(p.visits);
    $('span', tip).textContent = shortDate(p.day);
    [cross, dot, tip].forEach((el) => el.classList.remove('hidden'));
    const left = Math.min(x(i) + 12, width - tip.offsetWidth - 4);
    tip.style.left = `${x(i) + 12 + tip.offsetWidth > width ? x(i) - tip.offsetWidth - 12 : left}px`;
    tip.style.top = `${m.top}px`;
  };
  const hide = () => [cross, dot, tip].forEach((el) => el.classList.add('hidden'));
  svg.addEventListener('pointermove', (e) => {
    const px = e.clientX - svg.getBoundingClientRect().left;
    show(Math.max(0, Math.min(last, Math.round(((px - m.left) / (width - m.left - m.right)) * last))));
  });
  svg.addEventListener('pointerleave', hide);
  svg.addEventListener('focus', () => show(current));
  svg.addEventListener('blur', hide);
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    show(Math.max(0, Math.min(last, current + (e.key === 'ArrowRight' ? 1 : -1))));
  });
}

let visitData = null;
let visitRequest = 0;   // ignore an older answer that arrives after a newer filter click

function drawVisitChart() {
  const box = $('#visits-chart');
  if (!visitData) return;
  if (!visitData.total) box.innerHTML = emptyState('No visits in this period yet.');
  else lineChart(box, visitData.series);
}

async function loadVisits() {
  const type = $('#visits-type .active').dataset.type, days = $('#visits-days').value;
  const request = ++visitRequest;
  $('#visits-body').style.opacity = .5;
  try {
    const data = await api(`/stats/visits?type=${type}&days=${days}`);
    if (request !== visitRequest) return;
    visitData = data;
    const what = { all: 'all media', movie: 'movies', series: 'series' }[type];
    $('#visits-summary').textContent = `${plural(data.total)} to ${what} in the last ${days} days`;
    drawVisitChart();
    $('#visits-table').innerHTML = `
      <thead><tr><th>Day</th><th class="num">Visits</th></tr></thead>
      <tbody>${data.series.map((p) => `<tr><td>${esc(p.day)}</td><td class="num">${p.visits}</td></tr>`).join('')}</tbody>`;
    $('#top-visited').innerHTML = bars(data.top.map((m) => ({
      name: m.title, value: m.visits, href: `media.html?id=${m.id}`, tip: plural(m.visits)
    })));
  } finally {
    if (request === visitRequest) $('#visits-body').style.opacity = '';
  }
}

function wireVisitFilters() {
  const reload = () => loadVisits().catch((err) => toast(err.message, 'error'));
  $('#visits-type').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $('#visits-type').querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    reload();
  });
  $('#visits-days').onchange = reload;
  let lastWidth = 0;
  new ResizeObserver(() => {
    const width = $('#visits-chart').clientWidth;
    if (width !== lastWidth) { lastWidth = width; drawVisitChart(); }
  }).observe($('#visits-chart'));
}

// ------------------------------------------------------------ accounts
async function loadAccounts() {
  const isDev = Auth.role() === 'developer';
  const me = Auth.user().accountID;
  $('#accounts-note').textContent = isDev
    ? 'You are a developer: you can change roles and delete accounts.'
    : 'Read only. Only developers can change roles or delete accounts.';

  const accounts = await api('/accounts');
  $('#accounts-table').innerHTML = `
    <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th class="num">Watchlist</th>${isDev ? '<th></th>' : ''}</tr></thead>
    <tbody>${accounts.map((a) => {
      const self = a.accountID === me;
      const roleCell = isDev && !self
        ? `<select data-role="${a.accountID}" aria-label="Role of ${esc(a.username)}">
             ${['user', 'admin', 'developer'].map((r) => `<option ${r === a.role ? 'selected' : ''}>${r}</option>`).join('')}
           </select>`
        : `<span class="role-badge ${esc(a.role)}">${esc(a.role)}</span>${self ? ' <span class="muted">(you)</span>' : ''}`;
      return `
        <tr>
          <td>${a.accountID}</td><td>${esc(a.username)}</td><td>${esc(a.gmail)}</td>
          <td>${roleCell}</td><td class="num">${a.watchlist_count}</td>
          ${isDev ? `<td>${self ? '' : `<button class="btn btn-small btn-danger" data-delete="${a.accountID}" data-name="${esc(a.username)}">Delete</button>`}</td>` : ''}
        </tr>`;
    }).join('')}</tbody>`;
}

function wireAccountActions() {
  $('#accounts-table').addEventListener('change', async (e) => {
    const id = e.target.dataset.role;
    if (!id) return;
    const role = e.target.value;
    if (role !== 'user' && !confirm(`Make this account ${role}? Its watchlist will be removed.`)) return loadAccounts();
    try {
      await api(`/accounts/${id}/role`, { method: 'PUT', body: { role } });
      toast(`Role changed to ${role}. They must log in again.`);
      await Promise.all([loadAccounts(), loadOverview()]);
    } catch (err) { toast(err.message, 'error'); loadAccounts(); }
  });

  $('#accounts-table').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-delete]');
    if (!btn) return;
    if (!confirm(`Delete the account “${btn.dataset.name}” and its watchlist?`)) return;
    try {
      await api(`/accounts/${btn.dataset.delete}`, { method: 'DELETE' });
      toast('Account deleted');
      await Promise.all([loadAccounts(), loadOverview()]);
    } catch (err) { toast(err.message, 'error'); }
  });
}

if (requireRole('admin', 'developer')) {
  $('#group-by').onchange = $('#sort-by').onchange = () => loadGroups().catch((err) => toast(err.message, 'error'));
  wireAccountActions();
  wireVisitFilters();
  Promise.all([loadOverview(), loadVisits(), loadGroups(), loadAccounts()]).catch((err) => toast(err.message, 'error'));
}
