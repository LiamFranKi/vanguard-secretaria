import React, { useState, useEffect } from 'react';
import { X, Save, Palette, Image, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AlertModal } from './AlertModal';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [config, setConfig] = useState({
    nombre_sistema: '',
    titulo: '',
    descripcion_sistema: '',
    color_primario: '#7c3aed',
    color_secundario: '#4f46e5',
    logo_url: '',
    favicon_url: '',
    icon_192_url: '',
    icon_512_url: '',
    apple_touch_icon_url: '',
    email_contacto: '',
    telefono_contacto: '',
    direccion: '',
    footer_text: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getConfig();
      setConfig(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiService.updateConfig(config);
      onUpdate();
      onClose();
      setAlertModal({
        isOpen: true,
        title: 'Configuración Guardada',
        message: 'La configuración del sistema ha sido actualizada exitosamente.',
        type: 'success'
      });
    } catch (err: any) {
      setAlertModal({
        isOpen: true,
        title: 'Error al Guardar',
        message: err.response?.data?.error || 'Error al guardar configuración',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (field: 'color_primario' | 'color_secundario', value: string) => {
    setConfig({ ...config, [field]: value });
    // Aplicar color inmediatamente para preview
    if (field === 'color_primario') {
      document.documentElement.style.setProperty('--primary-color', value);
    } else {
      document.documentElement.style.setProperty('--secondary-color', value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-4 mt-8 max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.1) transparent' }}>
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando configuración...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Información General */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                Información General
              </h3>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre del Sistema
                </label>
                <input
                  type="text"
                  value={config.nombre_sistema}
                  onChange={(e) => setConfig({ ...config, nombre_sistema: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  placeholder="SecretariaPro"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={config.titulo}
                  onChange={(e) => setConfig({ ...config, titulo: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                  placeholder="Sistema de Gestión Administrativa"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={config.descripcion_sistema || ''}
                  onChange={(e) => setConfig({ ...config, descripcion_sistema: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                  rows={3}
                  placeholder="Descripción del sistema..."
                />
              </div>
            </div>

            {/* Colores */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-600" />
                Colores del Sistema
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.color_primario}
                      onChange={(e) => handleColorChange('color_primario', e.target.value)}
                      className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.color_primario}
                      onChange={(e) => handleColorChange('color_primario', e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none font-mono text-sm"
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.color_secundario}
                      onChange={(e) => handleColorChange('color_secundario', e.target.value)}
                      className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.color_secundario}
                      onChange={(e) => handleColorChange('color_secundario', e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none font-mono text-sm"
                      placeholder="#4f46e5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Image className="w-5 h-5 text-violet-600" />
                Logos e Imágenes
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Logo */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Logo del Sistema
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-violet-400 transition">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLoading(true);
                          try {
                            const result = await apiService.uploadLogo(file);
                            setConfig({ ...config, logo_url: result.logo_url });
                            setAlertModal({
                              isOpen: true,
                              title: 'Logo Subido',
                              message: 'El logo ha sido subido exitosamente.',
                              type: 'success'
                            });
                          } catch (err: any) {
                            setAlertModal({
                              isOpen: true,
                              title: 'Error al Subir',
                              message: err.response?.data?.error || 'Error al subir el logo',
                              type: 'error'
                            });
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      {config.logo_url ? (
                        <>
                          <img 
                            src={config.logo_url.startsWith('http') ? config.logo_url : `http://localhost:5000${config.logo_url}`} 
                            alt="Logo" 
                            className="h-20 object-contain mb-2"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span className="text-xs text-violet-600 font-medium">Click para cambiar</span>
                        </>
                      ) : (
                        <>
                          <Image className="w-12 h-12 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-600 font-medium">Subir Logo</span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong>Dimensiones recomendadas:</strong> 200x200px o 400x400px</p>
                    <p><strong>Formatos:</strong> PNG, JPG, SVG</p>
                    <p><strong>Tamaño máximo:</strong> 5MB</p>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Favicon
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-violet-400 transition">
                    <input
                      type="file"
                      accept="image/png,image/x-icon,image/svg+xml"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLoading(true);
                          try {
                            const result = await apiService.uploadFavicon(file);
                            setConfig({ ...config, favicon_url: result.favicon_url });
                            setAlertModal({
                              isOpen: true,
                              title: 'Favicon Subido',
                              message: 'El favicon ha sido subido exitosamente.',
                              type: 'success'
                            });
                          } catch (err: any) {
                            setAlertModal({
                              isOpen: true,
                              title: 'Error al Subir',
                              message: err.response?.data?.error || 'Error al subir el favicon',
                              type: 'error'
                            });
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      {config.favicon_url ? (
                        <>
                          <img 
                            src={config.favicon_url.startsWith('http') ? config.favicon_url : `http://localhost:5000${config.favicon_url}`} 
                            alt="Favicon" 
                            className="h-16 w-16 object-contain mb-2"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <span className="text-xs text-violet-600 font-medium">Click para cambiar</span>
                        </>
                      ) : (
                        <>
                          <Image className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-600 font-medium">Subir Favicon</span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p><strong>Dimensiones recomendadas:</strong> 32x32px o 64x64px</p>
                    <p><strong>Formatos:</strong> ICO, PNG, SVG</p>
                    <p><strong>Tamaño máximo:</strong> 5MB</p>
                  </div>
                </div>
              </div>

              {/* Iconos PWA */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Iconos PWA (Progressive Web App)</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Icono 192x192 */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Icono 192x192
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-violet-400 transition">
                      <input
                        type="file"
                        accept="image/png"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLoading(true);
                            try {
                              const result = await apiService.uploadIcon192(file);
                              setConfig({ ...config, icon_192_url: result.icon_192_url });
                              setAlertModal({
                                isOpen: true,
                                title: 'Icono Subido',
                                message: 'El icono 192x192 ha sido subido exitosamente.',
                                type: 'success'
                              });
                            } catch (err: any) {
                              setAlertModal({
                                isOpen: true,
                                title: 'Error al Subir',
                                message: err.response?.data?.error || 'Error al subir el icono',
                                type: 'error'
                              });
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="hidden"
                        id="icon-192-upload"
                      />
                      <label
                        htmlFor="icon-192-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        {config.icon_192_url ? (
                          <>
                            <img 
                              src={config.icon_192_url.startsWith('http') ? config.icon_192_url : `http://localhost:5000${config.icon_192_url}`} 
                              alt="Icon 192" 
                              className="h-16 w-16 object-contain mb-1"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <span className="text-xs text-violet-600 font-medium">Cambiar</span>
                          </>
                        ) : (
                          <>
                            <Image className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-600">Subir</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p><strong>192x192px</strong></p>
                      <p>PNG, cuadrado</p>
                    </div>
                  </div>

                  {/* Icono 512x512 */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Icono 512x512
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-violet-400 transition">
                      <input
                        type="file"
                        accept="image/png"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLoading(true);
                            try {
                              const result = await apiService.uploadIcon512(file);
                              setConfig({ ...config, icon_512_url: result.icon_512_url });
                              setAlertModal({
                                isOpen: true,
                                title: 'Icono Subido',
                                message: 'El icono 512x512 ha sido subido exitosamente.',
                                type: 'success'
                              });
                            } catch (err: any) {
                              setAlertModal({
                                isOpen: true,
                                title: 'Error al Subir',
                                message: err.response?.data?.error || 'Error al subir el icono',
                                type: 'error'
                              });
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="hidden"
                        id="icon-512-upload"
                      />
                      <label
                        htmlFor="icon-512-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        {config.icon_512_url ? (
                          <>
                            <img 
                              src={config.icon_512_url.startsWith('http') ? config.icon_512_url : `http://localhost:5000${config.icon_512_url}`} 
                              alt="Icon 512" 
                              className="h-16 w-16 object-contain mb-1"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <span className="text-xs text-violet-600 font-medium">Cambiar</span>
                          </>
                        ) : (
                          <>
                            <Image className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-600">Subir</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p><strong>512x512px</strong></p>
                      <p>PNG, cuadrado</p>
                    </div>
                  </div>

                  {/* Apple Touch Icon */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Apple Touch Icon
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 hover:border-violet-400 transition">
                      <input
                        type="file"
                        accept="image/png"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLoading(true);
                            try {
                              const result = await apiService.uploadAppleTouchIcon(file);
                              setConfig({ ...config, apple_touch_icon_url: result.apple_touch_icon_url });
                              setAlertModal({
                                isOpen: true,
                                title: 'Icono Subido',
                                message: 'El icono Apple Touch ha sido subido exitosamente.',
                                type: 'success'
                              });
                            } catch (err: any) {
                              setAlertModal({
                                isOpen: true,
                                title: 'Error al Subir',
                                message: err.response?.data?.error || 'Error al subir el icono',
                                type: 'error'
                              });
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="hidden"
                        id="apple-touch-icon-upload"
                      />
                      <label
                        htmlFor="apple-touch-icon-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        {config.apple_touch_icon_url ? (
                          <>
                            <img 
                              src={config.apple_touch_icon_url.startsWith('http') ? config.apple_touch_icon_url : `http://localhost:5000${config.apple_touch_icon_url}`} 
                              alt="Apple Touch Icon" 
                              className="h-16 w-16 object-contain mb-1"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <span className="text-xs text-violet-600 font-medium">Cambiar</span>
                          </>
                        ) : (
                          <>
                            <Image className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-600">Subir</span>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="text-xs text-slate-500">
                      <p><strong>180x180px</strong></p>
                      <p>PNG, iOS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-violet-600" />
                Información de Contacto
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email_contacto || ''}
                    onChange={(e) => setConfig({ ...config, email_contacto: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                    placeholder="contacto@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={config.telefono_contacto || ''}
                    onChange={(e) => setConfig({ ...config, telefono_contacto: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </label>
                <textarea
                  value={config.direccion || ''}
                  onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none resize-none"
                  rows={2}
                  placeholder="Dirección completa..."
                />
              </div>
            </div>

            {/* Footer */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Texto del Footer
              </label>
              <input
                type="text"
                value={config.footer_text || ''}
                onChange={(e) => setConfig({ ...config, footer_text: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="© 2024 SecretariaPro. Todos los derechos reservados."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-200">
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
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </form>
        )}
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

