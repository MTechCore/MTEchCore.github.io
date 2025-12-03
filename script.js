// ========================================
// M.TECH CORE — ПОЛНЫЙ ФУНКЦИОНАЛ С МГНОВЕННЫМ ПОИСКОМ
// ========================================

// ТЫ САМ ДОБАВЛЯЕШЬ СТАТЬИ — НАДЁЖНО!
const ARTICLES = [
  {title:"Умный дом на ESP32 + Home Assistant",slug:"esp32-home-assistant",date:"2025-12-02",tags:["arduino","esp32"]},
  {title:"WireGuard VPN за 10 минут",slug:"wireguard-10-minutes",date:"2025-11-15",tags:["linux","vpn"]},
  {title:"Docker Compose 2025",slug:"docker-2025",date:"2025-11-28",tags:["linux","docker"]},
  {title:"FastAPI в продакшене",slug:"fastapi-production",date:"2025-11-20",tags:["python"]},
  {title:"Arduino Blink",slug:"arduino-blink",date:"2025-04-01",tags:["arduino"]},
  // ← Добавляй сюда новые статьи одной строкой!
];

// Рендер списка статей
function render(articles) {
  const container = document.getElementById('articles-list');
  if (!container) return;
  
  container.innerHTML = articles.map(a => `
    <div class="article">
      <h3><a href="articles/${a.slug}.html">${a.title}</a></h3>
      <div class="meta">${a.date} • ${a.tags.map(t => '#' + t).join(' ')}</div>
    </div>
  `).join('');
}

// МГНОВЕННЫЙ ВЫПАДАЮЩИЙ ПОИСК — КАК У ALEXGYVER!
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('search-results');

if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      searchResults.classList.remove('show');
      return;
    }

    const filtered = ARTICLES.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.tags.some(t => t.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = '<div class="result-item">Ничего не найдено</div>';
    } else {
      searchResults.innerHTML = filtered.map(a => `
        <div class="result-item">
          <a href="articles/${a.slug}.html">
            <strong>${highlight(a.title, query)}</strong>
            <small>${a.date} • ${a.tags.map(t => '#' + t).join(' ')}</small>
          </a>
        </div>
      `).join('');
    }
    
    searchResults.classList.add('show');
  });

  // Закрываем при клике вне
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });

  // Подсветка найденного текста
  function highlight(text, query) {
    return text.replace(new RegExp(`(${query})`, 'gi'), '<span style="color:var(--green)">$1</span>');
  }

  // Ctrl+K фокус на поиск
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Переключение темы
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// Фильтры по категориям
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const tag = btn.dataset.tag;
    const filtered = tag === 'all' ? ARTICLES : ARTICLES.filter(a => a.tags.includes(tag));
    render(filtered);
  });
});

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const isAll = location.pathname.includes('all.html');
  
  render(isAll ? sorted : sorted.slice(0, 6));
  
  if (document.getElementById('count')) {
    document.getElementById('count').textContent = ARTICLES.length;
  }
});
