# tcglat.com

Blog minimalista de Trading Card Games - Construido con Astro y desplegado en Cloudflare Pages.

## Desarrollar

```bash
npm install
npm run dev
```

## Construir

```bash
npm run build
```

## Desplegar en Cloudflare Pages

1. Conecta este repo a Cloudflare Pages
2. Configura:
   - Build command: `npm run build`
   - Build output: `dist`
3. Listo

## Estructura

```
src/
├── components/    # Componentes reutilizables
├── content/
│   └── posts/    # Artículos en MDX
├── layouts/      # Layouts base
└── pages/        # Rutas del sitio
```

## Agregar contenido

Crea archivos en `src/content/posts/` con frontmatter:

```yaml
---
titulo: "Título del artículo"
descripcion: "Descripción breve"
categoria: "noticias"  # noticias, guias, estrategia, analisis
fecha: "2025-03-23"
imagen: "url-a-imagen"
autor: "tu-nombre"
tags: ["tag1", "tag2"]
destacado: true
---

# Contenido en Markdown...
```
