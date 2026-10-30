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
    ['Universes', t.universes], ['Accounts', t.accounts], ['Watchlist saves', t.watchlist_entries]
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
  Promise.all([loadOverview(), loadGroups(), loadAccounts()]).catch((err) => toast(err.message, 'error'));
}
