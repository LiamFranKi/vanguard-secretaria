import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para logos, favicons e iconos PWA
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/config');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // Mantener el nombre del campo para identificar el tipo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|ico/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, SVG, ICO)'));
    }
  }
});

export const uploadLogo = upload.single('logo');
export const uploadFavicon = upload.single('favicon');
export const uploadIcon192 = upload.single('icon_192');
export const uploadIcon512 = upload.single('icon_512');
export const uploadAppleTouchIcon = upload.single('apple_touch_icon');

// Obtener configuración (solo hay una configuración)
export const getConfig = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM system_config WHERE id = 1'
    );

    if (result.rows.length === 0) {
      // Si no existe, crear configuración por defecto
      const defaultConfig = await pool.query(
        `INSERT INTO system_config (id, nombre_sistema, titulo, descripcion_sistema, color_primario, color_secundario)
         VALUES (1, 'SecretariaPro', 'Sistema de Gestión Administrativa', 'Plataforma integral de gestión', '#7c3aed', '#4f46e5')
         RETURNING *`
      );
      return res.json({ success: true, data: defaultConfig.rows[0] });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Error fetching configuration' });
  }
};

// Actualizar configuración (solo admin)
export const updateConfig = async (req, res) => {
  try {
    const {
      nombre_sistema,
      titulo,
      descripcion_sistema,
      color_primario,
      color_secundario,
      logo_url,
      favicon_url,
      icon_192_url,
      icon_512_url,
      apple_touch_icon_url,
      email_contacto,
      telefono_contacto,
      direccion,
      footer_text
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (nombre_sistema !== undefined) {
      updates.push(`nombre_sistema = $${paramCount++}`);
      values.push(nombre_sistema);
    }
    if (titulo !== undefined) {
      updates.push(`titulo = $${paramCount++}`);
      values.push(titulo);
    }
    if (descripcion_sistema !== undefined) {
      updates.push(`descripcion_sistema = $${paramCount++}`);
      values.push(descripcion_sistema);
    }
    if (color_primario !== undefined) {
      updates.push(`color_primario = $${paramCount++}`);
      values.push(color_primario);
    }
    if (color_secundario !== undefined) {
      updates.push(`color_secundario = $${paramCount++}`);
      values.push(color_secundario);
    }
    if (logo_url !== undefined) {
      updates.push(`logo_url = $${paramCount++}`);
      values.push(logo_url);
    }
    if (favicon_url !== undefined) {
      updates.push(`favicon_url = $${paramCount++}`);
      values.push(favicon_url);
    }
    if (icon_192_url !== undefined) {
      updates.push(`icon_192_url = $${paramCount++}`);
      values.push(icon_192_url);
    }
    if (icon_512_url !== undefined) {
      updates.push(`icon_512_url = $${paramCount++}`);
      values.push(icon_512_url);
    }
    if (apple_touch_icon_url !== undefined) {
      updates.push(`apple_touch_icon_url = $${paramCount++}`);
      values.push(apple_touch_icon_url);
    }
    if (email_contacto !== undefined) {
      updates.push(`email_contacto = $${paramCount++}`);
      values.push(email_contacto);
    }
    if (telefono_contacto !== undefined) {
      updates.push(`telefono_contacto = $${paramCount++}`);
      values.push(telefono_contacto);
    }
    if (direccion !== undefined) {
      updates.push(`direccion = $${paramCount++}`);
      values.push(direccion);
    }
    if (footer_text !== undefined) {
      updates.push(`footer_text = $${paramCount++}`);
      values.push(footer_text);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(1); // id = 1

    const query = `
      UPDATE system_config 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Error updating configuration' });
  }
};

// Subir logo
export const uploadLogoHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const logoUrl = `/uploads/config/${req.file.filename}`;
    
    // Actualizar configuración con la nueva URL del logo
    const result = await pool.query(
      'UPDATE system_config SET logo_url = $1 WHERE id = 1 RETURNING *',
      [logoUrl]
    );

    res.json({ success: true, data: result.rows[0], logo_url: logoUrl });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ error: 'Error al subir el logo' });
  }
};

// Subir favicon
export const uploadFaviconHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const faviconUrl = `/uploads/config/${req.file.filename}`;
    
    // Actualizar configuración con la nueva URL del favicon
    const result = await pool.query(
      'UPDATE system_config SET favicon_url = $1 WHERE id = 1 RETURNING *',
      [faviconUrl]
    );

    res.json({ success: true, data: result.rows[0], favicon_url: faviconUrl });
  } catch (error) {
    console.error('Upload favicon error:', error);
    res.status(500).json({ error: 'Error al subir el favicon' });
  }
};

// Subir icono 192x192
export const uploadIcon192Handler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const iconUrl = `/uploads/config/${req.file.filename}`;
    
    const result = await pool.query(
      'UPDATE system_config SET icon_192_url = $1 WHERE id = 1 RETURNING *',
      [iconUrl]
    );

    res.json({ success: true, data: result.rows[0], icon_192_url: iconUrl });
  } catch (error) {
    console.error('Upload icon 192 error:', error);
    res.status(500).json({ error: 'Error al subir el icono 192x192' });
  }
};

// Subir icono 512x512
export const uploadIcon512Handler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const iconUrl = `/uploads/config/${req.file.filename}`;
    
    const result = await pool.query(
      'UPDATE system_config SET icon_512_url = $1 WHERE id = 1 RETURNING *',
      [iconUrl]
    );

    res.json({ success: true, data: result.rows[0], icon_512_url: iconUrl });
  } catch (error) {
    console.error('Upload icon 512 error:', error);
    res.status(500).json({ error: 'Error al subir el icono 512x512' });
  }
};

// Subir Apple Touch Icon
export const uploadAppleTouchIconHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const iconUrl = `/uploads/config/${req.file.filename}`;
    
    const result = await pool.query(
      'UPDATE system_config SET apple_touch_icon_url = $1 WHERE id = 1 RETURNING *',
      [iconUrl]
    );

    res.json({ success: true, data: result.rows[0], apple_touch_icon_url: iconUrl });
  } catch (error) {
    console.error('Upload apple touch icon error:', error);
    res.status(500).json({ error: 'Error al subir el Apple Touch Icon' });
  }
};
