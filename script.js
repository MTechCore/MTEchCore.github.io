const ARTICLES = [
  {title:"Умный дом на ESP32",slug:"esp32-home-assistant",date:"2025-12-02",tags:["arduino","esp32"]},
  {title:"Docker Compose 2025",slug:"docker-2025",date:"2025-11-28",tags:["linux","docker"]},
  {title:"FastAPI в продакшене",slug:"fastapi-production",date:"2025-11-20",tags:["python"]},
  {title:"WireGuard за 10 минут",slug:"wireguard-10-minutes",date:"2025-11-15",tags:["linux"]},
  {title:"Arduino Blink",slug:"arduino-blink",date:"2025-04-01",tags:["arduino"]}
];

function render(articles) {
  const list = document.getElementById('list') || document.getElementById('articles-container');
  if (!list) return;
  list.innerHTML = articles.map(a => `
    <div class="item">
      <h3><a href="articles/${a.slug}.html">${a.title}</a></h3>
      <div class="tags">${a.date} • ${a.tags.map(t=>`#${t}`).join(' ')}</div>
    </div>
  `).join('');
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a,b) => b.date.localeCompare(a.date));
  const isAll = location.pathname.includes('all.html');
  render(isAll ? sorted : sorted.slice(0,6));
  if (document.getElementById('count')) document.getElementById('count').textContent = sorted.length;

  document.querySelectorAll('.filters button').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      render(tag === 'all' ? sorted : sorted.filter(a => a.tags.includes(tag)));
    };
  });
});
