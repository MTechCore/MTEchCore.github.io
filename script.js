// script.js — ЭТОТ ФАЙЛ РАБОТАЕТ НА 1000% НА GITHUB PAGES
const ARTICLES = [
  {title:"Не умный дом на ESP32 + Home Assistant",slug:"esp32-home-assistant",date:"2025-12-02",tags:["arduino","esp32"]},
  {title:"Docker Compose 2025",slug:"docker-2025",date:"2025-11-28",tags:["linux","docker"]},
  {title:"FastAPI в продакшене",slug:"fastapi-production",date:"2025-11-20",tags:["python"]},
  {title:"Arduino Blink",slug:"arduino-blink",date:"2025-04-01",tags:["arduino"]}
];

// Тема — работает
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// ГЛАВНАЯ ФУНКЦИЯ — РЕНДЕР СТАТЕЙ
function renderArticles(articles) {
  const container = document.getElementById('list') || document.getElementById('articles-container');
  if (!container) return;

  container.innerHTML = articles.map(article => `
    <div class="item">
      <h3><a href="articles/${article.slug}.html">${article.title}</a></h3>
      <div class="tags">${article.date} • ${article.tags.map(t => '#' + t).join(' ')}</div>
    </div>
  `).join('');
}

// ЗАПУСК — ВСЁ РАБОТАЕТ!
document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  
  // Определяем, где мы (главная или все статьи)
  const isAllPage = location.pathname.includes('all.html');
  
  // Показываем статьи
  renderArticles(isAllPage ? sorted : sorted.slice(0, 6));
  
  // Счётчик на all.html
  if (document.getElementById('count')) {
    document.getElementById('count').textContent = sorted.length;
  }

  // ФИЛЬТРЫ — РАБОТАЮТ!
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tag = btn.dataset.tag;
      const filtered = tag === 'all' ? sorted : sorted.filter(a => a.tags.includes(tag));
      renderArticles(filtered);
    });
  });
});
