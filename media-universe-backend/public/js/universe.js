// public/js/universe.js — Page 7: one universe. Every title in release order
// (from the stored procedure get_universe_media) and the books they adapt.

async function init() {
  const id = param('id');
  let u;
  try {
    u = await api(`/universes/${encodeURIComponent(id || '')}`);
  } catch (err) {
    $('#universe').innerHTML = emptyState(`${esc(err.message)}. <a href="universes.html">All universes</a>`);
    return;
  }
  document.title = `${u.universe_name} · Media Universe`;
  const ratings = u.media.map((m) => m.rating).filter((r) => r > 0);
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '–';

  $('#universe').innerHTML = `
    <div class="page-head">
      <div>
        <div class="eyebrow"><a href="universes.html">Universes</a> /</div>
        <h1>${esc(u.universe_name)}</h1>
        <div class="stat-row">
          <span>${u.media_count} titles</span>
          <span>${u.books.length} books</span>
          <span class="rating">★ ${avg} average</span>
        </div>
      </div>
    </div>

    <div class="section" style="margin-top:10px">
      <h2>Release order</h2>
      ${u.media.length ? `<div class="timeline">
        ${u.media.map((m) => `
          <a class="timeline-item" href="media.html?id=${m.id}">
            <div class="thumb">${posterHTML(m)}</div>
            <div>
              <div class="year">${year(m.publish_date)} · ${esc(m.media_type)}</div>
              <h3 style="margin:2px 0">${esc(m.title)}</h3>
              <div class="muted" style="font-size:.85rem">${esc(m.director_name)} · ${esc(m.main_genre)}
                · <span class="rating">★ ${m.rating.toFixed(1)}</span></div>
            </div>
          </a>`).join('')}
      </div>` : emptyState('No titles in this universe yet.')}
    </div>

    ${u.books.length ? `<div class="section"><h2>The books behind it</h2>
      <div class="books">${u.books.map(bookCard).join('')}</div></div>` : ''}`;
}

init().catch((err) => toast(err.message, 'error'));
