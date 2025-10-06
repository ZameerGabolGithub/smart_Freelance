import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserSwitcher = () => {
  const { currentUser, switchUser, availableUsers, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleUserSelect = (userKey) => {
    switchUser(userKey);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  const currentUserInfo = availableUsers[currentUser] || { name: 'Default', color: 'gray' };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className={`w-2 h-2 rounded-full bg-${currentUserInfo.color}-500`}></div>
        <span className="text-gray-700">{currentUserInfo.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Switch Account
              </div>
              
              {/* Default option */}
              <button
                onClick={() => handleUserSelect('DEFAULT')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  currentUser === 'DEFAULT' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span>Default</span>
              </button>
              
              {/* Available users */}
              {Object.entries(availableUsers).map(([userKey, userInfo]) => (
                <button
                  key={userKey}
                  onClick={() => handleUserSelect(userKey)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                    currentUser === userKey ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${userInfo.color}-500`}></div>
                  <span>{userInfo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSwitcher;