import React, { useState, useEffect } from 'react';
import { Save, X, Trash2 } from 'lucide-react';
import { 
  LayoutDashboard, Calendar, FileText, Users, CheckSquare, 
  Menu, Bell, Search, Plus, Clock, Settings, Mic, Mail, LogOut, UserCog, User, CalendarDays
} from 'lucide-react';
import { apiService } from './services/apiService';
import { Task, Contact, DocumentFolder, DocumentFile, CalendarEvent, ViewState, Priority, Status } from './types';
import { AssistantModal } from './components/AssistantModal';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ConfigModal } from './components/ConfigModal';
import { UsersView } from './components/UsersView';
import { ProfileView } from './components/ProfileView';
import { CalendarView } from './components/CalendarView';
import { TasksView } from './components/TasksView';
import { EventsView } from './components/EventsView';
import { ContactsView } from './components/ContactsView';
import { DocumentsView } from './components/DocumentsView';
import { NotesView } from './components/NotesView';
import { EventDetailModal } from './components/EventDetailModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ConfirmModal } from './components/ConfirmModal';
import { AlertModal } from './components/AlertModal';
import { NotificationsModal } from './components/NotificationsModal';
import { useConfig } from './hooks/useConfig';

// --- Sub-Components (Inline for single-file requirement simplicity within App context) ---

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-end text-slate-700 hidden md:flex">
      <div className="text-2xl font-bold font-mono tracking-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-widest">
        {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ElementType, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 group
      ${active 
        ? 'bg-violet-50 text-violet-700 border-r-4 border-violet-600' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'fill-current' : ''}`} />
    <span className="font-medium">{label}</span>
  </button>
);

// --- Main Views ---

const DashboardView: React.FC<{ 
  tasks: Task[], 
  events: CalendarEvent[], 
  notes: any[],
  contacts: Contact[],
  onNavigate?: (view: ViewState) => void,
  onEventClick?: (event: CalendarEvent) => void,
  onTaskClick?: (task: Task) => void,
  onNotesChange?: () => void
}> = ({ tasks, events, notes, contacts, onNavigate, onEventClick, onTaskClick, onNotesChange }) => {
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [newNoteData, setNewNoteData] = useState({
    title: '',
    content: '',
    color: '#7c3aed'
  });
  const [savingNote, setSavingNote] = useState(false);
  const [editingNotes, setEditingNotes] = useState<Record<string, { title: string; content: string; color: string }>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; noteId: string | null }>({
    isOpen: false,
    noteId: null
  });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const pendingTasks = tasks.filter(t => t.status !== Status.Completed).length;
  const todayEvents = events.length;
  const totalContacts = contacts.length;
  
  // Obtener eventos y tareas próximas (próximos 30 días) y combinarlos
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Resetear horas para comparación correcta
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingEvents = events
    .filter(evt => {
      const eventDate = new Date(evt.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= now && eventDate <= nextMonth;
    })
    .map(evt => ({ ...evt, date: new Date(evt.start), type: 'event' as const }));
  
  const upcomingTasks = tasks
    .filter(t => t.status !== Status.Completed)
    .filter(t => {
      const taskDate = new Date(t.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= now && taskDate <= nextMonth;
    })
    .map(t => ({ ...t, type: 'task' as const }));
  
  // Combinar y ordenar por fecha
  const upcomingItems = [...upcomingEvents, ...upcomingTasks]
    .sort((a, b) => {
      const dateA = 'start' in a ? new Date(a.start).getTime() : new Date(a.date).getTime();
      const dateB = 'start' in b ? new Date(b.start).getTime() : new Date(b.date).getTime();
      return dateA - dateB;
    })
    .slice(0, 2); 

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Panel General</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><CheckSquare className="w-6 h-6" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-800">{pendingTasks}</div>
            <div className="text-sm text-slate-500">Tareas Pendientes</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-800">{todayEvents}</div>
            <div className="text-sm text-slate-500">Eventos Hoy</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <div className="text-3xl font-bold text-slate-800">{totalContacts}</div>
            <div className="text-sm text-slate-500">Total Contactos</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-violet-100 p-6 relative overflow-hidden flex flex-col">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/30 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Agenda Rápida</h3>
                <p className="text-sm text-slate-600">Próximos eventos y tareas</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {upcomingItems.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-violet-300 mb-3" />
                  <p className="text-slate-500 text-sm">No hay eventos o tareas próximas</p>
                </div>
              ) : (
                upcomingItems.map((item) => {
                  if (item.type === 'event') {
                    const evt = item as CalendarEvent & { type: 'event' };
                    const eventTypeIcons = {
                      meeting: Users,
                      reminder: Bell,
                      personal: User
                    };
                    const Icon = eventTypeIcons[evt.type] || Calendar;
                    const startDate = new Date(evt.start);
                    const startTime = startDate.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
                    const endTime = new Date(evt.end).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
                    const dateStr = startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    
                    return (
                      <div 
                        key={evt.id} 
                        onClick={() => onEventClick && onEventClick(evt)}
                        className="flex gap-3 items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all border border-white/50 group cursor-pointer"
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: evt.color + '20' }}
                        >
                          <Icon 
                            className="w-6 h-6" 
                            style={{ color: evt.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 mb-1 group-hover:text-violet-700 transition">
                            {evt.title}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span className="font-medium text-violet-600">{dateStr}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {startTime} - {endTime}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="w-2 h-12 rounded-full flex-shrink-0"
                          style={{ backgroundColor: evt.color }}
                        ></div>
                      </div>
                    );
                  } else {
                    const task = item as Task & { type: 'task' };
                    const taskDate = new Date(task.date);
                    const dateStr = taskDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    const timeStr = taskDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => onTaskClick && onTaskClick(task)}
                        className="flex gap-3 items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all border border-white/50 group cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                          task.status === Status.Completed 
                            ? 'bg-green-100' 
                            : task.priority === Priority.High
                            ? 'bg-rose-100'
                            : task.priority === Priority.Medium
                            ? 'bg-amber-100'
                            : 'bg-slate-100'
                        }`}>
                          <CheckSquare 
                            className={`w-6 h-6 ${
                              task.status === Status.Completed 
                                ? 'text-green-600' 
                                : task.priority === Priority.High
                                ? 'text-rose-600'
                                : task.priority === Priority.Medium
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold mb-1 group-hover:text-violet-700 transition ${
                            task.status === Status.Completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span className="font-medium text-violet-600">{dateStr}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeStr}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              task.priority === Priority.High 
                                ? 'bg-rose-100 text-rose-600' 
                                : task.priority === Priority.Medium
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <div 
                          className={`w-2 h-12 rounded-full flex-shrink-0 ${
                            task.status === Status.Completed 
                              ? 'bg-green-500' 
                              : task.priority === Priority.High
                              ? 'bg-rose-500'
                              : task.priority === Priority.Medium
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        ></div>
                      </div>
                    );
                  }
                })
              )}
            </div>
            
            {(events.length > 0 || tasks.length > 0) && (
              <button 
                onClick={() => onNavigate && onNavigate('calendar')}
                className="mt-4 w-full py-2 text-sm font-medium text-violet-700 hover:text-violet-800 hover:bg-white/60 rounded-lg transition"
              >
                Ver calendario completo →
              </button>
            )}
          </div>
        </div>
         <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg p-6 text-white flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold opacity-90">Notas Rápidas</h3>
            <button
              onClick={() => onNavigate && onNavigate('notes')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
            >
              Ver todas →
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Grid de notas - 2 filas */}
            <div className="grid grid-cols-4 gap-2.5">
              {/* Notas existentes - cards pequeños */}
              {notes && notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setExpandedNoteId(note.id)}
                  className="h-24 rounded-xl p-2.5 shadow-md hover:shadow-lg transition cursor-pointer flex flex-col"
                  style={{ backgroundColor: note.color + 'E0' }}
                >
                  <h4 className="font-bold text-xs text-white mb-1 line-clamp-1 flex-shrink-0">
                    {note.title || 'Sin título'}
                  </h4>
                  <p className="text-[10px] text-white/90 line-clamp-2 flex-1 overflow-hidden">
                    {note.content || 'Sin contenido...'}
                  </p>
                </div>
              ))}

              {/* Botón para crear nueva nota */}
              {!isCreatingNote && (
                <button
                  onClick={() => setIsCreatingNote(true)}
                  className="h-24 rounded-xl border-2 border-dashed border-white/40 hover:border-white/60 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>

            {/* Modal de edición/creación centrado */}
            {(isCreatingNote || expandedNoteId) && (() => {
              // Inicializar datos de edición cuando se abre el modal
              if (expandedNoteId && !editingNotes[expandedNoteId]) {
                const note = notes?.find(n => n.id === expandedNoteId);
                if (note) {
                  setEditingNotes({
                    ...editingNotes,
                    [expandedNoteId]: {
                      title: note.title,
                      content: note.content,
                      color: note.color
                    }
                  });
                }
              }
              
              const currentColor = isCreatingNote 
                ? newNoteData.color 
                : (editingNotes[expandedNoteId || '']?.color || notes?.find(n => n.id === expandedNoteId)?.color || '#7c3aed');
              
              return (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsCreatingNote(false);
                    setExpandedNoteId(null);
                  }
                }}
              >
                <div 
                  className="w-full max-w-md rounded-2xl p-5 shadow-2xl border-2 border-white/40 flex flex-col animate-scale-in"
                  style={{ backgroundColor: currentColor + 'F5' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={isCreatingNote ? newNoteData.title : (() => {
                        if (!expandedNoteId) return '';
                        const currentEdit = editingNotes[expandedNoteId];
                        if (currentEdit) return currentEdit.title;
                        const note = notes?.find(n => n.id === expandedNoteId);
                        return note?.title || '';
                      })()}
                      onChange={(e) => {
                        if (isCreatingNote) {
                          setNewNoteData({ ...newNoteData, title: e.target.value });
                        } else {
                          if (!expandedNoteId) return;
                          const note = notes?.find(n => n.id === expandedNoteId);
                          const currentEdit = editingNotes[expandedNoteId] || {
                            title: note?.title || '',
                            content: note?.content || '',
                            color: note?.color || '#7c3aed'
                          };
                          setEditingNotes({
                            ...editingNotes,
                            [expandedNoteId]: {
                              ...currentEdit,
                              title: e.target.value
                            }
                          });
                        }
                      }}
                      placeholder="Título..."
                      className="flex-1 bg-white/95 text-slate-900 placeholder-slate-500 text-sm font-semibold px-3 py-2 rounded-lg outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsCreatingNote(false);
                        setExpandedNoteId(null);
                        setNewNoteData({ title: '', content: '', color: '#7c3aed' });
                        const newEditingNotes = { ...editingNotes };
                        if (expandedNoteId) delete newEditingNotes[expandedNoteId];
                        setEditingNotes(newEditingNotes);
                      }}
                      className="ml-2 p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={isCreatingNote ? newNoteData.content : (() => {
                      if (!expandedNoteId) return '';
                      const currentEdit = editingNotes[expandedNoteId];
                      if (currentEdit) return currentEdit.content;
                      const note = notes?.find(n => n.id === expandedNoteId);
                      return note?.content || '';
                    })()}
                    onChange={(e) => {
                      if (isCreatingNote) {
                        setNewNoteData({ ...newNoteData, content: e.target.value });
                      } else {
                        if (!expandedNoteId) return;
                        const note = notes?.find(n => n.id === expandedNoteId);
                        const currentEdit = editingNotes[expandedNoteId] || {
                          title: note?.title || '',
                          content: note?.content || '',
                          color: note?.color || '#7c3aed'
                        };
                        setEditingNotes({
                          ...editingNotes,
                          [expandedNoteId]: {
                            ...currentEdit,
                            content: e.target.value
                          }
                        });
                      }
                    }}
                    placeholder="Escribe aquí..."
                    className="w-full h-48 bg-white/95 text-slate-700 placeholder-slate-500 text-sm resize-none outline-none rounded-lg p-3 mb-3"
                  />

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex gap-2 flex-wrap">
                      {['#7c3aed', '#4f46e5', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            if (isCreatingNote) {
                              setNewNoteData({ ...newNoteData, color });
                            } else {
                              if (!expandedNoteId) return;
                              const note = notes?.find(n => n.id === expandedNoteId);
                              const currentEdit = editingNotes[expandedNoteId] || {
                                title: note?.title || '',
                                content: note?.content || '',
                                color: note?.color || '#7c3aed'
                              };
                              setEditingNotes({
                                ...editingNotes,
                                [expandedNoteId]: {
                                  ...currentEdit,
                                  color
                                }
                              });
                            }
                          }}
                          className={`w-5 h-5 rounded-full border-2 ${
                            (isCreatingNote ? newNoteData.color : (editingNotes[expandedNoteId || '']?.color || notes?.find(n => n.id === expandedNoteId)?.color || '#7c3aed')) === color 
                              ? 'border-white scale-125' 
                              : 'border-white/50'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (isCreatingNote) {
                          if (!newNoteData.title.trim()) {
                            setIsCreatingNote(false);
                            setNewNoteData({ title: '', content: '', color: '#7c3aed' });
                            return;
                          }
                          setSavingNote(true);
                          try {
                            await apiService.createNote(newNoteData);
                            setNewNoteData({ title: '', content: '', color: '#7c3aed' });
                            setIsCreatingNote(false);
                            if (onNotesChange) onNotesChange();
                            setAlertModal({
                              isOpen: true,
                              title: 'Nota Creada',
                              message: 'La nota ha sido creada exitosamente.',
                              type: 'success'
                            });
                          } catch (error: any) {
                            setAlertModal({
                              isOpen: true,
                              title: 'Error',
                              message: error.response?.data?.error || 'Error al crear la nota',
                              type: 'error'
                            });
                          } finally {
                            setSavingNote(false);
                          }
                        } else {
                          if (!expandedNoteId) return;
                          const note = notes?.find(n => n.id === expandedNoteId);
                          const editData = editingNotes[expandedNoteId] || {
                            title: note?.title || '',
                            content: note?.content || '',
                            color: note?.color || '#7c3aed'
                          };
                          
                          // Validar que tenga título
                          if (!editData.title.trim()) {
                            setAlertModal({
                              isOpen: true,
                              title: 'Error',
                              message: 'El título es requerido',
                              type: 'error'
                            });
                            return;
                          }
                          
                          setSavingNote(true);
                          try {
                            await apiService.updateNote(expandedNoteId, editData);
                            setExpandedNoteId(null);
                            const newEditingNotes = { ...editingNotes };
                            delete newEditingNotes[expandedNoteId];
                            setEditingNotes(newEditingNotes);
                            if (onNotesChange) onNotesChange();
                            setAlertModal({
                              isOpen: true,
                              title: 'Nota Guardada',
                              message: 'La nota ha sido guardada exitosamente.',
                              type: 'success'
                            });
                          } catch (error: any) {
                            setAlertModal({
                              isOpen: true,
                              title: 'Error',
                              message: error.response?.data?.error || 'Error al guardar la nota',
                              type: 'error'
                            });
                          } finally {
                            setSavingNote(false);
                          }
                        }
                      }}
                      disabled={savingNote}
                      className="flex-1 px-4 py-2.5 bg-white/95 text-slate-900 rounded-lg text-sm font-semibold hover:bg-white transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    {!isCreatingNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({
                            isOpen: true,
                            noteId: expandedNoteId
                          });
                        }}
                        className="px-4 py-2.5 bg-red-500/90 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate && onNavigate('notes')}
                      className="px-4 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2"
                    >
                      Ver todas
                    </button>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* Modales de confirmación y alerta */}
            <ConfirmModal
              isOpen={deleteConfirm.isOpen}
              onClose={() => setDeleteConfirm({ isOpen: false, noteId: null })}
              onConfirm={async () => {
                if (deleteConfirm.noteId) {
                  try {
                    await apiService.deleteNote(deleteConfirm.noteId);
                    setExpandedNoteId(null);
                    const newEditingNotes = { ...editingNotes };
                    delete newEditingNotes[deleteConfirm.noteId];
                    setEditingNotes(newEditingNotes);
                    setDeleteConfirm({ isOpen: false, noteId: null });
                    if (onNotesChange) onNotesChange();
                    setAlertModal({
                      isOpen: true,
                      title: 'Nota Eliminada',
                      message: 'La nota ha sido eliminada exitosamente.',
                      type: 'success'
                    });
                  } catch (error: any) {
                    setDeleteConfirm({ isOpen: false, noteId: null });
                    setAlertModal({
                      isOpen: true,
                      title: 'Error',
                      message: error.response?.data?.error || 'Error al eliminar la nota',
                      type: 'error'
                    });
                  }
                }
              }}
              title="Eliminar Nota"
              message="¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer."
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
        </div>
      </div>
    </div>
  );
};



// --- Main App Component ---

export default function App() {
  const { config, refreshConfig } = useConfig();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // State Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Inicializar push notifications si el usuario está autenticado
      if (user) {
        try {
          const { pushService } = await import('./services/pushService');
          await pushService.initialize();
        } catch (error) {
          console.warn('No se pudo inicializar push notifications:', error);
        }
      }
      // Check if there's a token first
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        // No token, show landing page
        setShowLanding(true);
        setShowLogin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is authenticated
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
        await loadData();
        setShowLanding(false);
        setShowLogin(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Clear invalid token
        localStorage.removeItem('auth_token');
        // Show landing page first, user will navigate to login
        setShowLanding(true);
        setShowLogin(false);
      } finally {
        setLoading(false);
      }
    };
    initializeApp();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, contactsData, foldersData, filesData, eventsData, notesData] = await Promise.all([
        apiService.getTasks(),
        apiService.getContacts(),
        apiService.getFolders(),
        apiService.getDocuments(),
        apiService.getEvents(),
        apiService.getNotes()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setFolders(foldersData);
      setFiles(filesData);
      setEvents(eventsData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    setShowLanding(false);
    setLoading(true);
    try {
      const currentUser = await apiService.getCurrentUser();
      // Si el usuario tiene avatar, construir la URL completa
      if (currentUser.avatar && !currentUser.avatar.startsWith('http')) {
        currentUser.avatar = `http://localhost:5000${currentUser.avatar}`;
      }
      setUser(currentUser);
      await loadData();
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profile = await apiService.getProfile();
      if (profile.avatar && !profile.avatar.startsWith('http')) {
        profile.avatar = `http://localhost:5000${profile.avatar}`;
      }
      setUser({
        ...user!,
        ...profile
      });
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowLogin(true);
  };

  const handleBackToLanding = () => {
    setShowLogin(false);
    setShowLanding(true);
  };

  const handleLogout = () => {
    apiService.clearAuth();
    setUser(null);
    setShowLanding(true);
    setShowLogin(false);
    setTasks([]);
    setContacts([]);
    setFolders([]);
    setFiles([]);
    setEvents([]);
    setNotes([]);
  };


  const renderContent = () => {
    switch(currentView) {
      case 'dashboard': return (
        <DashboardView 
          tasks={tasks} 
          events={events} 
          notes={notes}
          contacts={contacts}
          onNavigate={setCurrentView}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setIsEventDetailOpen(true);
          }}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskDetailOpen(true);
          }}
          onNotesChange={loadData}
        />
      );
      case 'documents': return <DocumentsView />;
      case 'tasks': return <TasksView tasks={tasks} onTasksChange={loadData} />;
      case 'events': return <EventsView onEventsChange={loadData} />;
      case 'contacts': return <ContactsView />;
      case 'users': return <UsersView />;
      case 'profile': return <ProfileView onProfileUpdate={refreshUserProfile} />;
      case 'notes': return <NotesView />;
      case 'calendar': return <CalendarView events={events} tasks={tasks} onEventsChange={loadData} onTasksChange={loadData} />;
      default: return <div>Select a view</div>;
    }
  };

  // Show landing or login if user is not authenticated (don't wait for loading)
  if (!user && !loading) {
    return (
      <>
        {showLanding && <LandingPage onGetStarted={handleGetStarted} />}
        {showLogin && <LoginPage onSuccess={handleLoginSuccess} onBack={handleBackToLanding} />}
        <AssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-2">
              {config?.logo_url ? (
              <img 
  src={(() => {
    if (!config?.logo_url) return undefined;
    let path = config.logo_url;
    if (path.startsWith('http://localhost:5000')) {
      path = path.replace('http://localhost:5000', '');
    }
    if (path.startsWith('http')) {
      return path;
    }
    const base = import.meta.env.PROD ? '' : 'http://localhost:5000';
    return `${base}${path}`;
  })()}
  alt="Logo" 
  className="h-8 w-auto object-contain"
  onError={(e) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  }}
/>

              ) : null}
              <div 
                className={`w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg ${config?.logo_url ? 'hidden' : ''}`}
              >
                S
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {config?.nombre_sistema ? (() => {
                  const nombre = config.nombre_sistema;
                  const palabras = nombre.split(' ');
                  
                  // Si tiene más de una palabra, primera en oscuro, resto en gradiente
                  if (palabras.length > 1) {
                    return (
                      <>
                        <span className="text-slate-900">{palabras[0]}</span>
                        <span className="gradient-text-primary">
                          {' ' + palabras.slice(1).join(' ')}
                        </span>
                      </>
                    );
                  }
                  
                  // Si es una sola palabra, buscar si tiene "Pro", "Plus", etc. al final
                  const sufijos = ['Pro', 'Plus', 'Max', 'Premium', 'Enterprise'];
                  for (const sufijo of sufijos) {
                    if (nombre.endsWith(sufijo) && nombre.length > sufijo.length) {
                      const base = nombre.slice(0, -sufijo.length);
                      return (
                        <>
                          <span className="text-slate-900">{base}</span>
                          <span className="gradient-text-primary">{sufijo}</span>
                        </>
                      );
                    }
                  }
                  
                  // Si no tiene espacios ni sufijos conocidos, dividir por la mitad o aplicar todo en gradiente
                  const mitad = Math.ceil(nombre.length / 2);
                  return (
                    <>
                      <span className="text-slate-900">{nombre.slice(0, mitad)}</span>
                      <span className="gradient-text-primary">{nombre.slice(mitad)}</span>
                    </>
                  );
                })() : (
                  <>
                    <span className="text-slate-900">Secretaria</span>
                    <span className="gradient-text-primary">Pro</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-xs text-slate-400 pl-11">v1.0.0 Enterprise</p>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Panel General" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={Calendar} label="Calendario" active={currentView === 'calendar'} onClick={() => { setCurrentView('calendar'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={CheckSquare} label="Tareas" active={currentView === 'tasks'} onClick={() => { setCurrentView('tasks'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={CalendarDays} label="Eventos" active={currentView === 'events'} onClick={() => { setCurrentView('events'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={FileText} label="Documentos" active={currentView === 'documents'} onClick={() => { setCurrentView('documents'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={Users} label="Contactos" active={currentView === 'contacts'} onClick={() => { setCurrentView('contacts'); setIsMobileMenuOpen(false); }} />
            <SidebarItem icon={FileText} label="Notas" active={currentView === 'notes'} onClick={() => { setCurrentView('notes'); setIsMobileMenuOpen(false); }} />
            {user?.role === 'ADMIN' && (
              <SidebarItem icon={UserCog} label="Usuarios" active={currentView === 'users'} onClick={() => { setCurrentView('users'); setIsMobileMenuOpen(false); }} />
            )}
          </nav>

          <div className="p-6 border-t border-slate-100 space-y-2">
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Mic className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="font-semibold">Asistente IA</span>
            </button>
            {user?.role === 'ADMIN' && (
              <button 
                onClick={() => setIsConfigModalOpen(true)}
                className="w-full bg-slate-100 text-slate-700 p-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 group"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition" />
                <span className="font-semibold">Configuración</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Buscar documentos, eventos o contactos..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400" />
          </div>

          <div className="flex items-center gap-6">
            <ClockWidget />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsNotificationsModalOpen(true)}
                className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition"
                title="Mi Perfil"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
            <div className="relative group">
              <button 
                onClick={() => { setCurrentView('profile'); setIsMobileMenuOpen(false); }}
                className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-violet-500 transition"
              >
                <img 
                  src={(() => {
  if (!user?.avatar) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff`;
  }
  let path = user.avatar;
  if (path.startsWith('http://localhost:5000')) {
    path = path.replace('http://localhost:5000', '');
  }
  if (path.startsWith('http')) {
    return path;
  }
  const base = import.meta.env.PROD ? '' : 'http://localhost:5000';
  return `${base}${path}`;
})()}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff`;
                  }}
                />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-slate-700 border-b border-slate-100">
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {renderContent()}
        </div>
      </main>

      {/* Overlays */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Smart Assistant Modal */}
      <AssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      
      {/* Notifications Modal */}
      <NotificationsModal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)} />

      {/* Config Modal */}
      {user?.role === 'ADMIN' && (
        <ConfigModal 
          isOpen={isConfigModalOpen} 
          onClose={() => setIsConfigModalOpen(false)}
          onUpdate={refreshConfig}
        />
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isEventDetailOpen}
        onClose={() => {
          setIsEventDetailOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onEdit={() => {
          setIsEventDetailOpen(false);
          setCurrentView('calendar');
          // El CalendarView manejará la edición
        }}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={() => {
          setIsTaskDetailOpen(false);
          setCurrentView('tasks');
          // El TasksView manejará la edición
        }}
      />


    </div>
  );
}
