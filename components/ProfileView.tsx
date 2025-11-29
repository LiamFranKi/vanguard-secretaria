import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Save, Upload } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';

interface ProfileViewProps {
  onProfileUpdate?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onProfileUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    avatar: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const result = await apiService.uploadAvatar(file);
      setProfile({ ...profile, avatar: result.avatar_url });
      // Actualizar el avatar en el sistema
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      setAlertModal({
        isOpen: true,
        title: 'Avatar Actualizado',
        message: 'Tu foto de perfil ha sido actualizada exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al subir el avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    // Validar contraseñas si se está cambiando
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setSaving(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setSaving(false);
        return;
      }
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updated = await apiService.updateProfile(updateData);
      setProfile(updated);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      // Actualizar el perfil en el sistema
      if (onProfileUpdate) {
        onProfileUpdate();
      }
      setAlertModal({
        isOpen: true,
        title: 'Perfil Actualizado',
        message: 'Tu información ha sido actualizada exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const avatarUrl = profile.avatar 
    ? (profile.avatar.startsWith('http') ? profile.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${profile.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7c3aed&color=fff&size=200`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <User className="w-8 h-8 text-violet-600" />
          Mi Perfil
        </h2>
        <p className="text-slate-600 mt-1">Gestiona tu información personal y avatar</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Foto de Perfil</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-200 shadow-lg">
                  <img 
                    src={avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7c3aed&color=fff&size=200`;
                    }}
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:from-violet-700 hover:to-indigo-700 transition shadow-lg"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                  disabled={saving}
                />
              </div>

              <p className="text-sm text-slate-600 text-center mb-2">
                {profile.name}
              </p>
              <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                profile.role === 'ADMIN' 
                  ? 'bg-violet-100 text-violet-700' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {profile.role}
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                Click en el ícono de cámara para cambiar tu foto
              </p>
              <p className="text-xs text-slate-400 text-center mt-1">
                Formatos: JPG, PNG, GIF, WEBP<br />
                Tamaño máximo: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Información Personal</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Rol
                </label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">El rol no puede ser modificado</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">Cambiar Contraseña</h4>
                <p className="text-xs text-slate-500 mb-4">Deja estos campos vacíos si no deseas cambiar la contraseña</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                      placeholder="Dejar vacío para no cambiar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                      placeholder="Dejar vacío para no cambiar"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
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
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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

