import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Edit, Trash2, Folder, Upload, Download, 
  X, Save, FolderPlus, File, Image as ImageIcon, FileSpreadsheet, 
  FileType, Filter, FolderOpen, Eye
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';

interface DocumentFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  document_count?: number;
}

interface DocumentFile {
  id: string;
  folderId: string | null;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'txt';
  dateAdded: string;
  size: string;
  folder_name?: string;
  folder_color?: string;
}

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  folder?: DocumentFolder | null;
}

const FolderModal: React.FC<FolderModalProps> = ({ isOpen, onClose, onSave, folder }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#7c3aed'
  });
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (isOpen) {
      if (folder) {
        setFormData({
          name: folder.name || '',
          color: folder.color || '#7c3aed'
        });
      } else {
        setFormData({
          name: '',
          color: '#7c3aed'
        });
      }
    }
  }, [isOpen, folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (folder) {
        await apiService.updateFolder(folder.id, formData);
        setAlertModal({
          isOpen: true,
          title: 'Carpeta Actualizada',
          message: 'La carpeta ha sido actualizada exitosamente.',
          type: 'success'
        });
      } else {
        await apiService.createFolder(formData);
        setAlertModal({
          isOpen: true,
          title: 'Carpeta Creada',
          message: 'La carpeta ha sido creada exitosamente.',
          type: 'success'
        });
      }
      onSave();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al guardar la carpeta',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const colors = [
    '#7c3aed', '#4f46e5', '#ef4444', '#f59e0b', '#10b981', 
    '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16'
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-violet-200">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {folder ? 'Editar Carpeta' : 'Nueva Carpeta'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre de la Carpeta *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Mi Carpeta"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition ${
                      formData.color === color 
                        ? 'border-slate-900 scale-110 shadow-lg' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
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
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        duration={3000}
      />
    </>
  );
};

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  folders: DocumentFolder[];
  document?: DocumentFile | null;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, onSave, folders, document }) => {
  const [formData, setFormData] = useState({
    name: '',
    folderId: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (isOpen) {
      if (document) {
        setFormData({
          name: document.name || '',
          folderId: document.folderId || ''
        });
        setFile(null);
      } else {
        setFormData({
          name: '',
          folderId: ''
        });
        setFile(null);
      }
    }
  }, [isOpen, document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document && !file) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Por favor selecciona un archivo para subir.',
        type: 'error'
      });
      return;
    }

    setUploading(true);

    try {
      if (document) {
        // Actualizar documento existente
        await apiService.updateDocument(document.id, {
          name: formData.name,
          folderId: formData.folderId || null
        });
        setAlertModal({
          isOpen: true,
          title: 'Documento Actualizado',
          message: 'El documento ha sido actualizado exitosamente.',
          type: 'success'
        });
      } else {
        // Crear nuevo documento
        if (!file) return;
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('name', formData.name || file.name);
        if (formData.folderId) {
          formDataToSend.append('folderId', formData.folderId);
        }
        await apiService.uploadDocument(formDataToSend);
        setAlertModal({
          isOpen: true,
          title: 'Documento Subido',
          message: 'El documento ha sido subido exitosamente.',
          type: 'success'
        });
      }
      onSave();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al guardar el documento',
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-violet-200">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {document ? 'Editar Documento' : 'Subir Documento'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {!document && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Archivo *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-violet-400 transition">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                    required={!document}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600 font-medium">
                      {file ? file.name : 'Seleccionar archivo'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PDF, DOC, XLS, Imágenes, TXT
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre del Documento
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder={file ? file.name : 'Nombre del documento'}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Carpeta
              </label>
              <select
                value={formData.folderId}
                onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
              >
                <option value="">Sin carpeta</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {document ? 'Guardando...' : 'Subiendo...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {document ? 'Guardar' : 'Subir'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        duration={3000}
      />
    </>
  );
};

export const DocumentsView: React.FC = () => {
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null);
  const [editingDocument, setEditingDocument] = useState<DocumentFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'folder' | 'document' | null; id: string | null; name: string }>({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [foldersData, documentsData] = await Promise.all([
        apiService.getFolders(),
        apiService.getDocuments()
      ]);
      setFolders(foldersData);
      setDocuments(documentsData);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al cargar documentos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFolderModal = (folder?: DocumentFolder) => {
    if (folder) {
      setEditingFolder(folder);
    } else {
      setEditingFolder(null);
    }
    setIsFolderModalOpen(true);
  };

  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false);
    setEditingFolder(null);
  };

  const handleOpenDocumentModal = (document?: DocumentFile) => {
    if (document) {
      setEditingDocument(document);
    } else {
      setEditingDocument(null);
    }
    setIsDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setEditingDocument(null);
  };

  const handleSave = async () => {
    await loadData();
    handleCloseFolderModal();
    handleCloseDocumentModal();
  };

  const handleDeleteClick = (type: 'folder' | 'document', id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      name
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id || !deleteConfirm.type) return;

    try {
      if (deleteConfirm.type === 'folder') {
        await apiService.deleteFolder(deleteConfirm.id);
      } else {
        await apiService.deleteDocument(deleteConfirm.id);
      }
      setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' });
      await loadData();
      setAlertModal({
        isOpen: true,
        title: deleteConfirm.type === 'folder' ? 'Carpeta Eliminada' : 'Documento Eliminado',
        message: `El ${deleteConfirm.type === 'folder' ? 'carpeta' : 'documento'} ha sido eliminado exitosamente.`,
        type: 'success'
      });
    } catch (err: any) {
      setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' });
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || `Error al eliminar el ${deleteConfirm.type === 'folder' ? 'carpeta' : 'documento'}`,
        type: 'error'
      });
    }
  };

  const handleDownload = async (doc: DocumentFile) => {
    try {
      const url = await apiService.downloadDocument(doc.id);
      if (!url) {
        throw new Error('No se pudo obtener la URL del archivo');
      }
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.name;
      link.style.display = 'none';
      window.document.body.appendChild(link);
      link.click();
      // Esperar un poco antes de remover para asegurar que la descarga inicie
      setTimeout(() => {
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      console.error('Download error:', err);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || err.message || 'Error al descargar el documento',
        type: 'error'
      });
    }
  };

  const handleView = async (doc: DocumentFile) => {
    try {
      const token = localStorage.getItem('auth_token');
      const baseUrl = 'http://localhost:5000';
      
      // Usar el endpoint de visualización (sin forzar descarga)
      const url = `${baseUrl}/api/documents/${doc.id}/view`;
      
      // Obtener el blob con autenticación
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Error al abrir el documento');
        } catch {
          throw new Error('Error al abrir el documento');
        }
      }
      
      // Obtener el blob y crear una URL para visualizar
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      // Crear un iframe para mostrar el documento sin descargarlo
      const iframe = document.createElement('iframe');
      iframe.src = blobUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.zIndex = '9999';
      iframe.style.backgroundColor = 'white';
      
      // Botón para cerrar
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Cerrar';
      closeBtn.style.position = 'fixed';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '10px';
      closeBtn.style.zIndex = '10000';
      closeBtn.style.padding = '10px 20px';
      closeBtn.style.backgroundColor = '#7c3aed';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '5px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
        URL.revokeObjectURL(blobUrl);
      };
      
      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Error al abrir el documento',
        type: 'error'
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'doc':
        return File;
      case 'xls':
        return FileSpreadsheet;
      case 'img':
        return ImageIcon;
      case 'txt':
        return FileType;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-600';
      case 'doc':
        return 'bg-blue-100 text-blue-600';
      case 'xls':
        return 'bg-green-100 text-green-600';
      case 'img':
        return 'bg-purple-100 text-purple-600';
      case 'txt':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = filterFolder === 'all' || doc.folderId === filterFolder || (!doc.folderId && filterFolder === 'none');
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFolder && matchesType;
  });

  const totalDocuments = documents.length;
  const totalFolders = folders.length;

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
              <FileText className="w-6 h-6 text-white" />
            </div>
            Mis Documentos
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus documentos y carpetas</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenFolderModal()}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <FolderPlus className="w-5 h-5" />
            Nueva Carpeta
          </button>
          <button
            onClick={() => handleOpenDocumentModal()}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Subir Documento
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border-2 border-violet-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{totalDocuments}</div>
              <div className="text-sm text-slate-600 font-medium">Total Documentos</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{totalFolders}</div>
              <div className="text-sm text-slate-600 font-medium">Carpetas</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">
                {documents.reduce((acc, doc) => {
                  const size = parseFloat(doc.size);
                  return acc + size;
                }, 0).toFixed(1)} MB
              </div>
              <div className="text-sm text-slate-600 font-medium">Espacio Usado</div>
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
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
            />
          </div>
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
          >
            <option value="all">Todas las carpetas</option>
            <option value="none">Sin carpeta</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
          >
            <option value="all">Todos los tipos</option>
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="xls">XLS</option>
            <option value="img">Imágenes</option>
            <option value="txt">TXT</option>
          </select>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-violet-600" />
            Carpetas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {folders.map(folder => (
              <div
                key={folder.id}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:shadow-lg transition-all overflow-hidden group cursor-pointer relative"
                onClick={() => setFilterFolder(folder.id)}
              >
                <div className="h-1.5 relative" style={{ backgroundColor: folder.color }}>
                  {/* Botón eliminar en esquina superior - siempre visible */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick('folder', folder.id, folder.name);
                    }}
                    className="absolute top-1.5 right-2 w-6 h-6 bg-white/95 text-rose-600 rounded-md hover:bg-rose-50 hover:text-rose-700 transition flex items-center justify-center z-10 shadow-sm border border-rose-200"
                    title="Eliminar carpeta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: folder.color }}
                  >
                    <Folder className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-900 mb-1 line-clamp-1">{folder.name}</div>
                  <div className="text-xs text-slate-500">{folder.document_count || 0} archivos</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFolderModal(folder);
                  }}
                  className="absolute bottom-2 right-2 w-6 h-6 bg-white/95 text-violet-600 rounded-md hover:bg-violet-50 transition opacity-0 group-hover:opacity-100 z-10 shadow-sm border border-violet-200 flex items-center justify-center"
                  title="Editar carpeta"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-600" />
          Documentos {filterFolder !== 'all' && `(${filteredDocuments.length})`}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No hay documentos</h3>
              <p className="text-slate-500">
                {searchTerm || filterFolder !== 'all' || filterType !== 'all'
                  ? 'No se encontraron documentos con los filtros aplicados'
                  : 'Sube tu primer documento para comenzar'}
              </p>
            </div>
          ) : (
            filteredDocuments.map((document) => {
              const FileIcon = getFileIcon(document.type);
              return (
                <div
                  key={document.id}
                  className="bg-white rounded-lg shadow-sm border-2 border-slate-200 hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className={`h-1 ${getFileTypeColor(document.type).replace('text-', 'bg-').replace('-600', '-500')}`}></div>
                  <div className="p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${getFileTypeColor(document.type)} flex items-center justify-center flex-shrink-0`}>
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2 flex-1">{document.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase flex-shrink-0 ${getFileTypeColor(document.type).replace('text-', 'bg-').replace('-600', '-500')} text-white`}>
                            {document.type}
                          </span>
                        </div>
                        {document.folder_name && (
                          <span 
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                            style={{ backgroundColor: document.folder_color || '#7c3aed' }}
                          >
                            {document.folder_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                      <span>{new Date(document.dateAdded).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
                      <span className="truncate ml-1">{document.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleView(document)}
                        className="px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                        title="Ver documento"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(document)}
                        className="px-2 py-1.5 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition"
                        title="Descargar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDocumentModal(document)}
                        className="px-2 py-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick('document', document.id, document.name)}
                        className="px-2 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      {isFolderModalOpen && (
        <FolderModal
          isOpen={isFolderModalOpen}
          onClose={handleCloseFolderModal}
          onSave={handleSave}
          folder={editingFolder || undefined}
        />
      )}

      {isDocumentModalOpen && (
        <DocumentModal
          isOpen={isDocumentModalOpen}
          onClose={handleCloseDocumentModal}
          onSave={handleSave}
          folders={folders}
          document={editingDocument || undefined}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' })}
        onConfirm={handleDelete}
        title={deleteConfirm.type === 'folder' ? 'Eliminar Carpeta' : 'Eliminar Documento'}
        message={`¿Estás seguro de que deseas eliminar ${deleteConfirm.type === 'folder' ? 'la carpeta' : 'el documento'} "${deleteConfirm.name}"?`}
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

