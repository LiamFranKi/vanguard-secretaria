import React, { useState, useEffect } from 'react';
import { Plus, X, Minimize2, Maximize2, Save, Trash2, Palette, FileText } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: '#7c3aed'
  });
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; noteId: string | null; noteTitle: string }>({
    isOpen: false,
    noteId: null,
    noteTitle: ''
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotes();
      setNotes(data);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al cargar notas',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (note: Note) => {
    if (expandedNote === note.id) {
      // Si ya está expandida, minimizar
      setExpandedNote(null);
      setEditingNote(null);
    } else {
      // Expandir
      setExpandedNote(note.id);
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        color: note.color
      });
    }
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: 'new',
      title: 'Nueva Nota',
      content: '',
      color: '#7c3aed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setExpandedNote('new');
    setEditingNote(newNote);
    setFormData({
      title: 'Nueva Nota',
      content: '',
      color: '#7c3aed'
    });
  };

  const handleSave = async () => {
    if (!editingNote) return;

    setSaving(true);
    try {
      if (editingNote.id === 'new') {
        // Crear nueva nota
        const created = await apiService.createNote(formData);
        await loadNotes();
        setExpandedNote(created.id);
        setAlertModal({
          isOpen: true,
          title: 'Nota Creada',
          message: 'La nota ha sido creada exitosamente.',
          type: 'success'
        });
      } else {
        // Actualizar nota existente
        await apiService.updateNote(editingNote.id, formData);
        await loadNotes();
        setAlertModal({
          isOpen: true,
          title: 'Nota Guardada',
          message: 'La nota ha sido guardada exitosamente.',
          type: 'success'
        });
      }
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al guardar la nota',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.noteId) return;

    try {
      await apiService.deleteNote(deleteConfirm.noteId);
      setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' });
      if (expandedNote === deleteConfirm.noteId) {
        setExpandedNote(null);
        setEditingNote(null);
      }
      await loadNotes();
      setAlertModal({
        isOpen: true,
        title: 'Nota Eliminada',
        message: 'La nota ha sido eliminada exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' });
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al eliminar la nota',
        type: 'error'
      });
    }
  };

  const handleMinimize = () => {
    setExpandedNote(null);
    setEditingNote(null);
  };

  const colorOptions = [
    { value: '#7c3aed', label: 'Violeta', bg: 'bg-violet-500' },
    { value: '#4f46e5', label: 'Índigo', bg: 'bg-indigo-500' },
    { value: '#ef4444', label: 'Rojo', bg: 'bg-red-500' },
    { value: '#f59e0b', label: 'Ámbar', bg: 'bg-amber-500' },
    { value: '#10b981', label: 'Verde', bg: 'bg-green-500' },
    { value: '#3b82f6', label: 'Azul', bg: 'bg-blue-500' },
    { value: '#ec4899', label: 'Rosa', bg: 'bg-pink-500' },
    { value: '#8b5cf6', label: 'Púrpura', bg: 'bg-purple-500' },
    { value: '#f97316', label: 'Naranja', bg: 'bg-orange-500' },
    { value: '#14b8a6', label: 'Cian', bg: 'bg-cyan-500' }
  ];

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
            <FileText className="w-8 h-8 text-violet-600" />
            Notas Rápidas
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus notas y recordatorios</p>
        </div>
        <button
          onClick={handleNewNote}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Nota
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => {
          const isExpanded = expandedNote === note.id;
          
          if (isExpanded) {
            // Vista expandida (modal-like)
            return (
              <div
                key={note.id}
                className="col-span-full md:col-span-2 lg:col-span-3 xl:col-span-4"
              >
                <div 
                  className="rounded-2xl shadow-2xl border-2 overflow-hidden"
                  style={{ 
                    borderColor: note.color,
                    backgroundColor: note.color + '05'
                  }}
                >
                  {/* Header expandido */}
                  <div 
                    className="p-6 text-white"
                    style={{ background: `linear-gradient(135deg, ${note.color}, ${note.color}dd)` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Editar Nota</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleMinimize}
                          className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                        >
                          <Minimize2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              isOpen: true,
                              noteId: note.id,
                              noteTitle: note.title
                            });
                          }}
                          className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Color picker */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2 opacity-90">Color</label>
                      <div className="grid grid-cols-5 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: color.value })}
                            className={`h-10 rounded-lg border-2 transition ${
                              formData.color === color.value
                                ? 'border-white scale-110 shadow-lg'
                                : 'border-white/30 hover:border-white/50'
                            }`}
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content expandido */}
                  <div className="p-6 bg-white">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                          placeholder="Título de la nota..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Contenido
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                          rows={12}
                          placeholder="Escribe tu nota aquí..."
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleMinimize}
                          className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: formData.color }}
                        >
                          {saving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Guardar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Vista de card pequeño
          return (
            <div
              key={note.id}
              onClick={() => handleCardClick(note)}
              className="bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              style={{ borderColor: note.color }}
            >
              {/* Barra de color superior */}
              <div 
                className="h-2"
                style={{ backgroundColor: note.color }}
              ></div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 line-clamp-2 flex-1">
                    {note.title || 'Sin título'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({
                        isOpen: true,
                        noteId: note.id,
                        noteTitle: note.title
                      });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-rose-50 rounded text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                  {note.content || 'Sin contenido...'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {new Date(note.updatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  <div className="flex items-center gap-1 text-violet-600 font-medium">
                    <Maximize2 className="w-3 h-3" />
                    Expandir
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notes.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
          <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No hay notas</h3>
          <p className="text-slate-500">Crea tu primera nota para comenzar</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' })}
        onConfirm={handleDelete}
        title="Eliminar Nota"
        message={`¿Estás seguro de que deseas eliminar la nota "${deleteConfirm.noteTitle}"?`}
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

