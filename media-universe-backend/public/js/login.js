// public/js/login.js — Page 5: log in, or create an account (User Flow 5).

// After logging in: back to the page that sent us here, or a start page for the role.
function goNext(user) {
  const next = param('next');
  if (next && next.startsWith('/') && !next.startsWith('//')) return (location.href = next);  // same-site only
  if (next && /^[\w-]+\.html/.test(next)) return (location.href = next);
  location.href = user.role === 'user' ? 'index.html' : 'stats.html';
}

async function login(username, password) {
  const user = await api('/accounts/login', { method: 'POST', body: { username, password } });
  Auth.save(user);   // { token, accountID, username, role }
  goNext(user);
}

function showTab(name) {
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('#login-form').classList.toggle('hidden', name !== 'login');
  $('#register-form').classList.toggle('hidden', name !== 'register');
}

function setMsg(el, text, type = 'error') {
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

if (Auth.user()) {
  $('main').innerHTML = `<div class="empty">You are logged in as <b>${esc(Auth.user().username)}</b>.
    <br><br><button class="btn" onclick="logout()">Log out</button></div>`;
} else {
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await login($('#login-username').value.trim(), $('#login-password').value);
    } catch (err) { setMsg($('#login-msg'), err.message); }
  });

  $('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      username: $('#reg-username').value.trim(),
      gmail: $('#reg-gmail').value.trim(),
      password: $('#reg-password').value
    };
    if (body.password.length < 8) return setMsg($('#register-msg'), 'Password must be at least 8 characters');
    try {
      await api('/accounts/register', { method: 'POST', body });
      setMsg($('#register-msg'), 'Account created — logging you in…', 'ok');
      await login(body.username, body.password);
    } catch (err) { setMsg($('#register-msg'), err.message); }
  });
}
