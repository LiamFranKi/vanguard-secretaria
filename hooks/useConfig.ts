import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface Config {
  nombre_sistema: string;
  titulo: string;
  descripcion_sistema: string;
  color_primario: string;
  color_secundario: string;
  logo_url?: string;
  favicon_url?: string;
  email_contacto?: string;
  telefono_contacto?: string;
  direccion?: string;
  footer_text?: string;
}

export const useConfig = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await apiService.getConfig();
      setConfig(data);
      applyConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
      // Usar valores por defecto
      const defaultConfig: Config = {
        nombre_sistema: 'SecretariaPro',
        titulo: 'Sistema de Gestión Administrativa',
        descripcion_sistema: 'Plataforma integral de gestión',
        color_primario: '#7c3aed',
        color_secundario: '#4f46e5'
      };
      setConfig(defaultConfig);
      applyConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const applyConfig = (data: Config) => {
    // Aplicar colores como variables CSS
    document.documentElement.style.setProperty('--primary-color', data.color_primario);
    document.documentElement.style.setProperty('--secondary-color', data.color_secundario);
    
    // Aplicar colores también como clases CSS personalizadas para gradientes
    const style = document.createElement('style');
    style.id = 'dynamic-config-styles';
    const existingStyle = document.getElementById('dynamic-config-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    style.textContent = `
      .gradient-text-primary {
        background: linear-gradient(to right, ${data.color_primario}, ${data.color_secundario});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .gradient-bg-primary {
        background: linear-gradient(to right, ${data.color_primario}, ${data.color_secundario});
      }
      .gradient-bg-primary-br {
        background: linear-gradient(to bottom right, ${data.color_primario}, ${data.color_secundario});
      }
    `;
    document.head.appendChild(style);

    // Actualizar favicon si existe
    if (data.favicon_url) {
      const faviconUrl = data.favicon_url.startsWith('http') 
        ? data.favicon_url 
        : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${data.favicon_url}`;
      
      // Remover favicons existentes
      const existingLinks = document.querySelectorAll("link[rel~='icon']");
      existingLinks.forEach(link => link.remove());
      
      // Crear nuevo link para favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = faviconUrl;
      document.head.appendChild(link);
    }

    // Actualizar título
    if (data.titulo) {
      document.title = data.titulo;
    }
  };

  const refreshConfig = async () => {
    await loadConfig();
  };

  return { config, loading, refreshConfig };
};

