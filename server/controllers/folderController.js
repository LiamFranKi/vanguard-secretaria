import pool from '../config/database.js';

export const getFolders = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT f.*, COUNT(d.id) as document_count 
       FROM folders f 
       LEFT JOIN documents d ON f.id = d.folder_id 
       WHERE f.user_id = $1 
       GROUP BY f.id 
       ORDER BY f.name ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ error: 'Error fetching folders' });
  }
};

export const getFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM folders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({ error: 'Error fetching folder' });
  }
};

export const createFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, color, icon } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }
    const result = await pool.query(
      'INSERT INTO folders (name, color, icon, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, color, icon || null, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: 'Error creating folder' });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, color, icon } = req.body;
    const checkResult = await pool.query(
      'SELECT id FROM folders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (name) { updates.push(`name = $${paramCount++}`); values.push(name); }
    if (color) { updates.push(`color = $${paramCount++}`); values.push(color); }
    if (icon !== undefined) { updates.push(`icon = $${paramCount++}`); values.push(icon); }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id, userId);
    const query = `UPDATE folders SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: 'Error updating folder' });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    // Primero obtener todos los documentos de esta carpeta para eliminarlos del servidor
    const documentsResult = await pool.query(
      'SELECT file_path FROM documents WHERE folder_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    // Eliminar archivos físicos del servidor
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    for (const doc of documentsResult.rows) {
      try {
        const filePath = path.join(__dirname, '../', doc.file_path).replace(/\\/g, '/');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continuar aunque falle la eliminación de un archivo
      }
    }
    
    // Eliminar documentos de la base de datos
    await pool.query(
      'DELETE FROM documents WHERE folder_id = $1 AND user_id = $2',
      [id, userId]
    );
    
    // Eliminar la carpeta
    const result = await pool.query(
      'DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: 'Error deleting folder' });
  }
};

