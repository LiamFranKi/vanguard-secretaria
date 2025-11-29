export enum Priority {
  Low = 'Baja',
  Medium = 'Media',
  High = 'Alta',
}

export enum Status {
  Pending = 'Pendiente',
  InProgress = 'En Progreso',
  Completed = 'Completada',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  priority: Priority;
  status: Status;
  assigned_users?: User[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  direccion?: string;
  empresa?: string;
  detalle?: string;
  avatar?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'txt';
  dateAdded: string;
  size: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO Date
  end: string; // ISO Date
  color: string;
  type: 'meeting' | 'reminder' | 'personal';
  assigned_users?: User[];
}

export type ViewState = 'dashboard' | 'calendar' | 'tasks' | 'events' | 'documents' | 'contacts' | 'users' | 'profile' | 'notes';