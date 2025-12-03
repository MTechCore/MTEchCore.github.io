// ========================================
// M.TECH CORE — ЧИСТЫЙ И РАБОЧИЙ JS
// ========================================

const ARTICLES = [
  {title:"WireGuard VPN за 10 минут",slug:"wireguard-10-minutes",date:"2025-11-15",tags:["linux","vpn"]}
];

// Переключение темы
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// Рендер статей
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

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const isAll = location.pathname.includes('all.html');
  render(isAll ? sorted : sorted.slice(0, 6));
  if (document.getElementById('count')) document.getElementById('count').textContent = sorted.length;

  // Фильтры
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      render(tag === 'all' ? sorted : sorted.filter(a => a.tags.includes(tag)));
    });
  });
});
