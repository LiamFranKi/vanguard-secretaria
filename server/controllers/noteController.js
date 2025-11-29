import pool from '../config/database.js';

// Obtener todas las notas del usuario
export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT id, title, content, color, created_at, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
};

// Obtener una nota por ID
export const getNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, content, color, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Error fetching note' });
  }
};

// Crear nota
export const createNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, color } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO notes (title, content, color, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, content, color, created_at, updated_at',
      [title || 'Sin título', content || '', color || '#7c3aed', userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Error creating note' });
  }
};

// Actualizar nota
export const updateNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, content, color } = req.body;

    // Verificar que la nota existe y pertenece al usuario
    const checkResult = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }
    if (color !== undefined) {
      updates.push(`color = $${paramCount++}`);
      values.push(color);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE notes 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, title, content, color, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Error updating note' });
  }
};

// Eliminar nota
export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Error deleting note' });
  }
};

