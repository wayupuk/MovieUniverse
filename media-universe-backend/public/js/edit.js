// public/js/edit.js — Page 9: Edit page (admin / developer).
//   edit.html        -> add a new movie or series   (User Flow 7, POST /media)
//   edit.html?id=5   -> change or delete media 5     (PUT / DELETE /media/5)

const editId = param('id');
const form = $('#media-form');

// Plain fields of the form; ids match the API's field names.
const TEXT_FIELDS = ['title', 'publish_date', 'age_rating', 'status', 'synopsis', 'category', 'country'];
const ID_FIELDS = ['director_id', 'main_genre_id'];
const OPTIONAL_ID_FIELDS = ['universe_id', 'sequel_parent_id', 'remake_parent_id'];
// Checkbox lists: id of the container -> API field (numbers, except ISBNs)
const LISTS = ['subgenre_ids', 'platform_ids', 'actor_ids', 'isbns'];

function msg(text, type = 'error') { const el = $('#form-msg'); el.textContent = text; el.className = `form-msg ${type}`; }

function checkList(container, items, toOption) {
  container.innerHTML = items.map((item) => {
    const [value, label] = toOption(item);
    return `<label><input type="checkbox" value="${esc(value)}"> ${esc(label)}</label>`;
  }).join('');
}
const checkedValues = (container) => [...container.querySelectorAll('input:checked')].map((i) => i.value);
function setChecked(container, values) {
  const wanted = new Set(values.map(String));
  container.querySelectorAll('input').forEach((i) => { i.checked = wanted.has(i.value); });
}

function showTypeFields() {
  const isMovie = $('#type').value === 'movie';
  $('#duration-field').classList.toggle('hidden', !isMovie);
  $('#episodes-field').classList.toggle('hidden', isMovie);
}

// Read the form into the JSON body the API expects.
function readForm() {
  const body = {};
  TEXT_FIELDS.forEach((f) => { body[f] = $(`#${f}`).value.trim(); });
  body.rating = Number($('#rating').value);
  ID_FIELDS.forEach((f) => { body[f] = Number($(`#${f}`).value); });
  OPTIONAL_ID_FIELDS.forEach((f) => { body[f] = $(`#${f}`).value ? Number($(`#${f}`).value) : null; });
  LISTS.forEach((f) => {
    const values = checkedValues($(`#${f}`));
    body[f] = f === 'isbns' ? values : values.map(Number);
  });
  if ($('#type').value === 'movie') body.duration = Number($('#duration').value);
  else body.episode_number = Number($('#episode_number').value);
  if (!editId) body.type = $('#type').value;
  return body;
}

// Friendly checks before sending (the API checks everything again).
function checkForm(body) {
  for (const f of ['title', 'publish_date', 'synopsis', 'country'])
    if (!body[f]) return `${$(`label[for=${f}]`).textContent.replace(' *', '')} is required`;
  if ($('#rating').value === '' || body.rating < 0 || body.rating > 9.9) return 'Rating must be between 0 and 9.9';
  if ('duration' in body && !(body.duration > 0)) return 'Duration is required for a movie';
  if ('episode_number' in body && !(body.episode_number > 0)) return 'Number of episodes is required for a series';
  return null;
}

async function fillFromMedia(id) {
  const m = await api(`/media/${encodeURIComponent(id)}`);
  $('#edit-title').textContent = `Edit: ${m.title}`;
  document.title = `Edit ${m.title} · Media Universe`;
  TEXT_FIELDS.forEach((f) => { $(`#${f}`).value = m[f] ?? ''; });
  $('#rating').value = m.rating;
  [...ID_FIELDS, ...OPTIONAL_ID_FIELDS].forEach((f) => { $(`#${f}`).value = m[f] ?? ''; });
  $('#type').value = m.media_type === 'Movie' ? 'movie' : 'series';
  $('#type').disabled = true;   // a movie cannot become a series
  $('#duration').value = m.duration ?? '';
  $('#episode_number').value = m.episode_number ?? '';
  setChecked($('#subgenre_ids'), m.subgenres.map((g) => g.genre_id));
  setChecked($('#platform_ids'), m.platforms.map((p) => p.platform_id));
  setChecked($('#actor_ids'), m.actors.map((a) => a.actor_id));
  setChecked($('#isbns'), m.books.map((b) => b.ISBN));
  // a media cannot be its own parent
  for (const f of ['sequel_parent_id', 'remake_parent_id']) $(`#${f} option[value="${m.id}"]`)?.remove();

  $('#delete-btn').classList.remove('hidden');
  $('#view-btn').classList.remove('hidden');
  $('#view-btn').href = `media.html?id=${m.id}`;
  $('#save-btn').textContent = 'Save changes';
  showTypeFields();
}

async function init() {
  const [lookups, allMedia] = await Promise.all([api('/lookups'), api('/media?sort=title&limit=100')]);
  const mediaOption = (m) => [m.id, `${m.title} (${year(m.publish_date)})`];

  fillSelect($('#pick-media'), allMedia, mediaOption, 'Edit an existing title…');
  $('#pick-media').value = editId || '';
  $('#pick-media').onchange = (e) => { if (e.target.value) location.href = `edit.html?id=${e.target.value}`; };

  fillSelect($('#director_id'), lookups.directors, (d) => [d.director_id, d.director_name]);
  fillSelect($('#main_genre_id'), lookups.genres, (g) => [g.genre_id, g.genre_name]);
  fillSelect($('#universe_id'), lookups.universes, (u) => [u.universe_id, u.universe_name], '— none —');
  fillSelect($('#sequel_parent_id'), allMedia, mediaOption, '— none —');
  fillSelect($('#remake_parent_id'), allMedia, mediaOption, '— none —');
  checkList($('#subgenre_ids'), lookups.genres, (g) => [g.genre_id, g.genre_name]);
  checkList($('#platform_ids'), lookups.platforms, (p) => [p.platform_id, p.platform_name]);
  checkList($('#actor_ids'), lookups.actors, (a) => [a.actor_id, a.actor_name]);
  checkList($('#isbns'), lookups.books, (b) => [b.ISBN, `${b.book_title}${b.volume > 1 ? ' vol. ' + b.volume : ''}`]);

  $('#type').onchange = showTypeFields;
  $('#actor-filter').oninput = (e) => {
    const text = e.target.value.toLowerCase();
    $('#actor_ids').querySelectorAll('label').forEach((l) => {
      l.classList.toggle('hidden', !l.textContent.toLowerCase().includes(text));
    });
  };

  if (editId) await fillFromMedia(editId);
  else { $('#publish_date').value = new Date().toISOString().slice(0, 10); $('#rating').value = 0; }
  showTypeFields();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = readForm();
    const problem = checkForm(body);
    if (problem) return msg(problem);
    $('#save-btn').disabled = true;
    try {
      if (editId) {
        await api(`/media/${editId}`, { method: 'PUT', body });
        msg('Saved.', 'ok');
        toast('Changes saved');
      } else {
        const created = await api('/media', { method: 'POST', body });
        toast(`“${created.title}” added`);
        setTimeout(() => (location.href = `media.html?id=${created.id}`), 600);
      }
    } catch (err) {
      msg(err.message);
    } finally {
      $('#save-btn').disabled = false;
    }
  });

  $('#delete-btn').onclick = async () => {
    if (!confirm(`Delete “${$('#title').value}”? It is also removed from every watchlist.`)) return;
    try {
      await api(`/media/${editId}`, { method: 'DELETE' });
      toast('Deleted');
      setTimeout(() => (location.href = 'edit.html'), 600);
    } catch (err) { msg(err.message); }
  };

  $('#universe-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const out = $('#universe-msg');
    try {
      const u = await api('/universes', { method: 'POST', body: { universe_name: $('#universe_name').value } });
      $('#universe_id').insertAdjacentHTML('beforeend', `<option value="${u.universe_id}">${esc(u.universe_name)}</option>`);
      $('#universe_id').value = u.universe_id;
      $('#universe_name').value = '';
      out.textContent = `Added “${u.universe_name}” and selected it above.`;
      out.className = 'form-msg ok';
    } catch (err) { out.textContent = err.message; out.className = 'form-msg error'; }
  });
}

if (requireRole('admin', 'developer'))
  init().catch((err) => msg(err.message));
