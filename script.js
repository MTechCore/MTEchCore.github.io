// АВТОМАТИЧЕСКОЕ ДОБАВЛЕНИЕ СТАТЕЙ — НИКАКИХ ПРАВОК!
let articles = [];

// Загружаем все .html файлы из articles/
async function loadArticles() {
  try {
    const resp = await fetch('articles/');
    const text = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    const files = [...doc.querySelectorAll('a')]
      .map(a => a.href.split('/').pop())
      .filter(f => f.endsWith('.html') && !f.includes('..'))
      .map(file => {
        const slug = file.replace('.html', '');
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { title, slug, file, date: '2025-01-01', tags: [] };
      });

    // Читаем метаданные из .md
    for (const a of files) {
      try {
        const md = await fetch(`articles/${a.slug}.md`).then(r => r.ok ? r.text() : '');
        const fm = md.match(/---\n([\s\S]*?)\n---/);
        if (fm) {
          fm[1].split('\n').forEach(l => {
            if (l.startsWith('title:')) a.title = l.split(':')[1].trim();
            if (l.startsWith('date:')) a.date = l.split(':')[1].trim();
            if (l.startsWith('tags:')) a.tags = l.split(':')[1].trim().split(',').map(t=>t.trim());
          });
        }
      } catch(e) {}
    }

    return files.sort((a,b) => b.date.localeCompare(a.date));
  } catch(e) { return []; }
}

function render(arts) {
  const list = document.getElementById('list');
  if (!list) return;
  list.innerHTML = arts.map(a => `
    <div class="item">
      <h3><a href="articles/${a.file}">${a.title}</a></h3>
      <div class="tags">${a.date} • ${a.tags.map(t=>`#${t}`).join(' ')}</div>
    </div>
  `).join('');
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

document.addEventListener('DOMContentLoaded', async () => {
  articles = await loadArticles();
  const isAll = location.pathname.includes('all.html');
  render(isAll ? articles : articles.slice(0,6));
  if (document.getElementById('count')) document.getElementById('count').textContent = articles.length;

  document.querySelectorAll('.filters button').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('.filters button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const tag = b.dataset.tag;
      render(tag === 'all' ? articles : articles.filter(a => a.tags.includes(tag)));
    };
  });
});
