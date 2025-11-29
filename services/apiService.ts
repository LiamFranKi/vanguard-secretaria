import axios from 'axios';
import { Priority, Status } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private api;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Solo redirigir si hay un token (significa que el token es inválido)
        // Si no hay token, simplemente rechazar la promesa sin redirigir
        if (error.response?.status === 401 && this.token) {
          this.clearAuth();
          // No redirigir automáticamente, dejar que el componente maneje el error
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem('auth_token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async register(email: string, password: string, name: string, role?: string) {
    const response = await this.api.post('/auth/register', { email, password, name, role });
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data.user;
  }

  // Tasks
  async getTasks(status?: string, priority?: string) {
    try {
      const params: any = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      const response = await this.api.get('/tasks', { params });
      return response.data.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description || '',
        date: t.date,
        priority: t.priority as Priority,
        status: t.status as Status,
        assigned_users: (t.assigned_users || []).map((u: any) => ({
          id: u.id.toString(),
          name: u.name,
          email: u.email,
          avatar: u.avatar ? `${API_URL}${u.avatar}` : null
        }))
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(task: any) {
    const response = await this.api.post('/tasks', task);
    const t = response.data;
    return {
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      date: t.date,
      priority: t.priority,
      status: t.status,
      assigned_users: (t.assigned_users || []).map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        avatar: u.avatar ? `${API_URL}${u.avatar}` : null
      }))
    };
  }

  async updateTask(id: string, task: any) {
    const response = await this.api.put(`/tasks/${id}`, task);
    const t = response.data;
    return {
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      date: t.date,
      priority: t.priority,
      status: t.status,
      assigned_users: (t.assigned_users || []).map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        avatar: u.avatar ? `${API_URL}${u.avatar}` : null
      }))
    };
  }

  async deleteTask(id: string) {
    await this.api.delete(`/tasks/${id}`);
  }

  // Contacts
  async getContacts() {
    const response = await this.api.get('/contacts');
    return response.data.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role || '',
      direccion: c.direccion || '',
      empresa: c.empresa || '',
      detalle: c.detalle || '',
      avatar: c.avatar || null
    }));
  }

  async createContact(contact: any) {
    const response = await this.api.post('/contacts', contact);
    const c = response.data;
    return {
      id: c.id.toString(),
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role || '',
      direccion: c.direccion || '',
      empresa: c.empresa || '',
      detalle: c.detalle || '',
      avatar: c.avatar || null
    };
  }

  async updateContact(id: string, contact: any) {
    const response = await this.api.put(`/contacts/${id}`, contact);
    const c = response.data;
    return {
      id: c.id.toString(),
      name: c.name,
      email: c.email,
      phone: c.phone,
      role: c.role || '',
      direccion: c.direccion || '',
      empresa: c.empresa || '',
      detalle: c.detalle || '',
      avatar: c.avatar || null
    };
  }

  async uploadContactAvatar(id: string, file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await this.api.post(`/contacts/${id}/upload-avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteContact(id: string) {
    await this.api.delete(`/contacts/${id}`);
  }

  // Events
  async getEvents(start?: string, end?: string) {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;
    const response = await this.api.get('/events', { params });
    return response.data.map((e: any) => ({
      id: e.id.toString(),
      title: e.title,
      start: e.start,
      end: e.end,
      color: e.color,
      type: e.type,
      assigned_users: (e.assigned_users || []).map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        avatar: u.avatar ? `${API_URL}${u.avatar}` : null
      }))
    }));
  }

  async createEvent(event: any) {
    const response = await this.api.post('/events', event);
    const e = response.data;
    return {
      id: e.id.toString(),
      title: e.title,
      start: e.start,
      end: e.end,
      color: e.color,
      type: e.type,
      assigned_users: (e.assigned_users || []).map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        avatar: u.avatar ? `${API_URL}${u.avatar}` : null
      }))
    };
  }

  async updateEvent(id: string, event: any) {
    const response = await this.api.put(`/events/${id}`, event);
    const e = response.data;
    return {
      id: e.id.toString(),
      title: e.title,
      start: e.start,
      end: e.end,
      color: e.color,
      type: e.type,
      assigned_users: (e.assigned_users || []).map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        avatar: u.avatar ? `${API_URL}${u.avatar}` : null
      }))
    };
  }

  async deleteEvent(id: string) {
    await this.api.delete(`/events/${id}`);
  }

  // Folders
  async getFolders() {
    const response = await this.api.get('/folders');
    return response.data.map((f: any) => ({
      id: f.id.toString(),
      name: f.name,
      color: f.color,
      icon: f.icon,
      document_count: parseInt(f.document_count) || 0
    }));
  }

  async createFolder(folder: any) {
    const response = await this.api.post('/folders', folder);
    const f = response.data;
    return {
      id: f.id.toString(),
      name: f.name,
      color: f.color,
      icon: f.icon
    };
  }

  async updateFolder(id: string, folder: any) {
    const response = await this.api.put(`/folders/${id}`, folder);
    const f = response.data;
    return {
      id: f.id.toString(),
      name: f.name,
      color: f.color,
      icon: f.icon
    };
  }

  async deleteFolder(id: string) {
    await this.api.delete(`/folders/${id}`);
  }

  // Documents
  async getDocuments(folderId?: string) {
    const params: any = {};
    if (folderId) params.folderId = folderId;
    const response = await this.api.get('/documents', { params });
    return response.data.map((d: any) => ({
      id: d.id.toString(),
      folderId: d.folder_id ? d.folder_id.toString() : null,
      name: d.name,
      type: d.type,
      dateAdded: d.date_added || d.created_at,
      size: d.size,
      folder_name: d.folder_name || null,
      folder_color: d.folder_color || null
    }));
  }

  async uploadDocument(formData: FormData) {
    const response = await this.api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const d = response.data;
    return {
      id: d.id.toString(),
      folderId: d.folder_id ? d.folder_id.toString() : null,
      name: d.name,
      type: d.type,
      dateAdded: d.date_added || d.created_at,
      size: d.size
    };
  }

  async updateDocument(id: string, document: any) {
    const response = await this.api.put(`/documents/${id}`, document);
    const d = response.data;
    return {
      id: d.id.toString(),
      folderId: d.folder_id ? d.folder_id.toString() : null,
      name: d.name,
      type: d.type,
      dateAdded: d.date_added || d.created_at,
      size: d.size
    };
  }

  async deleteDocument(id: string) {
    await this.api.delete(`/documents/${id}`);
  }

  async downloadDocument(id: string) {
    try {
      const response = await this.api.get(`/documents/${id}/download`, {
        responseType: 'blob'
      });
      
      // Verificar si la respuesta es un error (JSON convertido a blob)
      if (response.data.type && response.data.type.includes('application/json')) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.error || 'Error al descargar el documento');
      }
      
      // Verificar que la respuesta sea un blob válido
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error: any) {
      console.error('Download document error:', error);
      
      // Si es un error de axios con blob de error
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || 'Error al descargar el documento');
        } catch (parseError) {
          throw new Error('Error al descargar el documento');
        }
      }
      
      // Si ya es un Error con mensaje, lanzarlo directamente
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Error al descargar el documento');
    }
  }


  // AI
  async askAssistant(prompt: string, context?: string, conversationHistory?: Array<{ role: string; text: string }>) {
    const response = await this.api.post('/ai/ask', { prompt, context, conversationHistory });
    return response.data;
  }

  async draftEmail(recipient: string, topic: string, tone: 'formal' | 'friendly' = 'formal') {
    const response = await this.api.post('/ai/draft-email', { recipient, topic, tone });
    return response.data.email;
  }

  // Config
  async getConfig() {
    const response = await this.api.get('/config');
    return response.data.data;
  }

  async updateConfig(config: any) {
    const response = await this.api.put('/config', config);
    return response.data.data;
  }

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await this.api.post('/config/upload/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadFavicon(file: File) {
    const formData = new FormData();
    formData.append('favicon', file);
    const response = await this.api.post('/config/upload/favicon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadIcon192(file: File) {
    const formData = new FormData();
    formData.append('icon_192', file);
    const response = await this.api.post('/config/upload/icon-192', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadIcon512(file: File) {
    const formData = new FormData();
    formData.append('icon_512', file);
    const response = await this.api.post('/config/upload/icon-512', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async uploadAppleTouchIcon(file: File) {
    const formData = new FormData();
    formData.append('apple_touch_icon', file);
    const response = await this.api.post('/config/upload/apple-touch-icon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Users (solo admin)
  async getUsers() {
    const response = await this.api.get('/users');
    return response.data.map((u: any) => ({
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    }));
  }

  async getUser(id: string) {
    const response = await this.api.get(`/users/${id}`);
    const u = response.data;
    return {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    };
  }

  async createUser(user: { email: string; password: string; name: string; role?: string }) {
    const response = await this.api.post('/users', user);
    const u = response.data;
    return {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    };
  }

  async updateUser(id: string, user: { email?: string; password?: string; name?: string; role?: string }) {
    const response = await this.api.put(`/users/${id}`, user);
    const u = response.data;
    return {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    };
  }

  async deleteUser(id: string) {
    await this.api.delete(`/users/${id}`);
  }

  // Profile (usuario actual)
  async getProfile() {
    const response = await this.api.get('/profile');
    const u = response.data;
    return {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    };
  }

  async updateProfile(profile: { name?: string; email?: string; password?: string }) {
    const response = await this.api.put('/profile', profile);
    const u = response.data;
    return {
      id: u.id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.created_at
    };
  }

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await this.api.post('/profile/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Notes
  async getNotes() {
    const response = await this.api.get('/notes');
    return response.data.map((n: any) => ({
      id: n.id.toString(),
      title: n.title,
      content: n.content || '',
      color: n.color || '#7c3aed',
      createdAt: n.created_at,
      updatedAt: n.updated_at
    }));
  }

  async getNote(id: string) {
    const response = await this.api.get(`/notes/${id}`);
    const n = response.data;
    return {
      id: n.id.toString(),
      title: n.title,
      content: n.content || '',
      color: n.color || '#7c3aed',
      createdAt: n.created_at,
      updatedAt: n.updated_at
    };
  }

  async createNote(note: { title: string; content?: string; color?: string }) {
    const response = await this.api.post('/notes', note);
    const n = response.data;
    return {
      id: n.id.toString(),
      title: n.title,
      content: n.content || '',
      color: n.color || '#7c3aed',
      createdAt: n.created_at,
      updatedAt: n.updated_at
    };
  }

  async updateNote(id: string, note: { title?: string; content?: string; color?: string }) {
    const response = await this.api.put(`/notes/${id}`, note);
    const n = response.data;
    return {
      id: n.id.toString(),
      title: n.title,
      content: n.content || '',
      color: n.color || '#7c3aed',
      createdAt: n.created_at,
      updatedAt: n.updated_at
    };
  }

  async deleteNote(id: string) {
    await this.api.delete(`/notes/${id}`);
  }

  // Notifications
  async getNotifications() {
    const response = await this.api.get('/notifications');
    return response.data.map((n: any) => ({
      id: n.id.toString(),
      titulo: n.titulo,
      mensaje: n.mensaje,
      tipo: n.tipo,
      relacionado_tipo: n.relacionado_tipo,
      relacionado_id: n.relacionado_id,
      leida: n.leida,
      created_at: n.created_at
    }));
  }

  async markNotificationAsRead(id: string) {
    await this.api.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    await this.api.put('/notifications/read-all');
  }

  async deleteNotification(id: string) {
    await this.api.delete(`/notifications/${id}`);
  }

  // Push Notifications
  async getVapidPublicKey() {
    const response = await this.api.get('/push/public-key');
    return response.data.publicKey;
  }

  async subscribeToPush(subscription: PushSubscription) {
    await this.api.post('/push/subscribe', {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!)
      }
    });
  }

  async unsubscribeFromPush(endpoint: string) {
    await this.api.post('/push/unsubscribe', { endpoint });
  }
}

// Helper function
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const apiService = new ApiService();

