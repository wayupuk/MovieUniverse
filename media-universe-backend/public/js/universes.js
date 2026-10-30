// public/js/universes.js — Page 6: Discover universe (User Flow 9, top 10).

async function init() {
  const universes = await api('/universes');
  if (!universes.length) return ($('#universe-grid').innerHTML = emptyState('No universes yet.'));

  // One extra request per universe (at most 10) to show four posters as a collage.
  const details = await Promise.all(universes.map((u) => api(`/universes/${u.universe_id}`)));

  $('#universe-grid').innerHTML = universes.map((u, i) => {
    const posters = details[i].media.filter((m) => m.thumbnail).slice(0, 4);
    return `
      <a class="universe-card" href="universe.html?id=${u.universe_id}">
        <div class="collage" style="grid-template-columns:repeat(${Math.max(posters.length, 1)}, 1fr)">${posters.map((m) => `<img src="${esc(m.thumbnail)}" alt="" loading="lazy">`).join('')}</div>
        <div class="body">
          <h3><span class="rank">#${i + 1}</span>${esc(u.universe_name)}</h3>
          <div class="stat-row">
            <span>${u.media_count} titles</span>
            <span>${u.movie_count} movies · ${u.series_count} series</span>
            ${u.first_year ? `<span>${u.first_year}–${u.latest_year}</span>` : ''}
            ${u.avg_rating != null ? `<span class="rating">★ ${u.avg_rating}</span>` : ''}
            <span>${details[i].books.length} books</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

init().catch((err) => toast(err.message, 'error'));
