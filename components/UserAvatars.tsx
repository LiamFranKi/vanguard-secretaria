import React from 'react';
import { User } from '../types';

interface UserAvatarsProps {
  users: User[];
  maxVisible?: number;
}

export const UserAvatars: React.FC<UserAvatarsProps> = ({ users, maxVisible = 3 }) => {
  if (!users || users.length === 0) return null;

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-1.5 -space-x-2">
      {visibleUsers.map((user) => (
        <div
          key={user.id}
          className="relative group"
        >
          {user.avatar ? (
            <img
              src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.PROD ? '' : 'http://localhost:5000'}${user.avatar}`}
              alt={user.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm hover:scale-110 transition-transform cursor-pointer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-110 transition-transform cursor-pointer ${user.avatar ? 'hidden' : ''}`}
          >
            {getInitials(user.name)}
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {user.name}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="relative group">
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shadow-sm hover:scale-110 transition-transform cursor-pointer">
            +{remainingCount}
          </div>
          {/* Tooltip con todos los nombres restantes - uno por línea */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-max">
            <div className="space-y-1">
              {users.slice(maxVisible).map((u, idx) => (
                <div key={u.id} className={idx > 0 ? 'border-t border-slate-700 pt-1 mt-1' : ''}>
                  {u.name}
                </div>
              ))}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

