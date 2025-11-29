import React from 'react';
import { X, User, Mail, Phone, MapPin, Briefcase, FileText, Tag } from 'lucide-react';
import { Contact } from '../types';

interface ContactDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onEdit?: () => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ isOpen, onClose, contact, onEdit }) => {
  if (!isOpen || !contact) return null;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 text-white rounded-t-2xl bg-gradient-to-r ${gradientClass} flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Detalles del Contacto</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Avatar y Nombre */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            {contact.avatar ? (
              <img
                src={contact.avatar.startsWith('http') ? contact.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${contact.avatar}`}
                alt={contact.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-24 h-24 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-2xl shadow-lg ${contact.avatar ? 'hidden' : ''}`}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h4 className="text-3xl font-bold text-slate-900 mb-2">{contact.name}</h4>
              {contact.role && (
                <span className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-lg text-sm font-semibold">
                  {contact.role}
                </span>
              )}
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <div className="font-semibold text-slate-900 break-all">{contact.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <Phone className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-600 mb-1">Teléfono</div>
                <div className="font-semibold text-slate-900">{contact.phone}</div>
              </div>
            </div>

            {contact.empresa && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <Briefcase className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-600 mb-1">Empresa</div>
                  <div className="font-semibold text-slate-900">{contact.empresa}</div>
                </div>
              </div>
            )}

            {contact.direccion && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl md:col-span-2">
                <MapPin className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-600 mb-1">Dirección</div>
                  <div className="font-semibold text-slate-900">{contact.direccion}</div>
                </div>
              </div>
            )}

            {contact.detalle && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl md:col-span-2">
                <FileText className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-600 mb-1">Detalle</div>
                  <div className="font-semibold text-slate-900 whitespace-pre-wrap">{contact.detalle}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3 flex-shrink-0 border-t border-slate-200">
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

