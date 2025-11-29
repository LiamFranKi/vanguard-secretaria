import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, Users, Bell, User, X } from 'lucide-react';
import { apiService } from '../services/apiService';
import { CalendarEvent } from '../types';
import { EventModal } from './EventModal';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';
import { UserAvatars } from './UserAvatars';

export const EventsView: React.FC<{ onEventsChange?: () => void }> = ({ onEventsChange }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meeting' | 'reminder' | 'personal'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId: string | null; eventTitle: string }>({
    isOpen: false,
    eventId: null,
    eventTitle: ''
  });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al cargar eventos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event?: CalendarEvent) => {
    if (event) {
      setEditingEvent(event);
    } else {
      setEditingEvent(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSave = async () => {
    await loadEvents();
    if (onEventsChange) onEventsChange();
    handleCloseModal();
  };

  const handleDeleteClick = (event: CalendarEvent) => {
    setDeleteConfirm({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.eventId) return;

    try {
      await apiService.deleteEvent(deleteConfirm.eventId);
      setDeleteConfirm({ isOpen: false, eventId: null, eventTitle: '' });
      await loadEvents();
      if (onEventsChange) onEventsChange();
      setAlertModal({
        isOpen: true,
        title: 'Evento Eliminado',
        message: 'El evento ha sido eliminado exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setDeleteConfirm({ isOpen: false, eventId: null, eventTitle: '' });
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al eliminar el evento',
        type: 'error'
      });
    }
  };

  const now = new Date();
  
  // Separar eventos pasados y próximos
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= now;
  });
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate < now;
  });

  const filteredUpcomingEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredPastEvents = pastEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Users;
      case 'reminder':
        return Bell;
      case 'personal':
        return User;
      default:
        return Calendar;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'Reunión';
      case 'reminder':
        return 'Recordatorio';
      case 'personal':
        return 'Personal';
      default:
        return type;
    }
  };

  const totalEvents = events.length;
  const upcomingCount = upcomingEvents.length;
  const pastCount = pastEvents.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            Mis Eventos
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus eventos y recordatorios</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Evento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border-2 border-violet-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{totalEvents}</div>
              <div className="text-sm text-slate-600 font-medium">Total de Eventos</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{upcomingCount}</div>
              <div className="text-sm text-slate-600 font-medium">Próximos</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{pastCount}</div>
              <div className="text-sm text-slate-600 font-medium">Pasados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'meeting' | 'reminder' | 'personal')}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="meeting">Reunión</option>
            <option value="reminder">Recordatorio</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-600" />
          Próximos Eventos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredUpcomingEvents.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
              <Calendar className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No hay eventos próximos</h3>
              <p className="text-slate-500">
                {searchTerm || filterType !== 'all'
                  ? 'No se encontraron eventos próximos con los filtros aplicados'
                  : 'Crea tu primer evento para comenzar'}
              </p>
            </div>
          ) : (
            filteredUpcomingEvents.map((event) => {
              const Icon = getTypeIcon(event.type);
              const startDate = new Date(event.start);
              const endDate = new Date(event.end);
              const dateStr = startDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const timeStr = `${startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all overflow-hidden group"
                  style={{ borderColor: event.color }}
                >
                  {/* Header con color según tipo */}
                  <div 
                    className="h-2"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: event.color + '20' }}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: event.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-lg font-semibold inline-block ${
                          event.type === 'meeting'
                            ? 'bg-blue-100 text-blue-700'
                            : event.type === 'reminder'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {getTypeLabel(event.type)}
                        </span>
                      </div>
                    </div>

                    {/* Fecha, hora y usuarios asignados */}
                    <div className="flex items-center justify-between gap-2 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{dateStr}</div>
                          <div className="text-xs text-slate-500">{timeStr}</div>
                        </div>
                      </div>
                      {event.assigned_users && event.assigned_users.length > 0 && (
                        <UserAvatars users={event.assigned_users} maxVisible={3} />
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(event)}
                        className="flex-1 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Eventos Pasados */}
      {filteredPastEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            Eventos Pasados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPastEvents.map((event) => {
              const Icon = getTypeIcon(event.type);
              const startDate = new Date(event.start);
              const endDate = new Date(event.end);
              const dateStr = startDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const timeStr = `${startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

              return (
                <div
                  key={event.id}
                  className="bg-slate-50 rounded-2xl shadow-sm border-2 border-slate-200 hover:shadow-lg transition-all overflow-hidden group opacity-75"
                  style={{ borderColor: event.color + '80' }}
                >
                  {/* Header con color según tipo */}
                  <div 
                    className="h-2"
                    style={{ backgroundColor: event.color + '80' }}
                  ></div>
                  
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: event.color + '15' }}
                      >
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: event.color + '80' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-600 mb-1 line-clamp-2">
                          {event.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-lg font-semibold inline-block ${
                          event.type === 'meeting'
                            ? 'bg-blue-100 text-blue-600'
                            : event.type === 'reminder'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {getTypeLabel(event.type)}
                        </span>
                      </div>
                    </div>

                    {/* Fecha, hora y usuarios asignados */}
                    <div className="flex items-center justify-between gap-2 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{dateStr}</div>
                          <div className="text-xs text-slate-400">{timeStr}</div>
                        </div>
                      </div>
                      {event.assigned_users && event.assigned_users.length > 0 && (
                        <UserAvatars users={event.assigned_users} maxVisible={3} />
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(event)}
                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-medium text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          event={editingEvent || undefined}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, eventId: null, eventTitle: '' })}
        onConfirm={handleDelete}
        title="Eliminar Evento"
        message={`¿Estás seguro de que deseas eliminar el evento "${deleteConfirm.eventTitle}"?`}
        type="danger"
        confirmText="Eliminar"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        duration={3000}
      />
    </div>
  );
};

