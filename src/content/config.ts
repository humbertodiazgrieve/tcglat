import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    tipo: z.enum(['pokemon', 'yugioh', 'magic', 'lorcana', 'onepiece']).default('pokemon'),
    categoria: z.enum(['noticias', 'guias', 'estrategia', 'analisis']),
    fecha: z.string().transform(str => new Date(str)),
    imagen: z.string().optional(),
    autor: z.string().default('tcglat'),
    tags: z.array(z.string()).optional(),
    destacado: z.boolean().default(false),
    insights: z.array(z.string()).optional(),
    video: z.string().optional(),
    deckCode: z.string().optional(),
    galeria: z.array(z.string()).optional()
  })
});

const postsEn = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['pokemon', 'yugioh', 'magic', 'lorcana', 'onepiece']).default('pokemon'),
    category: z.enum(['news', 'guides', 'strategy', 'analysis']),
    date: z.string().transform(str => new Date(str)),
    image: z.string().optional(),
    author: z.string().default('tcglat'),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    insights: z.array(z.string()).optional(),
    video: z.string().optional(),
    deckCode: z.string().optional(),
    gallery: z.array(z.string()).optional()
  })
});

export const collections = { posts, postsEn };
