// ========================================
// M.TECH CORE — УМНЫЙ СПИСОК СТАТЕЙ
// Автоматически находит все .html в articles/
// НИКАКИХ ПРАВОК КОДА ПРИ ДОБАВЛЕНИИ СТАТЬИ!
// ========================================

let allArticles = [];

// Загружаем все .html файлы из папки articles/
async function loadArticles() {
  const response = await fetch('articles/');
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  const links = [...doc.querySelectorAll('a')]
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.endsWith('.html') && !href.includes('..'))
    .map(file => {
      const slug = file.replace('.html', '');
      const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return { title, slug, file, date: '2025-01-01', tags: [] };
    });

  // Читаем метаданные из .md файлов (если есть)
  for (const article of links) {
    try {
      const mdResp = await fetch(`articles/${article.slug}.md`);
      if (mdResp.ok) {
        const mdText = await mdResp.text();
        const fm = mdText.match(/---\n([\s\S]*?)\n---/);
        if (fm) {
          fm[1].split('\n').forEach(line => {
            if (line.startsWith('title:')) article.title = line.split(':')[1].trim();
            if (line.startsWith('date:')) article.date = line.split(':')[1].trim();
            if (line.startsWith('tags:')) article.tags = line.split(':')[1].trim().split(',').map(t => t.trim());
          });
        }
      }
    } catch (e) {}
  }

  return links.sort((a, b) => b.date.localeCompare(a.date || '2025-01-01'));
}

// Рендер списка
function render(articles) {
  const container = document.getElementById('articles-container');
  if (!container) return;

  container.innerHTML = articles.map(a => `
    <div class="article-card">
      <h3><a href="articles/${a.file}">${a.title}</a></h3>
      <div class="meta">${a.date} • ${a.tags.map(t => `#${t}`).join(' ')}</div>
    </div>
  `).join('');
}

// Тема
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
  document.body.classList.add('light');
}

// Запуск
document.addEventListener('DOMContentLoaded', async () => {
  allArticles = await loadArticles();
  const isAll = location.pathname.includes('all.html');
  render(isAll ? allArticles : allArticles.slice(0, 6));
  if (document.getElementById('count')) document.getElementById('count').textContent = allArticles.length;

  // Поиск
  document.getElementById('search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    render(allArticles.filter(a => a.title.toLowerCase().includes(q)));
  });

  // ФИЛЬТРЫ ПО ТЕМАМ — РАБОТАЮТ!
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      render(tag === 'all' ? allArticles : allArticles.filter(a => a.tags.includes(tag)));
    };
  });
});
