import nodemailer from 'nodemailer';
import pool from '../config/database.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verificar conexión SMTP
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

// Función para obtener la configuración del sistema desde la BD
const getSystemConfig = async () => {
  try {
    const result = await pool.query('SELECT * FROM system_config WHERE id = 1');
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (error) {
    console.error('Error obteniendo configuración del sistema:', error);
  }
  // Configuración por defecto si no se encuentra
  return {
    nombre_sistema: 'SecretariaPro',
    titulo: 'Sistema de Gestión Administrativa',
    descripcion_sistema: 'Plataforma integral de gestión',
    color_primario: '#7c3aed',
    color_secundario: '#a855f7',
    footer_text: null
  };
};

// Función base para obtener el HTML del email con el layout común
const getEmailLayout = async (title, content, buttonText = null, buttonLink = null, icon = '📧') => {
  const config = await getSystemConfig();
  const systemName = config.nombre_sistema || 'SecretariaPro';
  const primaryColor = config.color_primario || '#7c3aed';
  const secondaryColor = config.color_secundario || '#a855f7';
  const footerText = config.footer_text || `© ${new Date().getFullYear()} ${systemName}. Todos los derechos reservados.`;
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; line-height: 1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f1f5f9; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 40px 30px; text-align: center;">
              <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin-bottom: 16px; line-height: 64px; font-size: 32px;">
                ${icon}
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${systemName}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          ${buttonText && buttonLink ? `
          <!-- Button -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <a href="${buttonLink}" style="display: inline-block; background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">${buttonText}</a>
            </td>
          </tr>
          ` : ''}
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">Este es un correo automático, por favor no responda.</p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">${footerText}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Plantillas de email
export const emailTemplates = {
  // Tarea asignada
  taskAssigned: async (userName, taskTitle, taskDescription, taskDate, taskPriority, assignedBy) => {
    const priorityColors = {
      'Alta': '#ef4444',
      'Media': '#f59e0b',
      'Baja': '#10b981'
    };
    const priorityColor = priorityColors[taskPriority] || '#64748b';
    
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Nueva Tarea Asignada</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Se te ha asignado una nueva tarea:</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid ${priorityColor}; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${taskTitle}</h3>
        ${taskDescription ? `<p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6;">${taskDescription}</p>` : ''}
        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b; font-size: 14px;">📅</span>
            <span style="color: #475569; font-size: 14px; font-weight: 500;">${new Date(taskDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 12px; height: 12px; background-color: ${priorityColor}; border-radius: 50%;"></span>
            <span style="color: #475569; font-size: 14px; font-weight: 500;">Prioridad: ${taskPriority}</span>
          </div>
        </div>
        ${assignedBy ? `<p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 12px;">Asignada por: ${assignedBy}</p>` : ''}
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">Por favor, revisa la tarea en el sistema para más detalles.</p>
    `;
    
    return await getEmailLayout(
      'Nueva Tarea Asignada',
      content,
      'Ver Tarea',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=tasks`,
      '✅'
    );
  },

  // Evento asignado
  eventAssigned: async (userName, eventTitle, eventDate, eventTime, eventType, assignedBy) => {
    const typeLabels = {
      'meeting': 'Reunión',
      'reminder': 'Recordatorio',
      'personal': 'Personal'
    };
    const typeColors = {
      'meeting': '#3b82f6',
      'reminder': '#8b5cf6',
      'personal': '#ec4899'
    };
    const typeColor = typeColors[eventType] || '#64748b';
    const typeLabel = typeLabels[eventType] || eventType;
    
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Nuevo Evento Asignado</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Se te ha asignado un nuevo evento:</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid ${typeColor}; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${eventTitle}</h3>
        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b; font-size: 14px;">📅</span>
            <span style="color: #475569; font-size: 14px; font-weight: 500;">${new Date(eventDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b; font-size: 14px;">🕐</span>
            <span style="color: #475569; font-size: 14px; font-weight: 500;">${eventTime}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 12px; height: 12px; background-color: ${typeColor}; border-radius: 50%;"></span>
            <span style="color: #475569; font-size: 14px; font-weight: 500;">${typeLabel}</span>
          </div>
        </div>
        ${assignedBy ? `<p style="margin: 16px 0 0 0; color: #94a3b8; font-size: 12px;">Asignado por: ${assignedBy}</p>` : ''}
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">No olvides agregar este evento a tu calendario.</p>
    `;
    
    return await getEmailLayout(
      'Nuevo Evento Asignado',
      content,
      'Ver Evento',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=events`,
      '📅'
    );
  },

  // Recordatorio de evento (1 hora antes)
  eventReminder1h: async (userName, eventTitle, eventTime) => {
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">⏰ Recordatorio de Evento</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Este es un recordatorio de que tienes un evento próximo:</p>
      
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${eventTitle}</h3>
        <p style="margin: 0; color: #92400e; font-size: 16px; font-weight: 600;">🕐 Comienza en menos de 1 hora a las ${eventTime}</p>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">¡Prepárate para tu evento!</p>
    `;
    
    return await getEmailLayout(
      'Recordatorio de Evento',
      content,
      'Ver Calendario',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=calendar`,
      '⏰'
    );
  },

  // Recordatorio de evento (1 día antes)
  eventReminder1d: async (userName, eventTitle, eventDate) => {
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">📅 Recordatorio de Evento</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Este es un recordatorio de que tienes un evento mañana:</p>
      
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #3b82f6;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${eventTitle}</h3>
        <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 600;">📅 ${new Date(eventDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">No olvides prepararte para este evento.</p>
    `;
    
    return await getEmailLayout(
      'Recordatorio de Evento',
      content,
      'Ver Calendario',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=calendar`,
      '📅'
    );
  },

  // Recordatorio de evento (hoy)
  eventReminderToday: async (userName, eventTitle, eventTime) => {
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">🎯 Evento de Hoy</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Tienes un evento programado para hoy:</p>
      
      <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #ec4899;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${eventTitle}</h3>
        <p style="margin: 0; color: #9f1239; font-size: 16px; font-weight: 600;">🕐 Hoy a las ${eventTime}</p>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">¡Que tengas un excelente día!</p>
    `;
    
    return await getEmailLayout(
      'Evento de Hoy',
      content,
      'Ver Calendario',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=calendar`,
      '🎯'
    );
  },

  // Cambio de estado de tarea
  taskStatusChanged: async (userName, taskTitle, oldStatus, newStatus) => {
    const statusLabels = {
      'Pendiente': 'Pendiente',
      'En Progreso': 'En Progreso',
      'Completado': 'Completado'
    };
    
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Estado de Tarea Actualizado</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">El estado de una tarea ha sido actualizado:</p>
      
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${taskTitle}</h3>
        <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px;">
          <span style="color: #64748b; font-size: 14px;">Estado anterior:</span>
          <span style="display: inline-block; padding: 4px 12px; background-color: #e2e8f0; color: #475569; border-radius: 6px; font-size: 14px; font-weight: 500;">${statusLabels[oldStatus] || oldStatus}</span>
          <span style="color: #64748b; font-size: 20px;">→</span>
          <span style="display: inline-block; padding: 4px 12px; background-color: #10b981; color: #ffffff; border-radius: 6px; font-size: 14px; font-weight: 500;">${statusLabels[newStatus] || newStatus}</span>
        </div>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">Puedes ver los detalles de la tarea en el sistema.</p>
    `;
    
    return await getEmailLayout(
      'Estado de Tarea Actualizado',
      content,
      'Ver Tarea',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=tasks`,
      '🔄'
    );
  },

  // Cambio de prioridad de tarea
  taskPriorityChanged: async (userName, taskTitle, oldPriority, newPriority) => {
    const priorityColors = {
      'Alta': '#ef4444',
      'Media': '#f59e0b',
      'Baja': '#10b981'
    };
    const newPriorityColor = priorityColors[newPriority] || '#64748b';
    
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Prioridad de Tarea Actualizada</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">La prioridad de una tarea ha sido actualizada:</p>
      
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${taskTitle}</h3>
        <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px;">
          <span style="color: #64748b; font-size: 14px;">Prioridad anterior:</span>
          <span style="display: inline-block; padding: 4px 12px; background-color: #e2e8f0; color: #475569; border-radius: 6px; font-size: 14px; font-weight: 500;">${oldPriority}</span>
          <span style="color: #64748b; font-size: 20px;">→</span>
          <span style="display: inline-block; padding: 4px 12px; background-color: ${newPriorityColor}; color: #ffffff; border-radius: 6px; font-size: 14px; font-weight: 500;">${newPriority}</span>
        </div>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">Puedes ver los detalles de la tarea en el sistema.</p>
    `;
    
    return await getEmailLayout(
      'Prioridad de Tarea Actualizada',
      content,
      'Ver Tarea',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=tasks`,
      '⚡'
    );
  },

  // Documento subido
  documentUploaded: async (userName, documentName, documentType, folderName) => {
    const content = `
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 700;">Nuevo Documento Subido</h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px;">Hola <strong style="color: #1e293b;">${userName}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px;">Se ha subido un nuevo documento al sistema:</p>
      
      <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #10b981;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 32px;">📄</span>
          <div>
            <h3 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 600;">${documentName}</h3>
            <p style="margin: 4px 0 0 0; color: #047857; font-size: 14px; font-weight: 500;">Tipo: ${documentType}</p>
            ${folderName ? `<p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Carpeta: ${folderName}</p>` : ''}
          </div>
        </div>
      </div>
      
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">Puedes acceder al documento desde el módulo de Documentos.</p>
    `;
    
    return await getEmailLayout(
      'Nuevo Documento Subido',
      content,
      'Ver Documentos',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/app?view=documents`,
      '📄'
    );
  }
};

// Función principal para enviar emails
export const sendEmail = async (to, subject, html) => {
  try {
    // Verificar que SMTP esté configurado
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️  SMTP no configurado. Email no enviado.');
      return { success: false, error: 'SMTP no configurado' };
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `SecretariaPro <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return { success: false, error: error.message };
  }
};

// Función para obtener el email del usuario desde la BD
export const getUserEmail = async (userId) => {
  try {
    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      return result.rows[0].email;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo email del usuario:', error);
    return null;
  }
};

// Función para enviar email de notificación
export const sendNotificationEmail = async (userId, templateName, templateData) => {
  try {
    const userEmail = await getUserEmail(userId);
    if (!userEmail) {
      console.warn(`⚠️  No se encontró email para el usuario ${userId}`);
      return { success: false, error: 'Email no encontrado' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      console.warn(`⚠️  Plantilla ${templateName} no encontrada`);
      return { success: false, error: 'Plantilla no encontrada' };
    }

    // Las plantillas ahora son async, necesitamos await
    const html = await template(...templateData);
    const subject = await getEmailSubject(templateName);
    
    return await sendEmail(userEmail, subject, html);
  } catch (error) {
    console.error('Error enviando email de notificación:', error);
    return { success: false, error: error.message };
  }
};

// Función para obtener el asunto del email según el tipo
const getEmailSubject = async (templateName) => {
  const config = await getSystemConfig();
  const systemName = config.nombre_sistema || 'SecretariaPro';
  
  const subjects = {
    'taskAssigned': `Nueva Tarea Asignada - ${systemName}`,
    'eventAssigned': `Nuevo Evento Asignado - ${systemName}`,
    'eventReminder1h': `⏰ Recordatorio: Evento en 1 hora - ${systemName}`,
    'eventReminder1d': `📅 Recordatorio: Evento mañana - ${systemName}`,
    'eventReminderToday': `🎯 Evento de Hoy - ${systemName}`,
    'taskStatusChanged': `Estado de Tarea Actualizado - ${systemName}`,
    'taskPriorityChanged': `Prioridad de Tarea Actualizada - ${systemName}`,
    'documentUploaded': `Nuevo Documento Subido - ${systemName}`
  };
  return subjects[templateName] || `Notificación - ${systemName}`;
};
