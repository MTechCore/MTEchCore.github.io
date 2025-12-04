// ========================================
// M.TECH CORE — ПОЛНЫЙ ФУНКЦИОНАЛ 2025
// ========================================

const ARTICLES = [
  {title:"5 смертельных ошибок Arduino, которые делают даже опытные",slug:"5-fatal-arduino-mistakes",date:"2025-11-15",tags:["arduino", "embedded", "proTips"]}
];

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

// КРАСИВЫЙ МГНОВЕННЫЙ ПОИСК
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

    searchResults.innerHTML = filtered.length === 0 
      ? '<div class="search-result-item">Ничего не найдено</div>'
      : filtered.map(a => `
        <div class="search-result-item">
          <a href="articles/${a.slug}.html">
            <strong>${a.title.replace(new RegExp(query, 'gi'), m => `<span style="color:var(--green)">${m}</span>`)}</strong>
            <small>${a.date} • ${a.tags.map(t => '#' + t).join(' ')}</small>
          </a>
        </div>
      `).join('');

    searchResults.classList.add('show');
  });

  // Закрытие при клике вне
  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });

  // Ctrl+K
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Тема
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

// Фильтры
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tag = btn.dataset.tag;
    const filtered = tag === 'all' ? ARTICLES : ARTICLES.filter(a => a.tags.includes(tag));
    render(filtered);
  });
});

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const isAll = location.pathname.includes('all.html');
  render(isAll ? sorted : sorted.slice(0, 6));
});

// Функция копирования кода (для страниц статей)
async function copyCode(button) {
  const wrapper = button.parentElement;
  const codeBlock = wrapper.querySelector('code');
  const textToCopy = codeBlock.textContent;

  try {
    await navigator.clipboard.writeText(textToCopy);
    // Визуальная обратная связь
    const originalText = button.textContent;
    button.textContent = 'Скопировано!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Ошибка при копировании: ', err);
    alert('Не удалось скопировать текст. Пожалуйста, выделите и скопируйте вручную.');
  }
}