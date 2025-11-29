import pool from '../config/database.js';
import { createNotification } from '../utils/notificationHelper.js';

export const getEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { start, end } = req.query;
    let query = `
      SELECT DISTINCT e.id, e.title, e.start_time as start, e.end_time as end, e.color, e.type, e.user_id, e.created_at, e.updated_at
      FROM events e
      WHERE e.user_id = $1 OR EXISTS (
        SELECT 1 FROM event_assignments ea2 
        WHERE ea2.event_id = e.id AND ea2.assigned_to_user_id = $1
      )
    `;
    const params = [userId];
    if (start && end) {
      query += ' AND e.start_time >= $2 AND e.end_time <= $3';
      params.push(start, end);
    }
    query += ' ORDER BY e.start_time ASC';
    
    const eventsResult = await pool.query(query, params);
    
    // Para cada evento, obtener los usuarios asignados
    const eventsWithAssignments = await Promise.all(
      eventsResult.rows.map(async (event) => {
        const assignmentsResult = await pool.query(
          `SELECT u.id, u.name, u.email, u.avatar
           FROM event_assignments ea
           INNER JOIN users u ON ea.assigned_to_user_id = u.id
           WHERE ea.event_id = $1`,
          [event.id]
        );
        return {
          ...event,
          assigned_users: assignmentsResult.rows
        };
      })
    );

    res.json(eventsWithAssignments);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const getEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, start_time as start, end_time as end, color, type, user_id, created_at, updated_at FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, start, end, color, type, assigned_users } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ error: 'Title, start and end are required' });
    }
    const result = await pool.query(
      'INSERT INTO events (title, start_time, end_time, color, type, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, start_time as start, end_time as end, color, type, user_id, created_at, updated_at',
      [title, start, end, color || 'bg-indigo-500', type || 'reminder', userId]
    );
    const newEvent = result.rows[0];

    // Asignar usuarios si se proporcionaron
    if (assigned_users && Array.isArray(assigned_users) && assigned_users.length > 0) {
      for (const assignedUserId of assigned_users) {
        await pool.query(
          'INSERT INTO event_assignments (event_id, assigned_to_user_id, assigned_by_user_id) VALUES ($1, $2, $3)',
          [newEvent.id, assignedUserId, userId]
        );

        // Notificar al usuario asignado
        const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignedUserId]);
        const assignedByUser = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        if (assignedUser.rows.length > 0) {
          const eventDate = new Date(start);
          const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          
          await createNotification(
            assignedUserId,
            'Evento Asignado',
            `Se te ha asignado el evento "${title}" para el ${eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} a las ${timeStr}`,
            'evento',
            'event',
            newEvent.id,
            {
              templateName: 'eventAssigned',
              templateData: [
                assignedUser.rows[0].name,
                title,
                start, // Pasar la fecha ISO para que la plantilla la formatee correctamente
                timeStr,
                type || 'reminder',
                assignedByUser.rows[0]?.name || 'Sistema'
              ]
            }
          );
        }
      }
    }

    // Crear notificación de nuevo evento para el creador
    const eventDate = new Date(start);
    const dateStr = eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    await createNotification(
      userId,
      'Nuevo Evento Creado',
      `Se ha creado el evento "${title}" para el ${dateStr} a las ${timeStr}`,
      'evento',
      'event',
      newEvent.id
    );

    // Obtener usuarios asignados para el evento
    const assignmentsResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar
       FROM event_assignments ea
       INNER JOIN users u ON ea.assigned_to_user_id = u.id
       WHERE ea.event_id = $1`,
      [newEvent.id]
    );

    res.status(201).json({
      ...newEvent,
      assigned_users: assignmentsResult.rows
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, start, end, color, type, assigned_users } = req.body;
    const checkResult = await pool.query(
      'SELECT id FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const updates = [];
    const values = [];
    let paramCount = 1;
    if (title) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (start) { updates.push(`start_time = $${paramCount++}`); values.push(start); }
    if (end) { updates.push(`end_time = $${paramCount++}`); values.push(end); }
    if (color) { updates.push(`color = $${paramCount++}`); values.push(color); }
    if (type) { updates.push(`type = $${paramCount++}`); values.push(type); }
    if (updates.length === 0 && assigned_users === undefined) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    if (updates.length > 0) {
      values.push(id, userId);
      const query = `UPDATE events SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING id, title, start_time as start, end_time as end, color, type, user_id, created_at, updated_at`;
      const result = await pool.query(query, values);
    }

    // Manejar asignaciones de usuarios
    if (assigned_users !== undefined) {
      // Eliminar asignaciones existentes
      await pool.query('DELETE FROM event_assignments WHERE event_id = $1', [id]);
      
      // Agregar nuevas asignaciones
      if (Array.isArray(assigned_users) && assigned_users.length > 0) {
        for (const assignedUserId of assigned_users) {
          await pool.query(
            'INSERT INTO event_assignments (event_id, assigned_to_user_id, assigned_by_user_id) VALUES ($1, $2, $3)',
            [id, assignedUserId, userId]
          );

          // Notificar al usuario asignado
          const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignedUserId]);
          const assignedByUser = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
          const eventData = await pool.query('SELECT title, start_time, type FROM events WHERE id = $1', [id]);
          if (assignedUser.rows.length > 0 && eventData.rows.length > 0) {
            const event = eventData.rows[0];
            const eventDate = new Date(event.start_time);
            const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            
            await createNotification(
                assignedUserId,
                'Evento Asignado',
                `Se te ha asignado el evento "${event.title}" para el ${eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} a las ${timeStr}`,
                'evento',
                'event',
                id,
                {
                  templateName: 'eventAssigned',
                  templateData: [
                    assignedUser.rows[0].name,
                    event.title,
                    event.start_time, // Pasar la fecha ISO para que la plantilla la formatee correctamente
                    timeStr,
                    event.type || 'reminder',
                    assignedByUser.rows[0]?.name || 'Sistema'
                  ]
                }
              );
            }
          }
        }
      }

    // Obtener usuarios asignados para el evento
    const assignmentsResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar
       FROM event_assignments ea
       INNER JOIN users u ON ea.assigned_to_user_id = u.id
       WHERE ea.event_id = $1`,
      [id]
    );

    // Obtener el evento actualizado
    const eventResult = await pool.query(
      'SELECT id, title, start_time as start, end_time as end, color, type, user_id, created_at, updated_at FROM events WHERE id = $1',
      [id]
    );

    res.json({
      ...eventResult.rows[0],
      assigned_users: assignmentsResult.rows
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};

