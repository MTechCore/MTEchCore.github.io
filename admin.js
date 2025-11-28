/**
 * admin.js — client-only admin (MVP)
 * - simple auth: localStorage key 'site_admin_pw'
 * - stores posts in localStorage 'posts'
 * - export posts.json
 * - image upload -> base64 (simple)
 */

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

const imageUpload = document.getElementById('imageUpload');
const insertImageBtn = document.getElementById('insertImageBtn');

let quill = null;
let currentEditId = null;

document.addEventListener('DOMContentLoaded', ()=>{
  quill = new Quill('#editor', {
    theme: 'snow',
    modules: { toolbar: [['bold','italic','link'], [{ list: 'ordered' }, { list: 'bullet' }], ['image','code-block']] }
  });

  const logged = sessionStorage.getItem('admin_logged') === '1';
  toggleAuth(!logged);

  loginBtn.addEventListener('click', loginHandler);
  logoutBtn.addEventListener('click', logoutHandler);
  saveArticleBtn.addEventListener('click', saveArticle);
  exportJsonBtn.addEventListener('click', exportPostsJson);
  insertImageBtn.addEventListener('click', handleInsertImage);
});

/* Auth */
function toggleAuth(showLogin){
  authArea.style.display = showLogin ? 'block' : 'none';
  editorArea.style.display = showLogin ? 'none' : 'block';
  postsTableArea.style.display = showLogin ? 'none' : 'block';
  if (!showLogin) loadAndRenderPosts();
}

function loginHandler(){
  const pw = adminPasswordInput.value.trim();
  if (!pw) return alert('Введите пароль');
  const stored = localStorage.getItem(PASSWORD_KEY);
  if (!stored) {
    if (!confirm('Пароль не найден. Сохранить введенный пароль как админ-пароль?')) return;
    localStorage.setItem(PASSWORD_KEY, pw);
    sessionStorage.setItem('admin_logged','1');
    toggleAuth(false);
    return;
  }
  if (pw === stored) {
    sessionStorage.setItem('admin_logged','1');
    toggleAuth(false);
  } else alert('Неверный пароль');
}

function logoutHandler(){
  sessionStorage.removeItem('admin_logged');
  toggleAuth(true);
}

/* Posts store */
function loadPostsLocal(){
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}
function savePostsLocal(posts){ localStorage.setItem(POSTS_KEY, JSON.stringify(posts, null, 2)); }

function loadAndRenderPosts(){
  const posts = loadPostsLocal();
  postsTableBody.innerHTML = '';
  posts.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.title}</td><td>${new Date(p.date).toLocaleString()}</td><td>${(p.tags||[]).join(', ')}</td>
      <td><button data-id="${p.id}" data-action="edit" class="btn btn-ghost">Редактировать</button>
      <button data-id="${p.id}" data-action="delete" class="btn btn-ghost">Удалить</button></td>`;
    postsTableBody.appendChild(tr);
  });
  postsTableBody.querySelectorAll('button').forEach(b=>b.addEventListener('click', (ev)=>{
    const id = ev.currentTarget.dataset.id;
    const action = ev.currentTarget.dataset.action;
    if (action==='edit') editPost(id);
    else if (action==='delete') deletePost(id);
  }));
}

function saveArticle(){
  const title = titleInput.value.trim();
  const descr = descrInput.value.trim();
  const tags = tagsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
  const html = quill.root.innerHTML;

  if (!title || !html) return alert('Заголовок и содержимое обязательны');

  const posts = loadPostsLocal();
  if (currentEditId){
    const idx = posts.findIndex(p => p.id === currentEditId);
    if (idx !== -1) {
      posts[idx] = {...posts[idx], title, description: descr, tags, content: html, date: new Date().toISOString()};
    }
  } else {
    const id = 'p' + Date.now();
    posts.unshift({ id, title, description: descr, tags, content: html, date: new Date().toISOString() });
  }
  savePostsLocal(posts);
  alert('Сохранено локально');
  clearEditor();
  loadAndRenderPosts();
}

function editPost(id){
  const posts = loadPostsLocal();
  const p = posts.find(x=>x.id === id);
  if (!p) return alert('Не найдено');
  currentEditId = p.id;
  titleInput.value = p.title;
  descrInput.value = p.description || '';
  tagsInput.value = (p.tags || []).join(', ');
  quill.root.innerHTML = p.content || '';
  window.scrollTo({top:0, behavior:'smooth'});
}

function deletePost(id){
  if (!confirm('Удалить статью?')) return;
  let posts = loadPostsLocal();
  posts = posts.filter(p=>p.id !== id);
  savePostsLocal(posts);
  loadAndRenderPosts();
}

/* Export posts.json */
function exportPostsJson(){
  const posts = loadPostsLocal();
  const blob = new Blob([JSON.stringify(posts, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'posts.json'; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

/* Image insert */
function handleInsertImage(){
  const file = imageUpload.files && imageUpload.files[0];
  if (!file) return alert('Выберите файл');
  const reader = new FileReader();
  reader.onload = ()=> {
    const dataUrl = reader.result;
    const range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'image', dataUrl, 'user');
  };
  reader.readAsDataURL(file);
}

/* Clear editor */
function clearEditor(){
  currentEditId = null;
  titleInput.value = '';
  descrInput.value = '';
  tagsInput.value = '';
  quill.root.innerHTML = '';
}
