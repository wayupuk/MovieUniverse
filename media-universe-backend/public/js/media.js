// public/js/media.js — Page 3: Information page (User Flow 2: user clicked a banner).
// What the visitor can do depends on the role:
//   guest -> "Add to watchlist" sends them to log in      (Flow 4 login check)
//   user  -> add / remove from watchlist                  (Flows 4 and 6)
//   admin / developer -> edit, change genre, delete       (Flows 7 and 8)

const id = param('id');
let media;

function minutes(total) {
  const h = Math.floor(total / 60), m = Math.round(total % 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

function renderDetail() {
  const m = media;
  document.title = `${m.title} · Media Universe`;
  const length = m.media_type === 'Movie' ? minutes(m.duration) : `${m.episode_number} episodes`;

  $('#detail').innerHTML = `
    <section class="detail">
      ${m.thumbnail ? `<div class="hero-bg" style="background-image:url('${esc(m.thumbnail)}')"></div>` : ''}
      <div class="detail-inner">
        <div class="poster">${posterHTML(m)}</div>
        <div>
          <div class="eyebrow">${esc(m.media_type)} · ${year(m.publish_date)}</div>
          <h1>${esc(m.title)}</h1>
          <div class="chips">
            <span class="rating">★ ${m.rating.toFixed(1)}</span>
            <a class="chip main" href="genres.html?id=${m.main_genre_id}">${esc(m.main_genre)}</a>
            ${m.subgenres.map((g) => `<a class="chip" href="genres.html?id=${g.genre_id}">${esc(g.genre_name)}</a>`).join('')}
          </div>
          <p class="synopsis">${esc(m.synopsis)}</p>
          <dl class="facts">
            <dt>Released</dt><dd>${esc(m.publish_date)}</dd>
            <dt>Length</dt><dd>${esc(length)}</dd>
            <dt>Age rating</dt><dd>${esc(m.age_rating)}</dd>
            <dt>Status</dt><dd>${esc(m.status)}</dd>
            <dt>Category</dt><dd>${esc(m.category)} · ${esc(m.country)}</dd>
            <dt>Director</dt><dd>${esc(m.director_name)}</dd>
            <dt>Universe</dt><dd>${m.universe_id ? `<a href="universe.html?id=${m.universe_id}" style="color:var(--accent)">${esc(m.universe_name)}</a>` : '<span class="muted">Standalone</span>'}</dd>
            <dt>Watch on</dt><dd>${m.platforms.length ? m.platforms.map((p) => esc(p.platform_name)).join(', ') : '<span class="muted">—</span>'}</dd>
            <dt>Cast</dt><dd>${m.actors.length ? m.actors.map((a) => esc(a.actor_name)).join(', ') : '<span class="muted">—</span>'}</dd>
          </dl>
          <div class="actions" id="user-actions"></div>
          <div id="staff-actions"></div>
        </div>
      </div>
    </section>`;
}

// ------------------------------------------------------------ watchlist button
async function renderUserActions() {
  const box = $('#user-actions');
  if (!Auth.user()) {
    box.innerHTML = `<a class="btn btn-primary" href="login.html?next=${encodeURIComponent('media.html?id=' + id)}">+ Add to watchlist</a>
                     <span class="muted">Log in to keep a watchlist.</span>`;
    return;
  }
  if (!Auth.isUser()) return;   // staff accounts have no watchlist

  const list = await api('/watchlist');
  let saved = list.some((w) => w.id === media.id);
  const draw = () => {
    box.innerHTML = saved
      ? '<button class="btn" id="wl-btn">✓ In your watchlist · remove</button>'
      : '<button class="btn btn-primary" id="wl-btn">+ Add to watchlist</button>';
    $('#wl-btn').onclick = toggle;
  };
  async function toggle() {
    try {
      if (saved) await api(`/watchlist/${media.id}`, { method: 'DELETE' });
      else await api('/watchlist', { method: 'POST', body: { media_id: media.id } });
      saved = !saved;
      toast(saved ? 'Added to your watchlist' : 'Removed from your watchlist');
      draw();
    } catch (err) { toast(err.message, 'error'); }
  }
  draw();
}

// ------------------------------------------------------------ admin / developer tools
async function renderStaffActions() {
  if (!Auth.isStaff()) return;
  const genres = await api('/genres');
  $('#staff-actions').innerHTML = `
    <div class="staff-bar">
      <span class="label">${esc(Auth.role())} tools</span>
      <a class="btn btn-small" href="edit.html?id=${media.id}">Edit all fields</a>
      <select id="genre-select" aria-label="Main genre"></select>
      <button class="btn btn-small" id="genre-save">Change main genre</button>
      <button class="btn btn-small btn-danger" id="delete-btn">Delete</button>
    </div>`;
  fillSelect($('#genre-select'), genres, (g) => [g.genre_id, g.genre_name]);
  $('#genre-select').value = media.main_genre_id;

  // User Flow 8: PUT /media/:id/genres
  $('#genre-save').onclick = async () => {
    try {
      await api(`/media/${media.id}/genres`, { method: 'PUT', body: { main_genre_id: Number($('#genre-select').value) } });
      toast('Genre updated');
      await load();
    } catch (err) { toast(err.message, 'error'); }
  };

  $('#delete-btn').onclick = async () => {
    if (!confirm(`Delete “${media.title}”? It is also removed from every watchlist.`)) return;
    try {
      await api(`/media/${media.id}`, { method: 'DELETE' });
      toast('Deleted');
      setTimeout(() => (location.href = 'index.html'), 700);
    } catch (err) { toast(err.message, 'error'); }
  };
}

// ------------------------------------------------------------ cross references
function renderRelated() {
  const m = media;
  const parts = [];

  const chain = [];
  if (m.sequel_of) chain.push(['Previous', m.sequel_of]);
  m.sequels.forEach((s) => chain.push(['Sequel', s]));
  if (m.remake_of) chain.push(['Remake of', m.remake_of]);
  m.remakes.forEach((r) => chain.push(['Remade as', r]));
  if (chain.length)
    parts.push(`<section class="section"><h2>Adaptation chain</h2><div class="chain">
      ${chain.map(([label, item]) => `<div><div class="chain-label">${label}</div>${mediaCard(item)}</div>`).join('')}
    </div></section>`);

  if (m.books.length)
    parts.push(`<section class="section"><h2>Based on</h2><div class="books">${m.books.map(bookCard).join('')}</div></section>`);

  if (m.same_universe.length)
    parts.push(`<section class="section"><div class="section-head"><h2>More from ${esc(m.universe_name)}</h2>
      <a class="muted" href="universe.html?id=${m.universe_id}">Whole universe →</a></div>
      <div class="grid small">${m.same_universe.map((x) => mediaCard(x)).join('')}</div></section>`);

  $('#related').innerHTML = parts.join('');
}

async function load() {
  if (!id) return ($('#detail').innerHTML = emptyState('No title selected. <a href="index.html">Back to home</a>'));
  try {
    media = await api(`/media/${encodeURIComponent(id)}`);
  } catch (err) {
    $('#detail').innerHTML = emptyState(`${esc(err.message)}. <a href="index.html">Back to home</a>`);
    return;
  }
  renderDetail();
  renderRelated();
  await Promise.all([renderUserActions(), renderStaffActions()]);
}

load().catch((err) => toast(err.message, 'error'));
