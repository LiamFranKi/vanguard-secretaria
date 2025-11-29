import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, User, Building2, X, Save, MapPin, Briefcase, FileText, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Contact } from '../types';
import { AlertModal } from './AlertModal';
import { ConfirmModal } from './ConfirmModal';
import { ContactDetailModal } from './ContactDetailModal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  contact?: Contact | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    direccion: '',
    empresa: '',
    detalle: ''
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          role: contact.role || '',
          direccion: contact.direccion || '',
          empresa: contact.empresa || '',
          detalle: contact.detalle || ''
        });
        setAvatar(contact.avatar || null);
        setAvatarFile(null);
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: '',
          direccion: '',
          empresa: '',
          detalle: ''
        });
        setAvatar(null);
        setAvatarFile(null);
      }
    }
  }, [isOpen, contact]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Si es un contacto existente, subir inmediatamente
    if (contact) {
      handleAvatarUpload(file);
    } else {
      // Si es un contacto nuevo, guardar el archivo para subirlo después de crear
      setAvatarFile(file);
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!contact) return;

    setUploadingAvatar(true);
    try {
      const result = await apiService.uploadContactAvatar(contact.id, file);
      setAvatar(result.avatar_url);
      setAvatarFile(null);
      setAlertModal({
        isOpen: true,
        title: 'Avatar Subido',
        message: 'El avatar ha sido subido exitosamente.',
        type: 'success'
      });
      onSave(); // Refrescar la lista
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al subir el avatar',
        type: 'error'
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const contactData = {
        ...formData,
        avatar: avatar || undefined
      };

      if (contact) {
        await apiService.updateContact(contact.id, contactData);
        setAlertModal({
          isOpen: true,
          title: 'Contacto Actualizado',
          message: 'El contacto ha sido actualizado exitosamente.',
          type: 'success'
        });
      } else {
        const newContact = await apiService.createContact(contactData);
        
        // Si hay un archivo de avatar pendiente, subirlo después de crear el contacto
        if (avatarFile && newContact.id) {
          try {
            const result = await apiService.uploadContactAvatar(newContact.id, avatarFile);
            // Actualizar el contacto con el avatar
            await apiService.updateContact(newContact.id, { avatar: result.avatar_url });
          } catch (err: any) {
            console.error('Error uploading avatar after contact creation:', err);
            // No bloqueamos la creación del contacto si falla el avatar
          }
        }
        
        setAlertModal({
          isOpen: true,
          title: 'Contacto Creado',
          message: 'El contacto ha sido creado exitosamente.',
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
        message: err.response?.data?.error || 'Error al guardar el contacto',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-violet-200 animate-in fade-in zoom-in duration-200">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Avatar/Foto
              </label>
              <div className="flex items-center gap-4">
                {avatar ? (
                  <img
                    src={avatar.startsWith('http') || avatar.startsWith('data:') ? avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${avatar}`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-violet-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white font-bold text-xl">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleAvatarSelect}
                    disabled={uploadingAvatar}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`block px-4 py-2 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition cursor-pointer text-sm font-medium text-center ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingAvatar ? 'Subiendo...' : contact ? 'Cambiar Avatar' : 'Seleccionar Avatar'}
                  </label>
                </div>
              </div>
              {avatarFile && !contact && (
                <p className="text-xs text-violet-600 mt-2">✓ Avatar seleccionado. Se subirá al guardar el contacto.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rol/Cargo
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Director, Profesor, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Calle, Número, Ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Empresa
              </label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Detalle
              </label>
              <textarea
                value={formData.detalle}
                onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                rows={4}
                placeholder="Información adicional sobre el contacto..."
              />
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

export const ContactsView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; contactId: string | null; contactName: string }>({
    isOpen: false,
    contactId: null,
    contactName: ''
  });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContacts();
      setContacts(data);
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al cargar contactos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
    } else {
      setEditingContact(null);
    }
    setIsModalOpen(true);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleSave = async () => {
    await loadContacts();
    handleCloseModal();
  };

  const handleDeleteClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation(); // Evitar que se abra el modal de detalles
    setDeleteConfirm({
      isOpen: true,
      contactId: contact.id,
      contactName: contact.name
    });
  };

  const handleEditClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation(); // Evitar que se abra el modal de detalles
    handleOpenModal(contact);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.contactId) return;

    try {
      await apiService.deleteContact(deleteConfirm.contactId);
      setDeleteConfirm({ isOpen: false, contactId: null, contactName: '' });
      await loadContacts();
      setAlertModal({
        isOpen: true,
        title: 'Contacto Eliminado',
        message: 'El contacto ha sido eliminado exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setDeleteConfirm({ isOpen: false, contactId: null, contactName: '' });
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.error || 'Error al eliminar el contacto',
        type: 'error'
      });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    (contact.role && contact.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.direccion && contact.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.empresa && contact.empresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.detalle && contact.detalle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalContacts = contacts.length;

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
              <Users className="w-6 h-6 text-white" />
            </div>
            Mis Contactos
          </h2>
          <p className="text-slate-600 mt-1">Gestiona tus contactos y relaciones</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Contacto
        </button>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border-2 border-violet-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900">{totalContacts}</div>
            <div className="text-sm text-slate-600 font-medium">Total de Contactos</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar contactos por nombre, email, teléfono o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-100">
            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No hay contactos</h3>
            <p className="text-slate-500">
              {searchTerm
                ? 'No se encontraron contactos con la búsqueda aplicada'
                : 'Crea tu primer contacto para comenzar'}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const initials = contact.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            
            const colorVariants = [
              'from-violet-500 to-indigo-500',
              'from-rose-500 to-pink-500',
              'from-amber-500 to-orange-500',
              'from-emerald-500 to-teal-500',
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-fuchsia-500'
            ];
            const colorIndex = contact.id.charCodeAt(0) % colorVariants.length;
            const gradientClass = colorVariants[colorIndex];

            return (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:shadow-lg transition-all overflow-hidden group cursor-pointer relative"
              >
                {/* Header con gradiente */}
                <div className={`h-1.5 bg-gradient-to-r ${gradientClass} relative`}>
                  {/* Botón eliminar en esquina superior - siempre visible */}
                  <button
                    onClick={(e) => handleDeleteClick(e, contact)}
                    className="absolute top-1.5 right-2 w-6 h-6 bg-white/95 text-rose-600 rounded-md hover:bg-rose-50 hover:text-rose-700 transition flex items-center justify-center z-10 shadow-sm border border-rose-200"
                    title="Eliminar contacto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div 
                  onClick={() => handleContactClick(contact)}
                  className="p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar.startsWith('http') ? contact.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${contact.avatar}`}
                        alt={contact.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 ${contact.avatar ? 'hidden' : ''}`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-slate-900 mb-1 line-clamp-1">
                        {contact.name}
                      </h3>
                      {contact.role && (
                        <span className="inline-block px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-semibold">
                          {contact.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Información básica */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          contact={editingContact || undefined}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, contactId: null, contactName: '' })}
        onConfirm={handleDelete}
        title="Eliminar Contacto"
        message={`¿Estás seguro de que deseas eliminar el contacto "${deleteConfirm.contactName}"?`}
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

      {/* Contact Detail Modal */}
      <ContactDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onEdit={() => {
          setIsDetailModalOpen(false);
          if (selectedContact) {
            handleOpenModal(selectedContact);
          }
        }}
      />
    </div>
  );
};

