// public/js/search.js — Page 2: All Search (User Flow 1).
// The keyword lives in the URL (search.html?q=...) so the header search box and
// the back button both work.

async function runSearch() {
  const q = (param('q') || '').trim();
  $('#q').value = q;
  $('#type').value = param('type') || '';
  $('#genre').value = param('genre') || '';
  if (!q) {
    $('#summary').textContent = '';
    $('#results').innerHTML = emptyState('Type something to search the whole database.');
    return;
  }

  const query = new URLSearchParams({ q, limit: 100 });
  if (param('type')) query.set('type', param('type'));
  if (param('genre')) query.set('genre', param('genre'));
  const data = await api(`/media/search?${query}`);

  $('#summary').textContent = `${data.count} result${data.count === 1 ? '' : 's'} for “${data.keyword}”`;
  $('#results').innerHTML = data.count
    ? data.results.map((m) => mediaCard(m)).join('')
    : emptyState(`No titles match “${esc(data.keyword)}”. Try a shorter word or a different spelling.`);
}

async function init() {
  const genres = await api('/genres');
  fillSelect($('#genre'), genres, (g) => [g.genre_id, g.genre_name], 'All genres');

  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = new URLSearchParams({ q: $('#q').value.trim() });
    if ($('#type').value) query.set('type', $('#type').value);
    if ($('#genre').value) query.set('genre', $('#genre').value);
    history.pushState(null, '', `search.html?${query}`);
    runSearch().catch((err) => toast(err.message, 'error'));
  });
  window.addEventListener('popstate', () => runSearch());
  await runSearch();
}

init().catch((err) => toast(err.message, 'error'));
