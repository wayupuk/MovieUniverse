// public/js/genres.js — Page 4: Genre selection (User Flow 3).

let genres = [];

async function showGenre(id) {
  document.querySelectorAll('#genre-chips .chip').forEach((c) => c.classList.toggle('main', c.dataset.id === String(id)));
  const data = await api(`/genres/${id}/media`);
  $('#genre-title').textContent = `${data.genre_name} · ${data.count} title${data.count === 1 ? '' : 's'}`;
  $('#genre-grid').innerHTML = data.count
    ? data.media.map((m) => mediaCard(m)).join('')
    : emptyState('No titles in this genre yet.');
}

async function init() {
  genres = await api('/genres');
  $('#genre-chips').innerHTML = genres.map((g) => `
    <a href="genres.html?id=${g.genre_id}" class="chip" data-id="${g.genre_id}">
      ${esc(g.genre_name)} <span class="muted">${g.main_count + g.sub_count}</span>
    </a>`).join('');

  $('#genre-chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    e.preventDefault();
    history.pushState(null, '', chip.href);
    showGenre(chip.dataset.id).catch((err) => toast(err.message, 'error'));
  });
  window.addEventListener('popstate', () => param('id') && showGenre(param('id')));

  // Default: the genre in the URL, otherwise the most used one.
  const busiest = [...genres].sort((a, b) => (b.main_count + b.sub_count) - (a.main_count + a.sub_count))[0];
  await showGenre(param('id') || busiest.genre_id);
}

init().catch((err) => toast(err.message, 'error'));
