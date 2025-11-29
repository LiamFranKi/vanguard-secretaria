import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, CheckSquare } from 'lucide-react';
import { CalendarEvent, Task } from '../types';
import { apiService } from '../services/apiService';
import { EventModal } from './EventModal';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';
import { TaskDetailModal } from './TaskDetailModal';

interface CalendarViewProps {
  events: CalendarEvent[];
  tasks: Task[];
  onEventsChange: () => void;
  onTasksChange: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, tasks, onEventsChange, onTasksChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; eventId: string | null; eventTitle: string }>({
    isOpen: false,
    eventId: null,
    eventTitle: ''
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.start).toISOString().split('T')[0];
      return eventStart === dateStr;
    });
  };

  const getTasksForDate = (date: Date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = new Date(task.date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date | null, currentDate: Date) => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      isOpen: true,
      eventId: event.id,
      eventTitle: event.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.eventId) return;
    
    try {
      await apiService.deleteEvent(deleteConfirm.eventId);
      setDeleteConfirm({ isOpen: false, eventId: null, eventTitle: '' });
      onEventsChange();
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
        title: 'Error al Eliminar',
        message: err.response?.data?.error || 'Error al eliminar el evento',
        type: 'error'
      });
    }
  };

  const handleEventSave = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setSelectedDate(null);
    onEventsChange();
  };

  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const days = viewMode === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-violet-600" />
            Calendario
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus eventos y recordatorios</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-xl p-1 border border-slate-200 flex">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'month'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'week'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-slate-200">
            <button
              onClick={handlePrevious}
              className="p-2 hover:bg-slate-50 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-slate-50 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Evento
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Month/Week Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 capitalize">{monthName}</h3>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="p-4 text-center text-sm font-semibold text-slate-600 bg-slate-50 border-r border-slate-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            const dayTasks = day ? getTasksForDate(day) : [];
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const totalItems = dayEvents.length + dayTasks.length;

            return (
              <div
                key={index}
                onClick={() => day && handleDateClick(day)}
                className={`min-h-[120px] p-2 border-r border-b border-slate-200 last:border-r-0 cursor-pointer hover:bg-slate-50 transition ${
                  !isCurrentMonth ? 'bg-slate-50 opacity-50' : 'bg-white'
                } ${isCurrentDay ? 'bg-violet-50 border-violet-300' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      isCurrentDay
                        ? 'w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center'
                        : isCurrentMonth
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {day ? day.getDate() : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {/* Eventos */}
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition"
                      style={{ backgroundColor: event.color + '20', color: event.color }}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="font-medium truncate">{event.title}</div>
                    </div>
                  ))}
                  
                  {/* Tareas */}
                  {dayTasks.slice(0, 2 - dayEvents.length).map((task) => {
                    const taskColor = task.priority === 'Alta' 
                      ? '#ef4444' 
                      : task.priority === 'Media' 
                      ? '#f59e0b' 
                      : task.status === 'Completada'
                      ? '#10b981'
                      : '#6b7280';
                    
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          setIsTaskDetailOpen(true);
                        }}
                        className="text-xs px-2 py-1.5 rounded-lg truncate cursor-pointer hover:opacity-90 hover:shadow-sm transition font-medium flex items-center gap-1.5"
                        style={{ 
                          backgroundColor: taskColor + '20', 
                          color: taskColor,
                          borderLeft: `3px solid ${taskColor}`
                        }}
                      >
                        <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-semibold">
                              {new Date(task.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="truncate font-semibold">{task.title}</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {totalItems > 3 && (
                    <div className="text-xs text-slate-500 px-2">
                      +{totalItems - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
          setSelectedDate(null);
        }}
        event={editingEvent}
        selectedDate={selectedDate}
        onSave={handleEventSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, eventId: null, eventTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Evento"
        message={`¿Estás seguro de que deseas eliminar el evento "${deleteConfirm.eventTitle}"?`}
        type="danger"
        confirmText="Eliminar"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        duration={3000}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
};

