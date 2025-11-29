import pool from '../config/database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createNotification } from '../utils/notificationHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.doc', '.docx'].includes(ext)) return 'doc';
  if (['.xls', '.xlsx'].includes(ext)) return 'xls';
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) return 'img';
  if (['.txt'].includes(ext)) return 'txt';
  return 'txt';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getDocuments = async (req, res) => {
  try {
    const userId = req.userId;
    const { folderId } = req.query;
    let query = 'SELECT d.*, f.name as folder_name, f.color as folder_color FROM documents d LEFT JOIN folders f ON d.folder_id = f.id WHERE d.user_id = $1';
    const params = [userId];
    if (folderId) {
      query += ' AND d.folder_id = $2';
      params.push(folderId);
    }
    query += ' ORDER BY d.date_added DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
};

export const getDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT d.*, f.name as folder_name FROM documents d LEFT JOIN folders f ON d.folder_id = f.id WHERE d.id = $1 AND d.user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Error fetching document' });
  }
};

export const createDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, folderId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const fileName = name || req.file.originalname;
    const fileType = getFileType(req.file.originalname);
    // Guardar la ruta relativa desde server/ para servir estáticamente
    // req.file.path es: server/uploads/file-xxx.ext
    // Necesitamos guardar: uploads/file-xxx.ext (relativo a server/)
    const relativePath = path.relative(path.join(__dirname, '../'), filePath).replace(/\\/g, '/');
    const result = await pool.query(
      'INSERT INTO documents (name, type, size, file_path, folder_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [fileName, fileType, formatFileSize(fileSize), relativePath, folderId || null, userId]
    );
    const newDocument = result.rows[0];

    // Obtener nombre del usuario y carpeta
    const user = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const folder = folderId ? await pool.query('SELECT name FROM folders WHERE id = $1', [folderId]) : { rows: [] };
    const userName = user.rows[0]?.name || 'Usuario';
    const folderName = folder.rows[0]?.name || null;

    // Crear notificación para documentos importantes (PDF, DOC, XLS)
    if (['pdf', 'doc', 'xls'].includes(fileType)) {
      await createNotification(
        userId,
        'Documento Importante Subido',
        `Se ha subido el documento "${fileName}" (${formatFileSize(fileSize)})`,
        'documento',
        'document',
        newDocument.id,
        {
          templateName: 'documentUploaded',
          templateData: [
            userName,
            newDocument.name,
            newDocument.type,
            folderName
          ]
        }
      );
    }

    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Error creating document' });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, folderId } = req.body;
    const checkResult = await pool.query(
      'SELECT id FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (name) { updates.push(`name = $${paramCount++}`); values.push(name); }
    if (folderId !== undefined) { updates.push(`folder_id = $${paramCount++}`); values.push(folderId || null); }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id, userId);
    const query = `UPDATE documents SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Error updating document' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT file_path FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    // Construir la ruta completa del archivo
    const filePath = path.join(__dirname, '../', result.rows[0].file_path).replace(/\\/g, '/');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await pool.query('DELETE FROM documents WHERE id = $1 AND user_id = $2', [id, userId]);
    res.status(204).send();
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Error deleting document' });
  }
};

// Endpoint para VER el archivo (sin forzar descarga)
export const viewDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT name, file_path FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const filePathFromDb = result.rows[0].file_path;
    const fullPath = path.join(__dirname, '../', filePathFromDb).replace(/\\/g, '/');
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    
    const fileName = result.rows[0].name;
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['.jpg', '.jpeg'].includes(ext)) {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.doc', '.docx'].includes(ext)) {
      contentType = 'application/msword';
    } else if (['.xls', '.xlsx'].includes(ext)) {
      contentType = 'application/vnd.ms-excel';
    } else if (ext === '.txt') {
      contentType = 'text/plain';
    }
    
    // Headers para visualización (sin Content-Disposition: attachment)
    // Leer el archivo y enviarlo sin forzar descarga
    const fileBuffer = fs.readFileSync(fullPath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileBuffer.length);
    // NO establecer Content-Disposition para que el navegador lo muestre en lugar de descargarlo
    res.send(fileBuffer);
  } catch (error) {
    console.error('View document error:', error);
    res.status(500).json({ error: 'Error viewing document' });
  }
};

// Endpoint para DESCARGAR el archivo (fuerza descarga)
export const downloadDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT name, file_path FROM documents WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const filePathFromDb = result.rows[0].file_path;
    const fullPath = path.join(__dirname, '../', filePathFromDb).replace(/\\/g, '/');
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    
    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = result.rows[0].name;
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['.jpg', '.jpeg'].includes(ext)) {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.doc', '.docx'].includes(ext)) {
      contentType = 'application/msword';
    } else if (['.xls', '.xlsx'].includes(ext)) {
      contentType = 'application/vnd.ms-excel';
    } else if (ext === '.txt') {
      contentType = 'text/plain';
    }
    
    // Headers para descarga (con Content-Disposition: attachment)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Error downloading document' });
  }
};

