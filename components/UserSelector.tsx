import React, { useState, useEffect } from 'react';
import { Users, X, Search, Check } from 'lucide-react';
import { apiService } from '../services/apiService';
import { User } from '../types';

interface UserSelectorProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  currentUserId?: string; // Para excluir al usuario actual si es necesario
}

export const UserSelector: React.FC<UserSelectorProps> = ({ selectedUsers, onUsersChange, currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await apiService.getUsers();
      // Filtrar usuario actual si se proporciona
      const filteredUsers = currentUserId 
        ? allUsers.filter(u => u.id !== currentUserId)
        : allUsers;
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (user: User) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      onUsersChange(selectedUsers.filter(u => u.id !== user.id));
    } else {
      onUsersChange([...selectedUsers, user]);
    }
  };

  const removeUser = (userId: string) => {
    onUsersChange(selectedUsers.filter(u => u.id !== userId));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Asignar a usuarios
      </label>
      
      {/* Usuarios seleccionados */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-medium"
            >
              {user.avatar ? (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${user.avatar}`}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ${user.avatar ? 'hidden' : ''}`}
              >
                {getInitials(user.name)}
              </div>
              <span>{user.name}</span>
              <button
                onClick={() => removeUser(user.id)}
                className="ml-1 hover:bg-violet-200 rounded p-0.5 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón para abrir selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition flex items-center justify-center gap-2 text-slate-600 hover:text-violet-700"
      >
        <Users className="w-5 h-5" />
        <span className="font-medium">
          {selectedUsers.length > 0 
            ? `${selectedUsers.length} usuario${selectedUsers.length > 1 ? 's' : ''} seleccionado${selectedUsers.length > 1 ? 's' : ''}`
            : 'Seleccionar usuarios'}
        </span>
      </button>

      {/* Dropdown de usuarios */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-[9999] w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-slate-200 max-h-80 overflow-hidden flex flex-col">
            {/* Buscador */}
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lista de usuarios */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-2"></div>
                  Cargando usuarios...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No se encontraron usuarios
                </div>
              ) : (
                <div className="p-2">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some(u => u.id === user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser(user)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                          isSelected
                            ? 'bg-violet-50 text-violet-700'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${user.avatar}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ${user.avatar ? 'hidden' : ''}`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

