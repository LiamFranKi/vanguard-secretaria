import React from 'react';
import { X, Calendar, Clock, Tag, Palette } from 'lucide-react';
import { CalendarEvent } from '../types';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit?: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event, onEdit }) => {
  if (!isOpen || !event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const dateStr = startDate.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const startTime = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const typeLabels = {
    meeting: 'Reunión',
    reminder: 'Recordatorio',
    personal: 'Personal'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
        {/* Header */}
        <div 
          className="p-6 text-white rounded-t-2xl"
          style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}dd)` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Detalles del Evento</h3>
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
            <h4 className="text-2xl font-bold text-slate-900 mb-2">{event.title}</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Fecha</div>
                <div className="font-semibold text-slate-900 capitalize">{dateStr}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <Clock className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Horario</div>
                <div className="font-semibold text-slate-900">{startTime} - {endTime}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <Tag className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Tipo</div>
                <div className="font-semibold text-slate-900">{typeLabels[event.type]}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <Palette className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-slate-600 mb-1">Color</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg border-2 border-slate-200"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <span className="font-mono text-sm text-slate-700">{event.color}</span>
                </div>
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

