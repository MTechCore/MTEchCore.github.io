/**
 * admin.js
 * Минимальная клиентская админ-панель (MVP)
 *
 * Функции:
 * - Аутентификация: локальный пароль в localStorage (ключ site_admin_pw)
 * - Создание/редактирование статей (Quill)
 * - Сохранение в localStorage (posts array)
 * - Экспорт posts.json (скачивание файла)
 * - Редактирование / удаление записей в таблице
 *
 * ВАЖНО: это клиентское решение (MVP). Для production требуется сервер.
 */

import TurndownService from 'https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.min.js';

const PASSWORD_KEY = 'site_admin_pw';
const POSTS_KEY = 'posts';

const authArea = document.getElementById('authArea');
const editorArea = document.getElementById('editorArea');
const postsTableArea = document.getElementById('postsTableArea');

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminPasswordInput = document.getElementById('adminPasswordInput');

const titleInput = document.getElementById('title');
const descrInput = document.getElementById('descr');
const tagsInput = document.getElementById('tags');
const saveArticleBtn = document.getElementById('saveArticle');
const exportJsonBtn = document.getElementById('exportJson');
const postsTableBody = document.querySelector('#postsTable tbody');

let quill, turndownService, currentEditId = null;

/* Init Quill */
document.addEventListener('DOMContentLoaded', () => {
  quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1,2,3,false] }, 'bold','italic','link','code-block','blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }], ['image']
      ]
    }
  });

  turndownService = new TurndownService();

  // show auth if not logged in
  const logged = sessionStorage.getItem('admin_logged') === '1';
  toggleAuth(!logged);

  // wire events
  loginBtn.addEventListener('click', loginHandler);
  logoutBtn.addEventListener('click', logoutHandler);
  saveArticleBtn.addEventListener('click', saveArticle);
  exportJsonBtn.addEventListener('click', exportPostsJson);
});

/* ============================
   Auth handlers
   ============================ */

function toggleAuth(showLogin) {
  authArea.style.display = showLogin ? 'block' : 'none';
  editorArea.style.display = showLogin ? 'none' : 'block';
  postsTableArea.style.display = showLogin ? 'none' : 'block';
  if (!showLogin) {
    loadAndRenderPosts();
  }
}

function loginHandler() {
  const pw = adminPasswordInput.value.trim();
  if (!pw) return alert('Введите пароль');
  const stored = localStorage.getItem(PASSWORD_KEY);
  if (!stored) {
    // Если пароля нет — сохраняем введённый как новый (простой flow для MVP)
    if (!confirm('Пароль не найден. Сохранить введённый пароль как админ-пароль?')) return;
    localStorage.setItem(PASSWORD_KEY, pw);
    sessionStorage.setItem('admin_logged', '1');
    toggleAuth(false);
    return;
  }
  if (pw === stored) {
    sessionStorage.setItem('admin_logged', '1');
    toggleAuth(false);
  } else {
    alert('Неверный пароль');
  }
}

function logoutHandler() {
  sessionStorage.removeItem('admin_logged');
  toggleAuth(true);
}

/* ============================
   Posts CRUD (localStorage)
   ============================ */

/**
 * Load posts from localStorage or empty array
 * @returns {Array}
 */
function loadPostsLocal() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function savePostsLocal(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts, null, 2));
}

/**
 * Render posts table
 */
function loadAndRenderPosts() {
  const posts = loadPostsLocal();
  postsTableBody.innerHTML = '';
  posts.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${new Date(p.date).toLocaleString()}</td>
      <td>${(p.tags||[]).join(', ')}</td>
      <td>
        <button class="btn ghost small" data-id="${p.id}" data-action="edit">Редактировать</button>
        <button class="btn ghost small" data-id="${p.id}" data-action="delete">Удалить</button>
      </td>
    `;
    postsTableBody.appendChild(tr);
  });

  // attach actions
  postsTableBody.querySelectorAll('button').forEach(b => b.addEventListener('click', (ev) => {
    const id = ev.currentTarget.dataset.id;
    const action = ev.currentTarget.dataset.action;
    if (action === 'edit') editPost(id);
    else if (action === 'delete') deletePost(id);
  }));
}

/**
 * Save article (create or update)
 */
function saveArticle() {
  const title = titleInput.value.trim();
  const descr = descrInput.value.trim();
  const tags = tagsInput.value.split(',').map(t=>t.trim()).filter(Boolean);
  const html = quill.root.innerHTML;

  if (!title || !html) return alert('Заголовок и содержимое обязательны');

  const posts = loadPostsLocal();
  if (currentEditId) {
    // update
    const idx = posts.findIndex(p=>p.id===currentEditId);
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], title, description: descr, tags, content: html, date: new Date().toISOString() };
    }
  } else {
    // create id
    const newId = 'p' + Date.now();
    posts.unshift({ id: newId, title, description: descr, tags, content: html, date: new Date().toISOString() });
  }

  savePostsLocal(posts);
  alert('Сохранено');
  clearEditor();
  loadAndRenderPosts();
}

/**
 * Edit post by id
 */
function editPost(id) {
  const posts = loadPostsLocal();
  const p = posts.find(x=>x.id===id);
  if (!p) return alert('Не найдено');
  currentEditId = p.id;
  titleInput.value = p.title;
  descrInput.value = p.description || '';
  tagsInput.value = (p.tags||[]).join(', ');
  quill.root.innerHTML = p.content || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Delete post by id
 */
function deletePost(id) {
  if (!confirm('Удалить статью?')) return;
  let posts = loadPostsLocal();
  posts = posts.filter(p=>p.id!==id);
  savePostsLocal(posts);
  loadAndRenderPosts();
}

/* ============================
   Export posts.json
   ============================ */

function exportPostsJson() {
  const posts = loadPostsLocal();
  const blob = new Blob([JSON.stringify(posts, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'posts.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ============================
   Image insert (file -> base64) (simple)
   ============================ */

const imageUpload = document.getElementById('imageUpload');
const insertImageBtn = document.getElementById('insertImageBtn');

insertImageBtn.addEventListener('click', () => {
  if (!imageUpload.files || !imageUpload.files[0]) return alert('Выберите файл');
  const f = imageUpload.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'image', dataUrl, 'user');
  };
  reader.readAsDataURL(f);
});

/* ============================
   Helper: clear editor
   ============================ */

function clearEditor() {
  currentEditId = null;
  titleInput.value = '';
  descrInput.value = '';
  tagsInput.value = '';
  quill.root.innerHTML = '';
}
