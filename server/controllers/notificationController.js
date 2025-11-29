import pool from '../config/database.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT * FROM notificaciones WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    await pool.query(
      'UPDATE notificaciones SET leida = TRUE WHERE user_id = $1 AND leida = FALSE',
      [userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Error marking all notifications as read' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM notificaciones WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
};

