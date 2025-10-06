import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthError = () => {
  const { error, availableUsers, loadAuthConfig, switchUser } = useAuth();
  const colorClass = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', gray: 'bg-gray-500' };

  if (!error) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
        </div>

        {/* Available users */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Default account */}
            <button
              onClick={() => switchUser('DEFAULT')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50"
            >
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                <span className="text-sm text-gray-700">Default</span>
              </span>
              <span className="text-xs text-gray-500">Select</span>
            </button>

            {/* Configured users */}
            {Object.entries(availableUsers).map(([userKey, userInfo]) => (
              <button
                key={userKey}
                onClick={() => switchUser(userKey)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50"
              >
                <span className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${colorClass[userInfo.color] || 'bg-gray-500'}`}></span>
                  <span className="text-sm text-gray-700">{userInfo.name}</span>
                </span>
                <span className="text-xs text-gray-500">Select</span>
              </button>
            ))}
          </div>
        </div>


        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={loadAuthConfig} className="btn-primary">Try Again</button>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;