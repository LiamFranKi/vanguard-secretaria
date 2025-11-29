import pool from '../config/database.js';
import { createNotification } from '../utils/notificationHelper.js';

export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, priority } = req.query;

    // Primero obtener las tareas
    let query = `
      SELECT DISTINCT t.*
      FROM tasks t
      WHERE t.user_id = $1 OR EXISTS (
        SELECT 1 FROM task_assignments ta2 
        WHERE ta2.task_id = t.id AND ta2.assigned_to_user_id = $1
      )
    `;
    const params = [userId];

    if (status) {
      query += ' AND t.status = $2';
      params.push(status);
      if (priority) {
        query += ' AND t.priority = $3';
        params.push(priority);
      }
    } else if (priority) {
      query += ' AND t.priority = $2';
      params.push(priority);
    }

    query += ' ORDER BY t.date DESC';

    const tasksResult = await pool.query(query, params);
    
    // Para cada tarea, obtener los usuarios asignados
    const tasksWithAssignments = await Promise.all(
      tasksResult.rows.map(async (task) => {
        const assignmentsResult = await pool.query(
          `SELECT u.id, u.name, u.email, u.avatar
           FROM task_assignments ta
           INNER JOIN users u ON ta.assigned_to_user_id = u.id
           WHERE ta.task_id = $1`,
          [task.id]
        );
        return {
          ...task,
          assigned_users: assignmentsResult.rows
        };
      })
    );

    res.json(tasksWithAssignments);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const getTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND (user_id = $2 OR EXISTS (SELECT 1 FROM task_assignments ta WHERE ta.task_id = $1 AND ta.assigned_to_user_id = $2))',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];

    // Obtener usuarios asignados
    const assignmentsResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar
       FROM task_assignments ta
       INNER JOIN users u ON ta.assigned_to_user_id = u.id
       WHERE ta.task_id = $1`,
      [id]
    );

    res.json({
      ...task,
      assigned_users: assignmentsResult.rows
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Error fetching task' });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, date, priority, status, assigned_users } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, date, priority, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description || null, date, priority || 'Media', status || 'Pendiente', userId]
    );

    const newTask = result.rows[0];

    // Asignar usuarios si se proporcionaron
    if (assigned_users && Array.isArray(assigned_users) && assigned_users.length > 0) {
      for (const assignedUserId of assigned_users) {
        await pool.query(
          'INSERT INTO task_assignments (task_id, assigned_to_user_id, assigned_by_user_id) VALUES ($1, $2, $3)',
          [newTask.id, assignedUserId, userId]
        );

        // Notificar al usuario asignado
        const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignedUserId]);
        const assignedByUser = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        if (assignedUser.rows.length > 0) {
          await createNotification(
            assignedUserId,
            'Tarea Asignada',
            `Se te ha asignado la tarea "${title}"`,
            'tarea',
            'task',
            newTask.id,
            {
              templateName: 'taskAssigned',
              templateData: [
                assignedUser.rows[0].name,
                title,
                description || '',
                date,
                priority || 'Media',
                assignedByUser.rows[0]?.name || 'Sistema'
              ]
            }
          );
        }
      }
    }

    // Crear notificación de nueva tarea para el creador
    await createNotification(
      userId,
      'Nueva Tarea Creada',
      `Se ha creado la tarea "${title}" con prioridad ${priority || 'Media'}`,
      'tarea',
      'task',
      newTask.id
    );

    // Obtener usuarios asignados para la tarea
    const assignmentsResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar
       FROM task_assignments ta
       INNER JOIN users u ON ta.assigned_to_user_id = u.id
       WHERE ta.task_id = $1`,
      [newTask.id]
    );

    res.status(201).json({
      ...newTask,
      assigned_users: assignmentsResult.rows
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, date, priority, status, assigned_users } = req.body;

    console.log('Update task - received data:', { id, title, description, date, priority, status, assigned_users });

    // Check if task exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND (user_id = $2 OR EXISTS (SELECT 1 FROM task_assignments ta WHERE ta.task_id = $1 AND ta.assigned_to_user_id = $2))',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldTask = checkResult.rows[0];

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (date) {
      updates.push(`date = $${paramCount++}`);
      values.push(date);
    }
    if (priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    // Si hay campos para actualizar, actualizar la tarea
    let updatedTask;
    if (updates.length > 0) {
      values.push(id, userId);
      const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);
      updatedTask = result.rows[0];
    } else {
      // Si no hay campos para actualizar, obtener la tarea actual
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      updatedTask = result.rows[0];
    }

    // Crear notificaciones según los cambios
    const user = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const userName = user.rows[0]?.name || 'Usuario';
    
    if (status && oldTask.status !== status) {
      if (status === 'Completada' || status === 'Completado') {
        await createNotification(
          userId,
          'Tarea Completada',
          `La tarea "${updatedTask.title}" ha sido completada`,
          'tarea',
          'task',
          updatedTask.id,
          {
            templateName: 'taskStatusChanged',
            templateData: [
              userName,
              updatedTask.title,
              oldTask.status,
              'Completado'
            ]
          }
        );
      } else if (status === 'En Progreso') {
        await createNotification(
          userId,
          'Tarea en Progreso',
          `La tarea "${updatedTask.title}" está ahora en progreso`,
          'tarea',
          'task',
          updatedTask.id,
          {
            templateName: 'taskStatusChanged',
            templateData: [
              userName,
              updatedTask.title,
              oldTask.status,
              'En Progreso'
            ]
          }
        );
      }
    }

    if (priority && oldTask.priority !== priority) {
      await createNotification(
        userId,
        'Prioridad Cambiada',
        `La prioridad de la tarea "${updatedTask.title}" cambió de ${oldTask.priority} a ${priority}`,
        'tarea',
        'task',
        updatedTask.id,
        {
          templateName: 'taskPriorityChanged',
          templateData: [
            userName,
            updatedTask.title,
            oldTask.priority,
            priority
          ]
        }
      );
    }

    // Manejar asignaciones de usuarios (siempre procesar, incluso si no hay otros campos para actualizar)
    if (assigned_users !== undefined) {
      console.log('Processing assigned_users:', assigned_users);
      
      // Obtener asignaciones actuales antes de eliminarlas para comparar
      const currentAssignments = await pool.query(
        'SELECT assigned_to_user_id FROM task_assignments WHERE task_id = $1',
        [id]
      );
      const currentUserIds = currentAssignments.rows.map(r => r.assigned_to_user_id);
      console.log('Current assigned users:', currentUserIds);
      
      // Eliminar asignaciones existentes
      await pool.query('DELETE FROM task_assignments WHERE task_id = $1', [id]);
      
      // Agregar nuevas asignaciones
      if (Array.isArray(assigned_users) && assigned_users.length > 0) {
        for (const assignedUserId of assigned_users) {
          console.log('Assigning user:', assignedUserId);
          await pool.query(
            'INSERT INTO task_assignments (task_id, assigned_to_user_id, assigned_by_user_id) VALUES ($1, $2, $3)',
            [id, assignedUserId, userId]
          );

          // Notificar al usuario asignado solo si es una nueva asignación
          if (!currentUserIds.includes(parseInt(assignedUserId))) {
            const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignedUserId]);
            if (assignedUser.rows.length > 0) {
              await createNotification(
                assignedUserId,
                'Tarea Asignada',
                `Se te ha asignado la tarea "${updatedTask.title}"`,
                'tarea',
                'task',
                updatedTask.id
              );
            }
          }
        }
      } else {
        console.log('No users to assign (empty array)');
      }
    } else {
      console.log('assigned_users is undefined, skipping assignment update');
    }

    // Obtener usuarios asignados para la tarea
    const assignmentsResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.avatar
       FROM task_assignments ta
       INNER JOIN users u ON ta.assigned_to_user_id = u.id
       WHERE ta.task_id = $1`,
      [id]
    );

    res.json({
      ...updatedTask,
      assigned_users: assignmentsResult.rows
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};

