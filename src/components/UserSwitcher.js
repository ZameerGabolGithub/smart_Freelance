// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

// const UserSwitcher = () => {
//   const { currentUser, switchUser, availableUsers, isLoading } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);
//   const colorClass = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', gray: 'bg-gray-500' };
  

//   const handleUserSelect = (userKey) => {
//     switchUser(userKey);
//     setIsOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center space-x-2">
//         <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
//         <span className="text-sm text-gray-600">Loading...</span>
//       </div>
//     );
//   }

//   const currentUserInfo = availableUsers[currentUser] || { name: 'Default', color: 'gray' };

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       >
//         <div className={`w-2 h-2 rounded-full bg-${currentUserInfo.color}-500`}></div>
//         <span className="text-gray-700">{currentUserInfo.name}</span>
//         <svg 
//           className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 z-10" 
//             onClick={() => setIsOpen(false)}
//           ></div>
          
//           {/* Dropdown */}
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
//             <div className="py-1">
//               <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
//                 Switch Account
//               </div>
              
//               {/* Default option */}
//               <button
//                 onClick={() => handleUserSelect('DEFAULT')}
//                 className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
//                   currentUser === 'DEFAULT' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
//                 }`}
//               >
//                 <div className="w-2 h-2 rounded-full bg-gray-500"></div>
//                 <span>Default</span>
//               </button>
              
//               {/* Available users */}
//               {Object.entries(availableUsers).map(([userKey, userInfo]) => (
//                 <button
//                   key={userKey}
//                   onClick={() => handleUserSelect(userKey)}
//                   className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
//                     currentUser === userKey ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
//                   }`}
//                 >
      
//  <div className={`w-2 h-2 rounded-full ${colorClass[userInfo.color] || 'bg-gray-500'}`}></div>
//                   <span>{userInfo.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserSwitcher;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserSwitcher = () => {
  const { currentUser, switchUser, availableUsers, isLoading, token, bidderId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const colorClasses = {
    blue: '#3b82f6',
    green: '#10b981', 
    purple: '#8b5cf6',
    gray: '#6b7280'
  };

  const handleUserSelect = (userKey) => {
    switchUser(userKey);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '10px', 
        background: '#f3f4f6', 
        borderRadius: '6px', 
        margin: '10px 0',
        textAlign: 'center'
      }}>
        Loading account configuration...
      </div>
    );
  }

  if (!availableUsers || Object.keys(availableUsers).length === 0) {
    return (
      <div style={{
        padding: '10px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        color: '#dc2626',
        margin: '10px 0'
      }}>
        No accounts configured
      </div>
    );
  }

  const currentUserData = availableUsers[currentUser] || { name: 'Unknown', color: 'gray' };
  const currentColor = colorClasses[currentUserData.color] || colorClasses.gray;

  return (
    <div style={{ margin: '15px 0' }}>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px'
      }}>
        {/* Current Account Display */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: currentColor
            }}></div>
            <span style={{ fontWeight: '600', color: '#1f2937' }}>
              Active Account: {currentUserData.name}
            </span>
            {token && (
              <span style={{ 
                fontSize: '12px', 
                color: '#10b981', 
                background: '#dcfce7',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                ✓ Connected
              </span>
            )}
          </div>
          {bidderId && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Bidder ID: {bidderId}
            </div>
          )}
        </div>

        {/* Account Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px'
            }}
          >
            Switch Account
            <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </button>

          {isOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginTop: '4px',
              zIndex: 1000,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              {Object.entries(availableUsers).map(([key, userData]) => (
                <button
                  key={key}
                  onClick={() => handleUserSelect(key)}
                  disabled={key === currentUser}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: key === currentUser ? '#f3f4f6' : 'white',
                    border: 'none',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: key === currentUser ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (key !== currentUser) {
                      e.target.style.background = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (key !== currentUser) {
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: colorClasses[userData.color] || colorClasses.gray
                  }}></div>
                  <span style={{ 
                    color: key === currentUser ? '#6b7280' : '#1f2937',
                    fontWeight: key === currentUser ? '500' : '400'
                  }}>
                    {userData.name}
                    {key === currentUser && ' (Current)'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ 
          marginTop: '10px', 
          fontSize: '12px', 
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '8px'
        }}>
          <div>💡 <strong>Share links:</strong></div>
          <div>• AHSAN: <code>?user=AHSAN</code></div>
          <div>• ZAMEER: <code>?user=ZAMEER</code></div>
        </div>
      </div>
    </div>
  );
};

export default UserSwitcher;
