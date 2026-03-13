
import React, { useState, useMemo } from 'react';
import { X, Search, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (user: User) => void;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({ isOpen, onClose, users, onSelectUser }) => {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return users.filter(u => 
      u.username.toLowerCase().includes(lowerQuery) || 
      (u.displayName && u.displayName.toLowerCase().includes(lowerQuery))
    );
  }, [query, users]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col animate-fade-in-up">
      <div className="p-4 pt-12 border-b border-earth-100 flex items-center gap-3 bg-white">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-earth-50 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-earth-900 focus:outline-none focus:ring-2 focus:ring-earth-900 transition-all placeholder:text-earth-300"
            />
         </div>
         <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-earth-50 rounded-full hover:bg-earth-100 active:scale-95 transition-all"
         >
             <X className="w-5 h-5 text-earth-500" />
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
          {!query && (
              <div className="text-center py-10 opacity-50 flex flex-col items-center">
                  <UserIcon className="w-12 h-12 mb-4 text-earth-300" />
                  <p className="font-bold text-earth-400">Search for friends & sellers</p>
              </div>
          )}

          {query && filteredUsers.length === 0 && (
              <div className="text-center text-earth-400 mt-10 text-sm font-medium">No users found.</div>
          )}
          
          <div className="space-y-2">
              {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => { onSelectUser(user); onClose(); }}
                    className="flex items-center gap-4 p-3 hover:bg-earth-50 rounded-2xl cursor-pointer transition-colors active:scale-[0.98]"
                  >
                      <div className="w-12 h-12 rounded-full p-[2px] bg-earth-100">
                        <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" alt={user.username} />
                      </div>
                      <div>
                          <h4 className="font-bold text-earth-900 text-sm">{user.username}</h4>
                          <p className="text-xs text-earth-500 font-medium">{user.displayName || user.username}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
