import { Task, Contact, DocumentFolder, DocumentFile, CalendarEvent, Priority, Status } from '../types';

// Mock Data Generators
const generateId = () => Math.random().toString(36).substr(2, 9);

const initialTasks: Task[] = [
  { id: '1', title: 'Revisar informe trimestral', priority: Priority.High, status: Status.Pending, date: new Date().toISOString() },
  { id: '2', title: 'Llamar a proveedores', priority: Priority.Medium, status: Status.InProgress, date: new Date().toISOString() },
  { id: '3', title: 'Organizar fiesta de oficina', priority: Priority.Low, status: Status.Completed, date: new Date().toISOString() },
];

const initialContacts: Contact[] = [
  { id: '1', name: 'Dr. Roberto Gómez', email: 'roberto@clinica.com', phone: '+52 555 123 4567', role: 'Director', avatar: 'https://picsum.photos/100/100' },
  { id: '2', name: 'Lic. Ana Torres', email: 'ana@legal.com', phone: '+52 555 987 6543', role: 'Abogada', avatar: 'https://picsum.photos/101/101' },
];

const initialFolders: DocumentFolder[] = [
  { id: 'f1', name: 'Finanzas 2024', color: 'bg-blue-500' },
  { id: 'f2', name: 'Legal', color: 'bg-red-500' },
  { id: 'f3', name: 'Recursos Humanos', color: 'bg-green-500' },
];

const initialFiles: DocumentFile[] = [
  { id: 'd1', folderId: 'f1', name: 'Balance Enero.pdf', type: 'pdf', dateAdded: new Date().toISOString(), size: '2.4 MB' },
  { id: 'd2', folderId: 'f2', name: 'Contrato Arrendamiento.doc', type: 'doc', dateAdded: new Date().toISOString(), size: '1.1 MB' },
];

const initialEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Junta Directiva', start: new Date().toISOString(), end: new Date(new Date().getTime() + 3600000).toISOString(), color: 'bg-indigo-500', type: 'meeting' },
];

// Local Storage Wrappers
const get = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const set = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storageService = {
  getTasks: () => get<Task[]>('tasks', initialTasks),
  saveTasks: (data: Task[]) => set('tasks', data),
  
  getContacts: () => get<Contact[]>('contacts', initialContacts),
  saveContacts: (data: Contact[]) => set('contacts', data),
  
  getFolders: () => get<DocumentFolder[]>('folders', initialFolders),
  saveFolders: (data: DocumentFolder[]) => set('folders', data),

  getFiles: () => get<DocumentFile[]>('files', initialFiles),
  saveFiles: (data: DocumentFile[]) => set('files', data),

  getEvents: () => get<CalendarEvent[]>('events', initialEvents),
  saveEvents: (data: CalendarEvent[]) => set('events', data),
  
  generateId,
};