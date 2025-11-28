/**
 * script.js — client main
 * - load /data/posts.json (fetch)
 * - fallback to localStorage posts (admin)
 * - render cards, filter, search
 * - lazy image loading via IntersectionObserver
 * - update dynamic meta tags when open article
 */

const POSTS_URL = '/data/posts.json';
const postsEl = document.getElementById('posts');
const searchInput = document.getElementById('searchInput');
const chips = document.querySelectorAll('.chip');

const articleModal = document.getElementById('articleModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalMeta = document.getElementById('modalMeta');
const modalClose = document.getElementById('modalClose');
const modalPermalink = document.getElementById('modalPermalink');

let allPosts = [];

/* Helpers */
function fmtDate(iso){
  const d = new Date(iso || Date.now());
  return d.toLocaleDateString('ru-RU', { year:'numeric', month:'long', day:'numeric' });
}
function setHTML(el, html){ el.innerHTML = html || ''; }

/* Load posts.json */
async function loadPosts(){
  try {
    const res = await fetch(POSTS_URL, {cache:'no-cache'});
    if (!res.ok) throw new Error('no remote posts');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch(e){
    try {
      const raw = localStorage.getItem('posts');
      return raw ? JSON.parse(raw) : [];
    } catch(err){
      return [];
    }
  }
}

/* Render */
function renderPosts(posts){
  postsEl.innerHTML = '';
  if (!posts.length){
    const p = document.createElement('p');
    p.className = 'muted';
    p.style.textAlign = 'center';
    p.style.padding = '4rem 0';
    p.textContent = 'Пока нет статей.';
    postsEl.appendChild(p);
    return;
  }

  posts.forEach(post=>{
    const a = document.createElement('article');
    a.className = 'post-card';
    a.tabIndex = 0;
    a.dataset.id = post.id;

    const coverHTML = post.cover ? `<img class="cover" data-src="${post.cover}" alt="${post.title}">` : '';
    a.innerHTML = `
      ${coverHTML}
      <div class="eyebrow">${fmtDate(post.date)}</div>
      <h3>${post.title}</h3>
      <p>${post.description || ''}</p>
      <div class="tags">${(post.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    `;

    a.addEventListener('click', ()=>openArticle(post));
    a.addEventListener('keypress', (e)=>{ if(e.key==='Enter') openArticle(post); });

    postsEl.appendChild(a);
  });

  initLazyImages();
}

/* Lazy load images */
function initLazyImages(){
  const imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){
          const img = en.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, {rootMargin: '120px'});
    imgs.forEach(i=>io.observe(i));
  } else {
    imgs.forEach(i=>{ i.src = i.dataset.src; i.removeAttribute('data-src'); });
  }
}

/* Open article modal and update meta tags */
function openArticle(post){
  modalTitle.textContent = post.title;
  modalMeta.textContent = `${fmtDate(post.date)} · ${ (post.tags||[]).join(', ') }`;
  setHTML(modalBody, post.content || '<p>(Нет контента)</p>');

  // update document title / meta
  document.title = `${post.title} — M.Tech Core`;
  updateMeta('description', post.description || '');
  updateMeta('og:title', post.title);
  updateMeta('og:description', post.description || '');
  if (post.cover) updateMeta('og:image', location.origin + post.cover);

  modalPermalink.href = `${location.origin}${location.pathname}#post-${post.id}`;

  if (typeof articleModal.showModal === 'function') {
    articleModal.showModal();
  } else {
    alert('Ваш браузер не поддерживает <dialog>. Статья откроется в текущем окне.');
  }
}

/* Update or create meta tag */
function updateMeta(name, content){
  if (!content) return;
  const isOG = name.startsWith('og:');
  let el = isOG ? document.querySelector(`meta[property="${name}"]`) : document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (isOG) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* Filtering + Search */
chips.forEach(ch=>{
  ch.addEventListener('click', ()=>{
    chips.forEach(c=>c.classList.remove('active'));
    ch.classList.add('active');
    const f = ch.dataset.filter;
    filterAndRender({filter: f});
  });
});
searchInput && searchInput.addEventListener('input', ()=>filterAndRender({q: searchInput.value}));

function filterAndRender({q='', filter='all'} = {}){
  q = (q||'').toLowerCase().trim();
  const results = allPosts.filter(p=>{
    if (filter !== 'all'){
      if (!p.tags || !p.tags.includes(filter)) return false;
    }
    if (!q) return true;
    const hay = ((p.title||'') + ' ' + (p.description||'') + ' ' + (p.content||'') + ' ' + (p.tags||[]).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  renderPosts(results);
}

/* Theme toggle */
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') document.documentElement.classList.add('dark');
else if (storedTheme === 'light') document.documentElement.classList.remove('dark');
themeToggle && themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

/* Modal close */
const modalCloseBtn = document.getElementById('modalClose');
modalCloseBtn && modalCloseBtn.addEventListener('click', ()=>{ if (articleModal.close) articleModal.close(); });

/* Init on load */
document.addEventListener('DOMContentLoaded', async ()=>{
  allPosts = await loadPosts();
  allPosts.sort((a,b)=> new Date(b.date) - new Date(a.date));
  renderPosts(allPosts);

  // open from hash
  if (location.hash.startsWith('#post-')){
    const id = location.hash.replace('#post-','');
    const p = allPosts.find(x=>String(x.id) === String(id));
    if (p) openArticle(p);
  }
});
