import pool from '../config/database.js';
import { sendNotificationEmail } from '../services/emailService.js';
import { sendPushNotification } from '../controllers/pushController.js';

/**
 * Crea una notificación para un usuario y envía email si corresponde
 * @param {number} userId - ID del usuario que recibirá la notificación
 * @param {string} titulo - Título de la notificación
 * @param {string} mensaje - Mensaje de la notificación
 * @param {string} tipo - Tipo de notificación (tarea, evento, documento, sistema, etc.)
 * @param {string} relacionado_tipo - Tipo de entidad relacionada (task, event, document, etc.)
 * @param {number} relacionado_id - ID de la entidad relacionada
 * @param {object} emailData - Datos adicionales para el email (opcional)
 */
export const createNotification = async (userId, titulo, mensaje, tipo, relacionado_tipo = null, relacionado_id = null, emailData = null) => {
  try {
    const result = await pool.query(
      `INSERT INTO notificaciones (user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE, FALSE, FALSE)
       RETURNING *`,
      [userId, titulo, mensaje, tipo, relacionado_tipo, relacionado_id]
    );
    
    const notification = result.rows[0];
    
    // Intentar enviar email si hay datos disponibles
    if (emailData) {
      try {
        const emailResult = await sendNotificationEmail(userId, emailData.templateName, emailData.templateData);
        if (emailResult.success) {
          // Marcar como email enviado
          await pool.query(
            'UPDATE notificaciones SET enviada_email = TRUE WHERE id = $1',
            [notification.id]
          );
        }
      } catch (emailError) {
        console.error('Error enviando email de notificación:', emailError);
        // No fallar la creación de la notificación si el email falla
      }
    }

    // Intentar enviar push notification
    try {
      await sendPushNotification(
        userId,
        titulo,
        mensaje,
        {
          relacionado_tipo: relacionado_tipo,
          relacionado_id: relacionado_id,
          tipo: tipo,
          url: relacionado_tipo && relacionado_id 
            ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=${relacionado_tipo === 'task' ? 'tasks' : relacionado_tipo === 'event' ? 'events' : relacionado_tipo === 'document' ? 'documents' : 'dashboard'}`
            : undefined
        }
      );
      // Marcar como push enviado
      await pool.query(
        'UPDATE notificaciones SET enviada_push = TRUE WHERE id = $1',
        [notification.id]
      );
    } catch (pushError) {
      console.error('Error enviando push notification:', pushError);
      // No fallar la creación de la notificación si el push falla
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // No lanzar error para no interrumpir el flujo principal
    return null;
  }
};

