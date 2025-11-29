import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

export type AlertModalType = 'success' | 'error' | 'info' | 'warning';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertModalType;
  duration?: number; // Auto-close duration in ms (0 = no auto-close)
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  duration = 0
}) => {
  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-amber-600" />;
      default:
        return <Info className="w-8 h-8 text-violet-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          text: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          iconBg: 'bg-rose-100',
          text: 'text-rose-700'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          iconBg: 'bg-amber-100',
          text: 'text-amber-700'
        };
      default:
        return {
          bg: 'bg-violet-50',
          border: 'border-violet-200',
          iconBg: 'bg-violet-100',
          text: 'text-violet-700'
        };
    }
  };

  const colors = getColors();

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
              className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white transition flex items-center justify-center flex-shrink-0"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

