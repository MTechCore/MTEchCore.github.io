/**
 * script.js
 * Главный клиентский скрипт: рендер карточек, поиск, фильтры, lazy-loading, modal
 *
 * Поддержка:
 * - Загружает /data/posts.json (fetch)
 * - fallback: localStorage (если админ добавил статьи)
 * - Ленивая загрузка изображений через IntersectionObserver
 * - Динамическое обновление meta tags для OpenGraph при открытии статьи
 */

/* ============================
   Utilities
   ============================ */

/**
 * Simple date formatter
 * @param {string} iso
 * @returns {string}
 */
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { year:'numeric', month:'short', day:'numeric' });
}

/**
 * Safely set innerHTML (here we trust content from admin).
 * In production — нужно добавлять sanitization.
 * @param {Element} el
 * @param {string} html
 */
function setHTML(el, html) {
  el.innerHTML = html;
}

/* ============================
   Data loading
   ============================ */

const POSTS_URL = '/data/posts.json';

/**
 * Load posts.json, fallback to localStorage 'posts'
 * @returns {Promise<Array>}
 */
export async function loadPosts() {
  try {
    const res = await fetch(POSTS_URL, {cache: 'no-cache'});
    if (!res.ok) throw new Error('no remote posts');
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    // fallback to localStorage (admin changes)
    try {
      const raw = localStorage.getItem('posts');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

/* ============================
   Rendering / UI
   ============================ */

const postsEl = document.getElementById('posts');
const searchInput = document.getElementById('searchInput');
const articleModal = document.getElementById('articleModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalMeta = document.getElementById('modalMeta');
const modalClose = document.getElementById('modalClose');
const modalPermalink = document.getElementById('modalPermalink');

let allPosts = [];

/**
 * Render all posts (cards)
 * @param {Array} posts
 */
function renderPosts(posts) {
  postsEl.innerHTML = '';
  if (!posts.length) {
    postsEl.innerHTML = '<p class="muted">Пока нет статей.</p>';
    return;
  }

  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.id = post.id;

    const imgHTML = post.cover ? `<img class="card-image" data-src="${post.cover}" alt="${post.title}" loading="lazy" style="width:100%;border-radius:8px;margin-bottom:.6rem">` : '';

    card.innerHTML = `
      ${imgHTML}
      <div class="eyebrow">${fmtDate(post.date)}</div>
      <h3>${post.title}</h3>
      <p>${post.description || ''}</p>
      <div class="tags">${(post.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div>
    `;

    card.addEventListener('click', () => openArticle(post));
    postsEl.appendChild(card);
  });

  // init lazy images
  initLazyImages();
}

/**
 * Open modal with article content and update meta tags for SEO/OG
 * @param {Object} post
 */
function openArticle(post) {
  modalTitle.textContent = post.title;
  modalMeta.textContent = `${fmtDate(post.date)} · ${ (post.tags || []).join(', ') }`;
  setHTML(modalBody, post.content || '');

  // update document meta (dynamic meta tags)
  document.title = `${post.title} — M.Tech Core`;
  updateMeta('description', post.description || '');
  updateMeta('og:title', post.title);
  updateMeta('og:description', post.description || '');
  if (post.cover) updateMeta('og:image', location.origin + post.cover);

  // permalink (anchor with id)
  modalPermalink.href = `${location.origin}${location.pathname}#post-${post.id}`;

  if (typeof articleModal.showModal === 'function') {
    articleModal.showModal();
  } else {
    // fallback simple overlay
    alert('Откройте в браузере с поддержкой <dialog> для лучшего UX.');
  }
}

/**
 * Update or create meta tag by name/property
 * @param {string} name
 * @param {string} content
 */
function updateMeta(name, content) {
  if (!content) return;
  let selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:')) el.setAttribute('property', name);
    else el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* ============================
   Lazy load images (IntersectionObserver)
   ============================ */

function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    imgs.forEach(i => io.observe(i));
  } else {
    // fallback: load all
    imgs.forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
  }
}

/* ============================
   Filters & Search
   ============================ */

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterAndRender({ filter: f });
  });
});

searchInput.addEventListener('input', () => filterAndRender({ q: searchInput.value }));

/**
 * Filter posts by query / tag
 * @param {Object} opts
 */
function filterAndRender(opts = {}) {
  let q = (opts.q || '').toLowerCase().trim();
  let filter = (opts.filter || 'all');

  let results = allPosts.filter(p => {
    if (filter !== 'all') {
      if (!p.tags || !p.tags.includes(filter)) return false;
    }
    if (!q) return true;
    const hay = (p.title + ' ' + (p.description||'') + ' ' + (p.content||'') + ' ' + (p.tags||[]).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  renderPosts(results);
}

/* ============================
   Init
   ============================ */

modalClose.addEventListener('click', () => {
  if (typeof articleModal.close === 'function') articleModal.close();
});

document.addEventListener('DOMContentLoaded', async () => {
  allPosts = await loadPosts();
  // sort by date desc
  allPosts.sort((a,b) => new Date(b.date) - new Date(a.date));
  renderPosts(allPosts);

  // if hash points to post, open it
  if (location.hash.startsWith('#post-')) {
    const id = location.hash.replace('#post-','');
    const post = allPosts.find(p=>String(p.id) === String(id));
    if (post) openArticle(post);
  }

  // theme toggle: respect prefers-color-scheme by default
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') document.documentElement.classList.add('dark');
  else if (storedTheme === 'light') document.documentElement.classList.remove('dark');

  themeToggle && themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
});
