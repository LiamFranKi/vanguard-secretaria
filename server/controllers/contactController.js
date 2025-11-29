import pool from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para avatares de contactos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/contacts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const contactId = req.params.id || 'new';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `contact-${contactId}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  }
});

export const uploadContactAvatar = upload.single('avatar');

export const getContacts = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT * FROM contacts WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
};

export const getContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM contacts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Error fetching contact' });
  }
};

export const createContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone, role, direccion, empresa, detalle, avatar } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email and phone are required' });
    }
    const result = await pool.query(
      'INSERT INTO contacts (name, email, phone, role, direccion, empresa, detalle, avatar, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, email, phone, role || '', direccion || null, empresa || null, detalle || null, avatar || null, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Error creating contact' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, email, phone, role, direccion, empresa, detalle, avatar } = req.body;
    const checkResult = await pool.query(
      'SELECT id FROM contacts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (name) { updates.push(`name = $${paramCount++}`); values.push(name); }
    if (email) { updates.push(`email = $${paramCount++}`); values.push(email); }
    if (phone) { updates.push(`phone = $${paramCount++}`); values.push(phone); }
    if (role !== undefined) { updates.push(`role = $${paramCount++}`); values.push(role); }
    if (direccion !== undefined) { updates.push(`direccion = $${paramCount++}`); values.push(direccion); }
    if (empresa !== undefined) { updates.push(`empresa = $${paramCount++}`); values.push(empresa); }
    if (detalle !== undefined) { updates.push(`detalle = $${paramCount++}`); values.push(detalle); }
    if (avatar !== undefined) { updates.push(`avatar = $${paramCount++}`); values.push(avatar); }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id, userId);
    const query = `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
};

// Subir avatar de contacto
export const uploadContactAvatarHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // Verificar que el contacto pertenece al usuario
    const checkResult = await pool.query(
      'SELECT id FROM contacts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (checkResult.rows.length === 0) {
      // Eliminar el archivo subido si el contacto no existe
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    const avatarUrl = `/uploads/contacts/${req.file.filename}`;
    
    // Actualizar avatar del contacto
    const result = await pool.query(
      'UPDATE contacts SET avatar = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [avatarUrl, id, userId]
    );

    res.json({ success: true, contact: result.rows[0], avatar_url: avatarUrl });
  } catch (error) {
    console.error('Upload contact avatar error:', error);
    // Eliminar el archivo si hay error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ error: 'Error al subir el avatar del contacto' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Error deleting contact' });
  }
};

