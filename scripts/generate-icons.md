# Generar Iconos PWA

Para generar los iconos necesarios para PWA, puedes usar una herramienta online como:

1. **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator
2. **RealFaviconGenerator**: https://realfavicongenerator.net/

## Iconos Necesarios

- `icon-192x192.png` - Icono 192x192px
- `icon-512x512.png` - Icono 512x512px
- `apple-touch-icon.png` - Icono para iOS (180x180px)

## Diseño Sugerido

- Fondo: Gradiente de violeta (#7c3aed) a índigo (#4f46e5)
- Letra: "S" en blanco, centrada
- Forma: Cuadrado con bordes redondeados

## Comando Rápido (si tienes ImageMagick)

```bash
# Crear icono 192x192
convert -size 192x192 xc:none -fill "url(#gradient)" -draw "roundrectangle 0,0 192,192 20,20" -pointsize 120 -fill white -gravity center -annotate +0+0 "S" icon-192x192.png
```

Por ahora, el favicon SVG funciona. Los iconos PNG se pueden generar después.

