# 📱 Instrucciones para Crear Iconos PWA

## Opción 1: Usar Favicon.io (Recomendado)

1. Ve a https://favicon.io/favicon-generator/
2. Texto: **S**
3. Fondo: Gradiente de **#7c3aed** a **#4f46e5**
4. Descarga el paquete
5. Copia estos archivos a `public/`:
   - `android-chrome-192x192.png` → renombrar a `icon-192x192.png`
   - `android-chrome-512x512.png` → renombrar a `icon-512x512.png`
   - `apple-touch-icon.png` (ya viene incluido)

## Opción 2: Usar el Generador HTML Local

1. Abre `public/create-icons.html` en tu navegador
2. Los iconos se descargarán automáticamente
3. Mueve los archivos descargados a `public/`

## Opción 3: Crear Manualmente

Usa cualquier editor de imágenes (Photoshop, GIMP, Canva) para crear:

- **icon-192x192.png**: 192x192px
- **icon-512x512.png**: 512x512px  
- **apple-touch-icon.png**: 180x180px

**Especificaciones:**
- Fondo: Gradiente de violeta (#7c3aed) a índigo (#4f46e5)
- Letra: "S" en blanco, centrada, bold
- Forma: Cuadrado con bordes redondeados (20% del tamaño)

## Verificación

Después de crear los iconos, verifica que existan:

```bash
ls public/icon-*.png
ls public/apple-touch-icon.png
```

El favicon SVG ya está creado y funcionando.

