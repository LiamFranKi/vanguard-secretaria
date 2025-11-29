import React from 'react';
import { ArrowRight, CheckSquare, Shield, Zap, Users, Calendar, FileText, BarChart3 } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { config } = useConfig();
  const features = [
    {
      icon: CheckSquare,
      title: 'Gestión de Tareas',
      description: 'Organiza y prioriza tus tareas diarias con facilidad'
    },
    {
      icon: Users,
      title: 'Contactos',
      description: 'Mantén tu agenda de contactos organizada'
    },
    {
      icon: Calendar,
      title: 'Calendario',
      description: 'Planifica eventos y reuniones eficientemente'
    },
    {
      icon: FileText,
      title: 'Documentos',
      description: 'Gestiona todos tus documentos en un solo lugar'
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Tus datos están protegidos con encriptación'
    },
    {
      icon: Zap,
      title: 'Rápido',
      description: 'Interfaz optimizada para máxima productividad'
    }
  ];

  const stats = [
    { label: 'Usuarios Activos', value: '500+' },
    { label: 'Tareas Completadas', value: '10K+' },
    { label: 'Documentos Gestionados', value: '50K+' },
    { label: 'Satisfacción', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config?.logo_url ? (
              <img 
                src={config.logo_url.startsWith('http') ? config.logo_url : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${config.logo_url}`} 
                alt="Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg ${config?.logo_url ? 'hidden' : ''}`}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              {config?.nombre_sistema ? (() => {
                const nombre = config.nombre_sistema;
                const palabras = nombre.split(' ');
                
                // Si tiene más de una palabra, primera en oscuro, resto en gradiente
                if (palabras.length > 1) {
                  return (
                    <>
                      <span className="text-slate-900">{palabras[0]}</span>
                      <span className="gradient-text-primary">
                        {' ' + palabras.slice(1).join(' ')}
                      </span>
                    </>
                  );
                }
                
                // Si es una sola palabra, buscar si tiene "Pro", "Plus", etc. al final
                const sufijos = ['Pro', 'Plus', 'Max', 'Premium', 'Enterprise'];
                for (const sufijo of sufijos) {
                  if (nombre.endsWith(sufijo) && nombre.length > sufijo.length) {
                    const base = nombre.slice(0, -sufijo.length);
                    return (
                      <>
                        <span className="text-slate-900">{base}</span>
                        <span className="gradient-text-primary">{sufijo}</span>
                      </>
                    );
                  }
                }
                
                // Si no tiene espacios ni sufijos conocidos, dividir por la mitad
                const mitad = Math.ceil(nombre.length / 2);
                return (
                  <>
                    <span className="text-slate-900">{nombre.slice(0, mitad)}</span>
                    <span className="gradient-text-primary">{nombre.slice(mitad)}</span>
                  </>
                );
              })() : (
                <>
                  <span className="text-slate-900">Secretaria</span>
                  <span className="gradient-text-primary">Pro</span>
                </>
              )}
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Iniciar Sesión
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            {config?.titulo || 'Gestión Administrativa Profesional'}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {config?.descripcion_sistema || 'Simplifica tu trabajo diario con nuestra plataforma integral de gestión. Organiza tareas, contactos, documentos y eventos en un solo lugar.'}
          </p>
          <div className="flex justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-slate-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Características Principales
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Todo lo que necesitas para una gestión administrativa eficiente
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a cientos de profesionales que ya están usando SecretariaPro
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 mx-auto"
          >
            Iniciar Sesión Ahora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-8 border-t border-slate-200/50">
        <div className="text-center text-slate-600">
          <p>{config?.footer_text || `© ${new Date().getFullYear()} ${config?.nombre_sistema || 'SecretariaPro'}. Todos los derechos reservados.`}</p>
          {config?.email_contacto && (
            <p className="mt-2 text-sm">
              <a href={`mailto:${config.email_contacto}`} className="text-violet-600 hover:text-violet-700">
                {config.email_contacto}
              </a>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

