import pool from '../config/database.js';
import { createNotification } from '../utils/notificationHelper.js';

/**
 * Servicio para generar recordatorios de eventos
 * Se ejecuta periódicamente para verificar eventos próximos
 */
export const checkEventReminders = async () => {
  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora después
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 día después
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Inicio del día siguiente
    const today = new Date(now);
    today.setHours(0, 0, 0, 0); // Inicio del día actual

    // Recordatorios de 1 hora antes
    const oneHourEvents = await pool.query(
      `SELECT e.*, u.id as user_id 
       FROM events e
       INNER JOIN users u ON e.user_id = u.id
       WHERE e.start_time BETWEEN $1 AND $2
       AND e.start_time > $3
       AND NOT EXISTS (
         SELECT 1 FROM notificaciones n 
         WHERE n.relacionado_tipo = 'event' 
         AND n.relacionado_id = e.id 
         AND n.tipo = 'recordatorio_1h'
         AND n.user_id = e.user_id
       )`,
      [now, oneHourLater, now]
    );

    for (const event of oneHourEvents.rows) {
      const eventDate = new Date(event.start_time);
      const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const user = await pool.query('SELECT name FROM users WHERE id = $1', [event.user_id]);
      const userName = user.rows[0]?.name || 'Usuario';
      
      await createNotification(
        event.user_id,
        'Recordatorio: Evento en 1 hora',
        `El evento "${event.title}" comenzará a las ${timeStr}`,
        'recordatorio_1h',
        'event',
        event.id,
        {
          templateName: 'eventReminder1h',
          templateData: [userName, event.title, timeStr]
        }
      );

      // También notificar a usuarios asignados
      const assignments = await pool.query(
        'SELECT assigned_to_user_id FROM event_assignments WHERE event_id = $1',
        [event.id]
      );
      for (const assignment of assignments.rows) {
        const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignment.assigned_to_user_id]);
        const assignedUserName = assignedUser.rows[0]?.name || 'Usuario';
        await createNotification(
          assignment.assigned_to_user_id,
          'Recordatorio: Evento en 1 hora',
          `El evento "${event.title}" comenzará a las ${timeStr}`,
          'recordatorio_1h',
          'event',
          event.id,
          {
            templateName: 'eventReminder1h',
            templateData: [assignedUserName, event.title, timeStr]
          }
        );
      }
    }

    // Recordatorios de 1 día antes
    const oneDayEvents = await pool.query(
      `SELECT e.*, u.id as user_id 
       FROM events e
       INNER JOIN users u ON e.user_id = u.id
       WHERE DATE(e.start_time) = DATE($1)
       AND e.start_time > $2
       AND NOT EXISTS (
         SELECT 1 FROM notificaciones n 
         WHERE n.relacionado_tipo = 'event' 
         AND n.relacionado_id = e.id 
         AND n.tipo = 'recordatorio_1d'
         AND n.user_id = e.user_id
       )`,
      [tomorrow, now]
    );

    for (const event of oneDayEvents.rows) {
      const eventDate = new Date(event.start_time);
      const dateStr = eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      const user = await pool.query('SELECT name FROM users WHERE id = $1', [event.user_id]);
      const userName = user.rows[0]?.name || 'Usuario';
      
      await createNotification(
        event.user_id,
        'Recordatorio: Evento mañana',
        `El evento "${event.title}" será mañana (${dateStr})`,
        'recordatorio_1d',
        'event',
        event.id,
        {
          templateName: 'eventReminder1d',
          templateData: [userName, event.title, event.start_time] // Pasar fecha ISO
        }
      );

      // También notificar a usuarios asignados
      const assignments = await pool.query(
        'SELECT assigned_to_user_id FROM event_assignments WHERE event_id = $1',
        [event.id]
      );
      for (const assignment of assignments.rows) {
        const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignment.assigned_to_user_id]);
        const assignedUserName = assignedUser.rows[0]?.name || 'Usuario';
        await createNotification(
          assignment.assigned_to_user_id,
          'Recordatorio: Evento mañana',
          `El evento "${event.title}" será mañana (${dateStr})`,
          'recordatorio_1d',
          'event',
          event.id,
          {
            templateName: 'eventReminder1d',
            templateData: [assignedUserName, event.title, event.start_time] // Pasar fecha ISO
          }
        );
      }
    }

    // Recordatorios del mismo día (al iniciar el sistema)
    const todayEvents = await pool.query(
      `SELECT e.*, u.id as user_id 
       FROM events e
       INNER JOIN users u ON e.user_id = u.id
       WHERE DATE(e.start_time) = DATE($1)
       AND e.start_time >= $2
       AND NOT EXISTS (
         SELECT 1 FROM notificaciones n 
         WHERE n.relacionado_tipo = 'event' 
         AND n.relacionado_id = e.id 
         AND n.tipo = 'recordatorio_hoy'
         AND n.user_id = e.user_id
       )`,
      [today, now]
    );

    for (const event of todayEvents.rows) {
      const eventDate = new Date(event.start_time);
      const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const user = await pool.query('SELECT name FROM users WHERE id = $1', [event.user_id]);
      const userName = user.rows[0]?.name || 'Usuario';
      
      await createNotification(
        event.user_id,
        'Evento de hoy',
        `Tienes el evento "${event.title}" hoy a las ${timeStr}`,
        'recordatorio_hoy',
        'event',
        event.id,
        {
          templateName: 'eventReminderToday',
          templateData: [userName, event.title, timeStr]
        }
      );

      // También notificar a usuarios asignados
      const assignments = await pool.query(
        'SELECT assigned_to_user_id FROM event_assignments WHERE event_id = $1',
        [event.id]
      );
      for (const assignment of assignments.rows) {
        const assignedUser = await pool.query('SELECT name FROM users WHERE id = $1', [assignment.assigned_to_user_id]);
        const assignedUserName = assignedUser.rows[0]?.name || 'Usuario';
        await createNotification(
          assignment.assigned_to_user_id,
          'Evento de hoy',
          `Tienes el evento "${event.title}" hoy a las ${timeStr}`,
          'recordatorio_hoy',
          'event',
          event.id,
          {
            templateName: 'eventReminderToday',
            templateData: [assignedUserName, event.title, timeStr]
          }
        );
      }
    }

    console.log(`Recordatorios verificados: ${oneHourEvents.rows.length} (1h), ${oneDayEvents.rows.length} (1d), ${todayEvents.rows.length} (hoy)`);
  } catch (error) {
    console.error('Error checking event reminders:', error);
  }
};

