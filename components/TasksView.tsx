import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CheckSquare, Clock, AlertCircle, Filter, CheckCircle2 } from 'lucide-react';
import { Task, Priority, Status } from '../types';
import { apiService } from '../services/apiService';
import { TaskModal } from './TaskModal';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';
import { UserAvatars } from './UserAvatars';

interface TasksViewProps {
  tasks: Task[];
  onTasksChange: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onTasksChange }) => {
  // Debug: Ver qué tareas se están recibiendo
  useEffect(() => {
    console.log('TasksView - Received tasks:', tasks);
  }, [tasks]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: string | null; taskTitle: string }>({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === Status.Completed ? Status.Pending : Status.Completed;
    try {
      await apiService.updateTask(id, { status: newStatus });
      onTasksChange();
    } catch (error: any) {
      console.error('Error toggling task:', error);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.error || 'Error al actualizar la tarea',
        type: 'error'
      });
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteConfirm({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId) return;

    try {
      await apiService.deleteTask(deleteConfirm.taskId);
      setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
      onTasksChange();
      setAlertModal({
        isOpen: true,
        title: 'Tarea Eliminada',
        message: 'La tarea ha sido eliminada exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
      setAlertModal({
        isOpen: true,
        title: 'Error al Eliminar',
        message: err.response?.data?.error || err.message || 'Error al eliminar la tarea',
        type: 'error'
      });
    }
  };

  const handleTaskSave = () => {
    handleCloseModal();
    onTasksChange();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingTasks = tasks.filter(t => t.status !== Status.Completed).length;
  const completedTasks = tasks.filter(t => t.status === Status.Completed).length;

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case Priority.Medium:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Completed:
        return 'bg-green-100 text-green-700 border-green-200';
      case Status.InProgress:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-violet-600" />
            Mis Tareas
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus tareas y pendientes</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-2xl font-bold text-slate-900">{tasks.length}</div>
          <div className="text-sm text-slate-600">Total de Tareas</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-2xl font-bold text-amber-600">{pendingTasks}</div>
          <div className="text-sm text-slate-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-slate-600">Completadas</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | Status)}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value={Status.Pending}>Pendiente</option>
              <option value={Status.InProgress}>En Progreso</option>
              <option value={Status.Completed}>Completada</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | Priority)}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            >
              <option value="all">Todas las prioridades</option>
              <option value={Priority.High}>Alta</option>
              <option value={Priority.Medium}>Media</option>
              <option value={Priority.Low}>Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
            <CheckSquare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No hay tareas</h3>
            <p className="text-slate-500">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Crea tu primera tarea para comenzar'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const priorityIcons = {
              [Priority.High]: AlertCircle,
              [Priority.Medium]: Clock,
              [Priority.Low]: CheckSquare
            };
            const PriorityIcon = priorityIcons[task.priority] || CheckSquare;
            
            return (
              <div
                key={task.id}
                className={`group rounded-2xl shadow-lg border-2 hover:shadow-xl transition-all overflow-hidden ${
                  task.status === Status.Completed 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : task.priority === Priority.High
                    ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-red-50'
                    : task.priority === Priority.Medium
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'
                    : 'border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100'
                }`}
              >
                {/* Header con color según prioridad */}
                <div 
                  className={`h-2 ${
                    task.status === Status.Completed 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : task.priority === Priority.High
                      ? 'bg-gradient-to-r from-rose-500 to-red-500'
                      : task.priority === Priority.Medium
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500'
                  }`}
                ></div>
                
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition flex-shrink-0 shadow-sm ${
                        task.status === Status.Completed
                          ? 'bg-emerald-500 text-white'
                          : task.priority === Priority.High
                          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                          : task.priority === Priority.Medium
                          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {task.status === Status.Completed ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <div className="w-4 h-4 rounded border-2 border-current"></div>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-slate-900 mb-1 ${
                        task.status === Status.Completed ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges, fecha y usuarios asignados */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${getPriorityColor(task.priority)}`}>
                        <PriorityIcon className="w-3 h-3" />
                        {task.priority}
                      </span>
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.assigned_users && task.assigned_users.length > 0 && (
                      <UserAvatars users={task.assigned_users} maxVisible={3} />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-100">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(task.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>
                      {new Date(task.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    {task.status !== Status.Completed && (
                      <button
                        onClick={() => handleToggle(task.id)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-medium text-sm flex items-center justify-center gap-2"
                        title="Marcar como completada"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Completar
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenModal(task)}
                      className="flex-1 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task)}
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSave={handleTaskSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Tarea"
        message={`¿Estás seguro de que deseas eliminar la tarea "${deleteConfirm.taskTitle}"?`}
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
    </div>
  );
};

