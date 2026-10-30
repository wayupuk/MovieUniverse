// public/js/watchlist.js — Page 8: my watchlist (normal users). Remove = User Flow 6.

async function load() {
  const list = await api('/watchlist');
  $('#wl-count').textContent = `${list.length} saved title${list.length === 1 ? '' : 's'}`;
  $('#wl-grid').innerHTML = list.length
    ? list.map((m) => mediaCard(m, `<button class="btn btn-small btn-danger remove" data-id="${m.id}" title="Remove">✕</button>`)).join('')
    : emptyState('Your watchlist is empty. Open any title and press <b>+ Add to watchlist</b>. <a href="index.html">Browse titles</a>');
}

if (requireRole('user')) {
  $('#wl-grid').addEventListener('click', async (e) => {
    const btn = e.target.closest('.remove');
    if (!btn) return;
    e.preventDefault();   // the button sits inside the card link
    try {
      await api(`/watchlist/${btn.dataset.id}`, { method: 'DELETE' });
      toast('Removed from your watchlist');
      await load();
    } catch (err) { toast(err.message, 'error'); }
  });
  load().catch((err) => toast(err.message, 'error'));
}
