import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Palette, Tag } from 'lucide-react';
import { CalendarEvent, User } from '../types';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';
import { UserSelector } from './UserSelector';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  selectedDate?: Date | null;
  onSave: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, selectedDate, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    color: '#7c3aed',
    type: 'reminder' as 'meeting' | 'reminder' | 'personal'
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
      if (event) {
        // Editing existing event
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        setFormData({
          title: event.title,
          start: startDate.toISOString().slice(0, 16),
          end: endDate.toISOString().slice(0, 16),
          color: event.color,
          type: event.type
        });
        setSelectedUsers(event.assigned_users || []);
      } else if (selectedDate) {
        // Creating new event
        const start = new Date(selectedDate);
        start.setHours(9, 0, 0, 0);
        const end = new Date(start);
        end.setHours(10, 0, 0, 0);
        setFormData({
          title: '',
          start: start.toISOString().slice(0, 16),
          end: end.toISOString().slice(0, 16),
          color: '#7c3aed',
          type: 'reminder'
        });
        setSelectedUsers([]);
      }
      setError('');
    }
  }, [isOpen, event, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validation
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (endDate <= startDate) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      setSaving(false);
      return;
    }

    try {
      if (event) {
        // Update
        await apiService.updateEvent(event.id, {
          title: formData.title,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          color: formData.color,
          type: formData.type,
          assigned_users: selectedUsers.map(u => parseInt(u.id))
        });
        setAlertModal({
          isOpen: true,
          title: 'Evento Actualizado',
          message: 'El evento ha sido actualizado exitosamente.',
          type: 'success'
        });
      } else {
        // Create
        await apiService.createEvent({
          title: formData.title,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          color: formData.color,
          type: formData.type,
          assigned_users: selectedUsers.map(u => parseInt(u.id))
        });
        setAlertModal({
          isOpen: true,
          title: 'Evento Creado',
          message: 'El evento ha sido creado exitosamente.',
          type: 'success'
        });
      }
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el evento');
    } finally {
      setSaving(false);
    }
  };

  const colorOptions = [
    { value: '#7c3aed', label: 'Violeta', bg: 'bg-violet-500' },
    { value: '#4f46e5', label: 'Índigo', bg: 'bg-indigo-500' },
    { value: '#ef4444', label: 'Rojo', bg: 'bg-red-500' },
    { value: '#f59e0b', label: 'Ámbar', bg: 'bg-amber-500' },
    { value: '#10b981', label: 'Verde', bg: 'bg-green-500' },
    { value: '#3b82f6', label: 'Azul', bg: 'bg-blue-500' },
    { value: '#ec4899', label: 'Rosa', bg: 'bg-pink-500' },
    { value: '#8b5cf6', label: 'Púrpura', bg: 'bg-purple-500' }
  ];

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
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {event ? 'Editar Evento' : 'Nuevo Evento'}
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
                <Tag className="w-4 h-4" />
                Título del Evento
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Ej: Reunión de equipo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Inicio
                </label>
                <input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Fin
                </label>
                <input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`h-12 rounded-xl border-2 transition ${
                      formData.color === color.value
                        ? 'border-slate-900 scale-110 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Evento
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'meeting' | 'reminder' | 'personal' })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              >
                <option value="meeting">Reunión</option>
                <option value="reminder">Recordatorio</option>
                <option value="personal">Personal</option>
              </select>
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
                    {event ? 'Actualizar' : 'Crear'}
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

