import React, { useState, useEffect } from 'react';
import { X, Save, CheckSquare, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Task, Priority, Status, User } from '../types';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';
import { UserSelector } from './UserSelector';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priority: Priority.Medium,
    status: Status.Pending
  });
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setCurrentUserId(user.id.toString());
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        const taskDate = new Date(task.date);
        setFormData({
          title: task.title,
          description: task.description || '',
          date: taskDate.toISOString().slice(0, 16),
          priority: task.priority,
          status: task.status
        });
        setSelectedUsers(task.assigned_users || []);
      } else {
        // Creating new task
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setFormData({
          title: '',
          description: '',
          date: tomorrow.toISOString().slice(0, 16),
          priority: Priority.Medium,
          status: Status.Pending
        });
        setSelectedUsers([]);
      }
      setError('');
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const assignedUserIds = selectedUsers.map(u => parseInt(u.id));
      console.log('TaskModal - Selected users:', selectedUsers);
      console.log('TaskModal - Assigned user IDs:', assignedUserIds);
      
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        date: new Date(formData.date).toISOString(),
        priority: formData.priority, // Esto ya es 'Baja', 'Media', 'Alta'
        status: formData.status, // Esto ya es 'Pendiente', 'En Progreso', 'Completada'
        assigned_users: assignedUserIds
      };

      console.log('TaskModal - Sending task data:', taskData);

      if (task) {
        // Update
        await apiService.updateTask(task.id, taskData);
        setAlertModal({
          isOpen: true,
          title: 'Tarea Actualizada',
          message: 'La tarea ha sido actualizada exitosamente.',
          type: 'success'
        });
      } else {
        // Create
        await apiService.createTask(taskData);
        setAlertModal({
          isOpen: true,
          title: 'Tarea Creada',
          message: 'La tarea ha sido creada exitosamente.',
          type: 'success'
        });
      }
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err: any) {
      console.error('Error saving task:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error al guardar la tarea';
      setError(errorMessage);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl my-8 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {task ? 'Editar Tarea' : 'Nueva Tarea'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Título de la Tarea
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Ej: Revisar documentos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                rows={3}
                placeholder="Descripción detallada de la tarea..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                >
                  <option value={Priority.Low}>Baja</option>
                  <option value={Priority.Medium}>Media</option>
                  <option value={Priority.High}>Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                >
                  <option value={Status.Pending}>Pendiente</option>
                  <option value={Status.InProgress}>En Progreso</option>
                  <option value={Status.Completed}>Completada</option>
                </select>
              </div>
            </div>

            {/* Selector de usuarios */}
            <div>
              <UserSelector
                selectedUsers={selectedUsers}
                onUsersChange={setSelectedUsers}
                currentUserId={currentUserId}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {task ? 'Actualizar' : 'Crear'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        duration={2000}
      />
    </>
  );
};

