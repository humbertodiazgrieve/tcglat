import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    categoria: z.enum(['noticias', 'guias', 'estrategia', 'analisis']),
    fecha: z.string().transform(str => new Date(str)),
    imagen: z.string().optional(),
    autor: z.string().default('tcglat'),
    tags: z.array(z.string()).optional(),
    destacado: z.boolean().default(false),
    insights: z.array(z.string()).optional()
  })
});

export const collections = { posts };
