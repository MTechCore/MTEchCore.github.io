// АВТОМАТИЧЕСКИ НАХОДИТ ВСЕ .md ФАЙЛЫ В articles/
const ARTICLES = [
  "esp32-home-assistant.md",
  "docker-2025.md",
  "arduino-blink.md"
  // ← просто кидай новые имена сюда — или оставь пустым, если хочешь полностью автомат
];

async function getArticles() {
  const list = [];
  for (const file of ARTICLES) {
    try {
      const r = await fetch(`articles/${file}`);
      if (!r.ok) continue;
      const text = await r.text();
      const titleMatch = text.match(/title:\s*(.+)/);
      const dateMatch = text.match(/date:\s*(.+)/);
      const tagsMatch = text.match(/tags:\s*(.+)/);
      
      list.push({
        title: titleMatch ? titleMatch[1] : file.replace('.md',''),
        slug: file.replace('.md',''),
        date: dateMatch ? dateMatch[1] : '2025-01-01',
        tags: tagsMatch ? tagsMatch[1].split(',').map(t=>t.trim()) : []
      });
    } catch (e) {}
  }
  return list.sort((a,b) => b.date.localeCompare(a.date));
}

function render(articles) {
  const container = document.getElementById('list') || document.getElementById('articles-container');
  if (!container) return;
  container.innerHTML = articles.map(a => `
    <div class="item">
      <h3><a href="articles/${a.slug}.html">${a.title}</a></h3>
      <div class="tags">${a.date} • ${a.tags.map(t=>`#${t}`).join(' ')}</div>
    </div>
  `).join('');
}

// Тема
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// Запуск
document.addEventListener('DOMContentLoaded', async () => {
  const articles = await getArticles();
  render(articles.slice(0, location.pathname.includes('all.html') ? 999 : 6));
  if (document.getElementById('count')) document.getElementById('count').textContent = articles.length;
});
