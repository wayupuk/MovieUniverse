// public/js/common.js — shared by every page: login state, API calls, header, cards.
// Load it before the page's own script.

// ------------------------------------------------------------ small helpers
const $ = (selector, root = document) => root.querySelector(selector);
const param = (name) => new URLSearchParams(location.search).get(name);
const year = (date) => (date ? String(date).slice(0, 4) : '');

// Escape text before putting it into innerHTML (stops HTML / script injection).
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ------------------------------------------------------------ login state
// POST /accounts/login returns { token, accountID, username, role }; we keep it in localStorage.
const Auth = {
  user()    { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } },
  token()   { return Auth.user()?.token; },
  role()    { return Auth.user()?.role; },
  isUser()  { return Auth.role() === 'user'; },
  isStaff() { return ['admin', 'developer'].includes(Auth.role()); },
  save(user) { localStorage.setItem('user', JSON.stringify(user)); },
  clear()    { localStorage.removeItem('user'); }
};

// fetch() wrapper: sends JSON + the login token, returns the parsed body,
// throws an Error carrying the server's message for 4xx / 5xx answers.
async function api(url, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (Auth.token()) headers.Authorization = `Bearer ${Auth.token()}`;

  const res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });

  // We sent a token but the server no longer knows it (logged out / server restarted).
  if (res.status === 401 && headers.Authorization) {
    Auth.clear();
    location.href = `login.html?next=${encodeURIComponent(location.pathname + location.search)}`;
    throw new Error('please log in again');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `request failed (${res.status})`), { status: res.status });
  return data;
}

async function logout() {
  try { await api('/accounts/logout', { method: 'POST' }); } catch { /* already logged out */ }
  Auth.clear();
  location.href = 'index.html';
}

// Page guard. Hiding pages is only for comfort: the API checks the role again on every request.
// Returns true when the visitor may see this page, otherwise shows a message and returns false.
function requireRole(...roles) {
  const main = $('main');
  if (!Auth.user()) {
    main.innerHTML = `<div class="empty">Please <a href="login.html?next=${encodeURIComponent(location.pathname + location.search)}">log in</a> to see this page.</div>`;
    return false;
  }
  if (!roles.includes(Auth.role())) {
    main.innerHTML = `<div class="empty">This page is only for ${esc(roles.join(' / '))} accounts.
      You are logged in as <b>${esc(Auth.user().username)}</b> (${esc(Auth.role())}).</div>`;
    return false;
  }
  return true;
}

// ------------------------------------------------------------ header + footer
function renderHeader() {
  const user = Auth.user();
  const page = location.pathname.split('/').pop() || 'index.html';
  const section = { 'universe.html': 'universes.html' }[page] || page;   // child page -> its menu item
  const link = (href, text) => `<a href="${href}" class="${section === href ? 'active' : ''}">${text}</a>`;

  const links = [
    link('index.html', 'Home'),
    link('genres.html', 'Genres'),
    link('universes.html', 'Universes'),
    user && Auth.isUser() ? link('watchlist.html', 'Watchlist') : '',
    user && Auth.isStaff() ? link('edit.html', 'Edit') : '',
    user && Auth.isStaff() ? link('stats.html', 'Statistics') : ''
  ].join('');

  const account = user
    ? `<span>${esc(user.username)}</span>
       <span class="role-badge ${esc(user.role)}">${esc(user.role)}</span>
       <button class="btn btn-small" id="logout-btn">Log out</button>`
    : `<a class="btn btn-small btn-primary" href="login.html">Log in</a>`;

  $('#site-header').outerHTML = `
    <header class="site-header">
      <nav class="nav">
        <a class="logo" href="index.html">Media<span>Universe</span></a>
        <div class="nav-links">${links}</div>
        <form class="nav-search" action="search.html">
          <input type="search" name="q" placeholder="Search titles, actors, books…" value="${esc(param('q') || '')}" aria-label="Search">
        </form>
        <div class="nav-user">${account}</div>
      </nav>
    </header>`;
  $('#logout-btn')?.addEventListener('click', logout);

  if (!$('footer'))
    document.body.insertAdjacentHTML('beforeend',
      '<footer>Cross-referencing Media Universe · CSS326 Database Programming Laboratory · 2026</footer>');
}

// If a token is stored, make sure the server still accepts it (it forgets tokens on restart).
async function checkSession() {
  if (!Auth.token()) return;
  const res = await fetch('/accounts/me', { headers: { Authorization: `Bearer ${Auth.token()}` } });
  if (res.status === 401) { Auth.clear(); location.reload(); }
}

// ------------------------------------------------------------ pieces of UI
function posterHTML(item, title = item.title || item.book_title) {
  return item.thumbnail
    ? `<img src="${esc(item.thumbnail)}" alt="${esc(title)}" loading="lazy">`
    : `<div class="poster-fallback">${esc(title)}</div>`;
}

// One poster card linking to the information page.
// extra: HTML placed on top of the poster (e.g. a remove button).
function mediaCard(m, extra = '') {
  return `
    <a class="card" href="media.html?id=${m.id}">
      <div class="poster">
        ${posterHTML(m)}
        ${m.media_type ? `<span class="type-badge">${esc(m.media_type)}</span>` : ''}
      </div>
      ${extra}
      <div class="card-body">
        <h3>${esc(m.title)}</h3>
        <div class="card-meta">
          <span>${year(m.publish_date)}${m.main_genre ? ' · ' + esc(m.main_genre) : ''}</span>
          ${m.rating != null ? `<span class="rating">★ ${Number(m.rating).toFixed(1)}</span>` : ''}
        </div>
      </div>
    </a>`;
}

function bookCard(b) {
  return `
    <div class="book">
      <div class="cover">${posterHTML(b, b.book_title)}</div>
      <div>
        <h3>${esc(b.book_title)}${b.volume > 1 ? ` <span class="muted">vol. ${b.volume}</span>` : ''}</h3>
        <p>${esc(b.author_name || 'Unknown author')}</p>
        <p>${esc(b.book_type)} · ${esc(b.publisher_name || '')} · ${year(b.publish_date)}</p>
      </div>
    </div>`;
}

const emptyState = (html) => `<div class="empty">${html}</div>`;

// Short message in the corner. type: 'ok' | 'error'
function toast(message, type = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : ''}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 2800);
}

// Fill a <select> from a list.  toOption(item) -> [value, label]
function fillSelect(select, items, toOption, firstOption) {
  select.innerHTML = (firstOption ? `<option value="">${esc(firstOption)}</option>` : '') +
    items.map((item) => { const [v, l] = toOption(item); return `<option value="${esc(v)}">${esc(l)}</option>`; }).join('');
}

renderHeader();
checkSession();
