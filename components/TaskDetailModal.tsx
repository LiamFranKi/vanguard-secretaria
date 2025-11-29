import React from 'react';
import { X, CheckSquare, Calendar, AlertCircle, FileText, Clock } from 'lucide-react';
import { Task, Priority, Status } from '../types';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, onEdit }) => {
  if (!isOpen || !task) return null;

  const taskDate = new Date(task.date);
  const dateStr = taskDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = taskDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const priorityColors = {
    [Priority.High]: 'bg-rose-100 text-rose-700 border-rose-200',
    [Priority.Medium]: 'bg-amber-100 text-amber-700 border-amber-200',
    [Priority.Low]: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const statusColors = {
    [Status.Pending]: 'bg-slate-100 text-slate-700 border-slate-200',
    [Status.InProgress]: 'bg-blue-100 text-blue-700 border-blue-200',
    [Status.Completed]: 'bg-green-100 text-green-700 border-green-200'
  };

  const getStatusIcon = () => {
    if (task.status === Status.Completed) {
      return <CheckSquare className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
        {/* Header */}
        <div className={`p-6 text-white rounded-t-2xl ${
          task.status === Status.Completed 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : task.priority === Priority.High
            ? 'bg-gradient-to-r from-rose-600 to-red-600'
            : task.priority === Priority.Medium
            ? 'bg-gradient-to-r from-amber-600 to-orange-600'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Detalles de la Tarea</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className={`text-2xl font-bold mb-2 ${
              task.status === Status.Completed ? 'line-through text-slate-400' : 'text-slate-900'
            }`}>
              {task.title}
            </h4>
          </div>

          {task.description && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-slate-600 mb-2">Descripción</div>
                  <div className="text-slate-900 whitespace-pre-wrap">{task.description}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Fecha y Hora</div>
                <div className="font-semibold text-slate-900 capitalize">{dateStr}</div>
                <div className="text-sm text-slate-600">{timeStr}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Prioridad</div>
                <span className={`inline-block px-3 py-1 rounded-lg border text-sm font-semibold ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              {getStatusIcon()}
              <div>
                <div className="text-sm text-slate-600 mb-1">Estado</div>
                <span className={`inline-block px-3 py-1 rounded-lg border text-sm font-semibold ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
          >
            Cerrar
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

