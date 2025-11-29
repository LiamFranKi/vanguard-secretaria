import React from 'react';
import { AlertTriangle, CheckCircle, Info, X, Trash2, Save } from 'lucide-react';

export type ConfirmModalType = 'danger' | 'success' | 'info' | 'warning';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: ConfirmModalType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText = 'Cancelar',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-8 h-8 text-rose-600" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-amber-600" />;
      default:
        return <Info className="w-8 h-8 text-violet-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          iconBg: 'bg-rose-100',
          button: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700',
          text: 'text-rose-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          text: 'text-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          iconBg: 'bg-amber-100',
          button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
          text: 'text-amber-700'
        };
      default:
        return {
          bg: 'bg-violet-50',
          border: 'border-violet-200',
          iconBg: 'bg-violet-100',
          button: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700',
          text: 'text-violet-700'
        };
    }
  };

  const colors = getColors();
  const defaultConfirmText = type === 'danger' ? 'Eliminar' : type === 'success' ? 'Confirmar' : 'Aceptar';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white w-full max-w-md rounded-2xl shadow-2xl ${colors.border} border-2 animate-in fade-in zoom-in duration-200`}>
        {/* Header */}
        <div className={`${colors.bg} ${colors.border} border-b-2 p-6 rounded-t-2xl`}>
          <div className="flex items-start gap-4">
            <div className={`${colors.iconBg} rounded-full p-3 flex-shrink-0`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
              <p className={`text-sm ${colors.text}`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white transition flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 ${colors.button} text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </>
            ) : (
              <>
                {type === 'danger' && <Trash2 className="w-5 h-5" />}
                {type === 'success' && <Save className="w-5 h-5" />}
                {confirmText || defaultConfirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

