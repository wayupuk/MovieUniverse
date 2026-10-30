// thumbnails.js — link the pictures in DB_lab_project to media and books by name.
//
// The image folders are served by app.js:
//   DB_lab_project/DB_image    -> /images/media/...
//   DB_lab_project/book_image  -> /images/books/...
// A picture belongs to a media / book when its file name matches the title.
// Sub-folders do not matter, and names are compared loosely ("Avengers- Endgame.jpg"
// matches "Avengers: Endgame"), so new pictures only need to be named after the title.
const fs = require('fs');
const path = require('path');

const IMAGE_ROOT = path.join(__dirname, '..', 'DB_lab_project');
const FOLDERS = {
  media: { dir: path.join(IMAGE_ROOT, 'DB_image'),   url: '/images/media' },
  books: { dir: path.join(IMAGE_ROOT, 'book_image'), url: '/images/books' }
};
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// File names that cannot be guessed from the title.  normalized title -> normalized file name
const MEDIA_ALIASES = {
  'moon lovers scarlet heart ryeo': 'moon lovers'
};
const BOOK_ALIASES = {
  'bu bu jing xin': 'bu bu jing xin 1 2'      // one cover for volumes 1 and 2
};

// "Harry Potter and the Philosopher's Stone" -> "harry potter and the philosophers stone"
// "Lion King(1994)" -> "lion king 1994"      "Cuarón" -> "cuaron"
function normalize(text) {
  return String(text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // drop accents
    .toLowerCase()
    .replace(/'/g, '')                                  // philosopher's -> philosophers
    .replace(/[^a-z0-9]+/g, ' ')                        // : - ( ) , & ... -> space
    .trim();
}

const withoutThe = (name) => name.replace(/^the /, '');

// Scan a folder (and its sub-folders) once: normalized file name -> public URL.
function buildIndex({ dir, url }) {
  const index = new Map();
  if (!fs.existsSync(dir)) {
    console.warn(`thumbnails: folder not found, no pictures served: ${dir}`);
    return index;
  }
  // When two files share a name, the one inside a (universe) sub-folder wins,
  // so deeper paths are listed first.
  const depth = (entry) => entry.split(path.sep).length;
  const entries = fs.readdirSync(dir, { recursive: true })
    .sort((a, b) => depth(b) - depth(a) || a.localeCompare(b));
  for (const entry of entries) {
    const ext = path.extname(entry).toLowerCase();
    if (!IMAGE_EXT.includes(ext)) continue;
    const key = normalize(path.basename(entry, path.extname(entry)));
    // encode each part so spaces, "&", "#" ... are safe inside a URL
    const href = url + '/' + entry.split(path.sep).map(encodeURIComponent).join('/');
    if (!index.has(key)) index.set(key, href);
  }
  return index;
}

const mediaIndex = buildIndex(FOLDERS.media);
const bookIndex = buildIndex(FOLDERS.books);

const firstMatch = (index, keys) => {
  for (const key of keys) if (index.has(key)) return index.get(key);
  return null;
};

// Media picture: try "title year" first so the two "The Lion King" films get
// their own poster, then the plain title, then the alias table.
function mediaThumbnail({ title, publish_date }) {
  const name = normalize(title);
  const year = String(publish_date || '').slice(0, 4);
  return firstMatch(mediaIndex, [
    `${name} ${year}`, `${withoutThe(name)} ${year}`,
    name, withoutThe(name),
    MEDIA_ALIASES[name]
  ]);
}

// Book picture: try "title volume" first ("Attack on Titan 2"), then the plain title.
function bookThumbnail({ book_title, volume }) {
  const name = normalize(book_title);
  return firstMatch(bookIndex, [`${name} ${volume}`, name, BOOK_ALIASES[name]]);
}

// Helpers for controllers: return a copy of the row with a `thumbnail` URL (or null).
exports.addMediaThumbnail = (row) => row && { ...row, thumbnail: mediaThumbnail(row) };
exports.addBookThumbnail = (row) => row && { ...row, thumbnail: bookThumbnail(row) };
exports.FOLDERS = FOLDERS;
