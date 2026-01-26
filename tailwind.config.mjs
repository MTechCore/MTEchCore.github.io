// tailwind.config.mjs
// ═══════════════════════════════════════════════════════════════
// Конфигурация Tailwind CSS
// Темная гиковская тема с акцентными цветами
// ═══════════════════════════════════════════════════════════════

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  // Принудительно включаем dark mode (класс на html)
  darkMode: 'class',
  
  theme: {
    extend: {
      // ─────────────────────────────────────────────────────────
      // Кастомная цветовая палитра бренда
      // Меняй эти цвета под свой стиль!
      // ─────────────────────────────────────────────────────────
      colors: {
        // Основной фон (почти черный с синим оттенком)
        'brand-bg': '#0a0a0f',
        'brand-bg-light': '#12121a',
        
        // Акцентный цвет (кибер-голубой)
        'brand-accent': '#00d4ff',
        'brand-accent-dim': '#0099cc',
        
        // Вторичный акцент (фиолетовый)
        'brand-secondary': '#a855f7',
        
        // Текст
        'brand-text': '#e4e4e7',
        'brand-text-dim': '#71717a',
        
        // Граница карточек
        'brand-border': '#27272a',
      },
      
      // Шрифты (можно подключить кастомные)
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Анимации
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          '100%': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff' },
        },
      },
    },
  },
  
  plugins: [],
};
