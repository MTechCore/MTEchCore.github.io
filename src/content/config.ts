// src/content/config.ts
// ═══════════════════════════════════════════════════════════════
// Схема контент-коллекций Astro
// Здесь описываем структуру данных для блога
// ═══════════════════════════════════════════════════════════════

import { defineCollection, z } from 'astro:content';

// ─────────────────────────────────────────────────────────────
// Коллекция: Блог
// Каждый .md файл в src/content/blog/ должен иметь эти поля
// ─────────────────────────────────────────────────────────────
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Заголовок статьи (обязательно)
    title: z.string(),
    
    // Краткое описание для превью (обязательно)
    description: z.string(),
    
    // Дата публикации (обязательно)
    // Формат в .md: pubDate: 2024-01-15
    pubDate: z.coerce.date(),
    
    // Дата обновления (опционально)
    updatedDate: z.coerce.date().optional(),
    
    // Картинка-обложка (опционально)
    heroImage: z.string().optional(),
    
    // Теги (опционально)
    tags: z.array(z.string()).default([]),
    
    // Черновик? Если true - не показываем на сайте
    draft: z.boolean().default(false),
  }),
});

// Экспортируем коллекции
export const collections = {
  'blog': blogCollection,
};
