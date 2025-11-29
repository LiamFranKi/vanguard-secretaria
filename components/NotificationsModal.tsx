import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, Clock } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';

interface Notification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  relacionado_tipo?: string;
  relacionado_id?: number;
  leida: boolean;
  created_at: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications();
      setNotifications(data);
      const unread = data.filter(n => !n.leida).length;
      setUnreadCount(unread);
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Error al cargar las notificaciones',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, leida: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Error al marcar la notificación como leída',
        type: 'error'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, leida: true })));
      setUnreadCount(0);
      setAlertModal({
        isOpen: true,
        title: 'Éxito',
        message: 'Todas las notificaciones han sido marcadas como leídas',
        type: 'success'
      });
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Error al marcar todas las notificaciones como leídas',
        type: 'error'
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      const deleted = notifications.find(n => n.id === id);
      if (deleted && !deleted.leida) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
      setAlertModal({
        isOpen: true,
        title: 'Éxito',
        message: 'Notificación eliminada',
        type: 'success'
      });
    } catch (error: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Error al eliminar la notificación',
        type: 'error'
      });
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'tarea':
      case 'task':
        return '📋';
      case 'evento':
      case 'event':
        return '📅';
      case 'contacto':
      case 'contact':
        return '👤';
      case 'documento':
      case 'document':
        return '📄';
      case 'sistema':
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'tarea':
      case 'task':
        return 'bg-blue-100 text-blue-700';
      case 'evento':
      case 'event':
        return 'bg-purple-100 text-purple-700';
      case 'contacto':
      case 'contact':
        return 'bg-green-100 text-green-700';
      case 'documento':
      case 'document':
        return 'bg-amber-100 text-amber-700';
      case 'sistema':
      case 'system':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-violet-100 text-violet-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 text-white rounded-t-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-white/80">{unreadCount} sin leer</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">No hay notificaciones</h3>
                <p className="text-slate-500">Todas tus notificaciones aparecerán aquí</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    notification.leida
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-violet-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${getNotificationColor(notification.tipo)}`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-semibold ${notification.leida ? 'text-slate-600' : 'text-slate-900'}`}>
                          {notification.titulo}
                        </h4>
                        {!notification.leida && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${notification.leida ? 'text-slate-500' : 'text-slate-700'}`}>
                        {notification.mensaje}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(notification.created_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.leida && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition text-xs font-medium flex items-center gap-1"
                              title="Marcar como leída"
                            >
                              <Check className="w-3 h-3" />
                              Leída
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition text-xs font-medium flex items-center gap-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </>
  );
};

