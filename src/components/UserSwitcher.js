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

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';

// const UserSwitcher = () => {
//   const { currentUser, switchUser, availableUsers, isLoading, token, bidderId } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   const colorClasses = {
//     blue: '#3b82f6',
//     green: '#10b981', 
//     purple: '#8b5cf6',
//     gray: '#6b7280'
//   };

//   const handleUserSelect = (userKey) => {
//     switchUser(userKey);
//     setIsOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <div style={{ 
//         padding: '10px', 
//         background: '#f3f4f6', 
//         borderRadius: '6px', 
//         margin: '10px 0',
//         textAlign: 'center'
//       }}>
//         Loading account configuration...
//       </div>
//     );
//   }

//   if (!availableUsers || Object.keys(availableUsers).length === 0) {
//     return (
//       <div style={{
//         padding: '10px',
//         background: '#fef2f2',
//         border: '1px solid #fecaca',
//         borderRadius: '6px',
//         color: '#dc2626',
//         margin: '10px 0'
//       }}>
//         No accounts configured
//       </div>
//     );
//   }

//   const currentUserData = availableUsers[currentUser] || { name: 'Unknown', color: 'gray' };
//   const currentColor = colorClasses[currentUserData.color] || colorClasses.gray;

//   return (
//     <div style={{ margin: '15px 0' }}>
//       <div style={{
//         background: '#f8fafc',
//         border: '1px solid #e2e8f0',
//         borderRadius: '8px',
//         padding: '12px'
//       }}>
//         {/* Current Account Display */}
//         <div style={{ marginBottom: '10px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
//             <div style={{
//               width: '12px',
//               height: '12px',
//               borderRadius: '50%',
//               background: currentColor
//             }}></div>
//             <span style={{ fontWeight: '600', color: '#1f2937' }}>
//               Active Account: {currentUserData.name}
//             </span>
//             {token && (
//               <span style={{ 
//                 fontSize: '12px', 
//                 color: '#10b981', 
//                 background: '#dcfce7',
//                 padding: '2px 6px',
//                 borderRadius: '4px'
//               }}>
//                 ✓ Connected
//               </span>
//             )}
//           </div>
//           {bidderId && (
//             <div style={{ fontSize: '12px', color: '#6b7280' }}>
//               Bidder ID: {bidderId}
//             </div>
//           )}
//         </div>

//         {/* Account Switcher Dropdown */}
//         <div style={{ position: 'relative' }}>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             style={{
//               width: '100%',
//               padding: '8px 12px',
//               background: 'white',
//               border: '1px solid #d1d5db',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               fontSize: '14px'
//             }}
//           >
//             Switch Account
//             <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
//               ▼
//             </span>
//           </button>

//           {isOpen && (
//             <div style={{
//               position: 'absolute',
//               top: '100%',
//               left: 0,
//               right: 0,
//               background: 'white',
//               border: '1px solid #d1d5db',
//               borderRadius: '6px',
//               marginTop: '4px',
//               zIndex: 1000,
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//             }}>
//               {Object.entries(availableUsers).map(([key, userData]) => (
//                 <button
//                   key={key}
//                   onClick={() => handleUserSelect(key)}
//                   disabled={key === currentUser}
//                   style={{
//                     width: '100%',
//                     padding: '10px 12px',
//                     background: key === currentUser ? '#f3f4f6' : 'white',
//                     border: 'none',
//                     borderBottom: '1px solid #e5e7eb',
//                     cursor: key === currentUser ? 'default' : 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     fontSize: '14px',
//                     textAlign: 'left'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (key !== currentUser) {
//                       e.target.style.background = '#f9fafb';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (key !== currentUser) {
//                       e.target.style.background = 'white';
//                     }
//                   }}
//                 >
//                   <div style={{
//                     width: '10px',
//                     height: '10px',
//                     borderRadius: '50%',
//                     background: colorClasses[userData.color] || colorClasses.gray
//                   }}></div>
//                   <span style={{ 
//                     color: key === currentUser ? '#6b7280' : '#1f2937',
//                     fontWeight: key === currentUser ? '500' : '400'
//                   }}>
//                     {userData.name}
//                     {key === currentUser && ' (Current)'}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Quick Links */}
//         <div style={{ 
//           marginTop: '10px', 
//           fontSize: '12px', 
//           color: '#6b7280',
//           borderTop: '1px solid #e5e7eb',
//           paddingTop: '8px'
//         }}>
//           <div>💡 <strong>Share links:</strong></div>
//           <div>• AHSAN: <code>?user=AHSAN</code></div>
//           <div>• ZAMEER: <code>?user=ZAMEER</code></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSwitcher;


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserSwitcher = () => {
  const { currentUser, switchUser, availableUsers, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    gray: 'bg-gray-500 text-white'
  };

  const handleUserSelect = (userKey) => {
    if (userKey === currentUser) {
      setIsOpen(false);
      return;
    }

    // Show confirmation for page refresh
    setIsConfirming(true);
    const userInfo = availableUsers[userKey];
    const confirmed = window.confirm(
      `🔄 Switch to ${userInfo?.name || userKey}?\n\n` +
      `This will refresh the page to load the new user's configuration.\n\n` +
      `Current user: ${availableUsers[currentUser]?.name || currentUser}\n` +
      `New user: ${userInfo?.name || userKey}\n\n` +
      `Continue?`
    );

    if (confirmed) {
      console.log(`👤 User confirmed switch to ${userKey}`);
      switchUser(userKey);
    } else {
      console.log(`❌ User cancelled switch to ${userKey}`);
    }
    
    setIsConfirming(false);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '8px 16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        ⏳ Loading user config...
      </div>
    );
  }

  const currentUserInfo = availableUsers[currentUser] || { name: currentUser, color: 'gray' };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Current User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConfirming}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isConfirming ? 'wait' : 'pointer',
          opacity: isConfirming ? 0.7 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        <span 
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: 0.8
          }}
        />
        <span>👤 {currentUserInfo.name}</span>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '4px',
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            fontSize: '12px',
            fontWeight: '600',
            color: '#495057'
          }}>
            🔄 Switch User (Page Refresh)
          </div>

          {/* User Options */}
          {Object.entries(availableUsers).map(([key, info]) => (
            <button
              key={key}
              onClick={() => handleUserSelect(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                backgroundColor: key === currentUser ? '#e7f3ff' : 'transparent',
                color: key === currentUser ? '#0056b3' : '#495057',
                border: 'none',
                borderBottom: '1px solid #f1f3f5',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (key !== currentUser) {
                  e.target.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (key !== currentUser) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: key === currentUser ? '#007bff' : '#6c757d'
                  }}
                />
                <span style={{ fontWeight: key === currentUser ? '600' : '400' }}>
                  {info.name}
                </span>
              </div>
              
              {key === currentUser && (
                <span style={{ fontSize: '12px', opacity: 0.8 }}>✓ Active</span>
              )}
            </button>
          ))}

          {/* Footer */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #dee2e6',
            fontSize: '11px',
            color: '#6c757d',
            textAlign: 'center'
          }}>
            💡 Switching users refreshes the page
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserSwitcher;
