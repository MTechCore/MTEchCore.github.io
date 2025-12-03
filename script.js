const ARTICLES = [
  {title:"Умный дом на ESP32 + Home Assistant",slug:"esp32-home-assistant",date:"2025-12-02",tags:["arduino","esp32"]},
  {title:"WireGuard VPN за 10 минут",slug:"wireguard-10-minutes",date:"2025-11-15",tags:["linux","vpn"]},
  {title:"Docker Compose 2025",slug:"docker-2025",date:"2025-11-28",tags:["linux","docker"]},
  {title:"FastAPI в продакшене",slug:"fastapi-production",date:"2025-11-20",tags:["python"]},
  {title:"Arduino Blink",slug:"arduino-blink",date:"2025-04-01",tags:["arduino"]}
];

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

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');

document.addEventListener('DOMContentLoaded', () => {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const isAll = location.pathname.includes('all.html');
  render(isAll ? sorted : sorted.slice(0, 6));
  if (document.getElementById('count')) document.getElementById('count').textContent = sorted.length;

  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      render(tag === 'all' ? sorted : sorted.filter(a => a.tags.includes(tag)));
    });
  });
});
