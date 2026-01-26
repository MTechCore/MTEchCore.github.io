// astro.config.mjs
// ═══════════════════════════════════════════════════════════════
// Конфигурация Astro для GitHub Pages (User Page)
// Для User Page репозитория (username.github.io) base НЕ нужен!
// ═══════════════════════════════════════════════════════════════

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // ─────────────────────────────────────────────────────────────
  // ВАЖНО: Для User Page (mtechcore.github.io) указываем полный URL
  // Для Project Page нужно было бы добавить base: '/repo-name/'
  // ─────────────────────────────────────────────────────────────
  site: 'https://mtechcore.github.io',
  
  // Интеграции
  integrations: [
    tailwind(),
  ],
  
  // Генерируем статический сайт (по умолчанию, но явно указываем)
  output: 'static',
  
  // Настройки сборки
  build: {
    // Формат URL: /blog/post/ вместо /blog/post.html
    format: 'directory',
  },
  
  // Настройки Markdown (для блога)
  markdown: {
    // Подсветка синтаксиса кода
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
