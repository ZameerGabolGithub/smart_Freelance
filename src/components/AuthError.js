import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthError = () => {
  const { error, availableUsers, loadAuthConfig } = useAuth();

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
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-600">Default</span>
            </div>
            {Object.entries(availableUsers).map(([userKey, userInfo]) => (
              <div key={userKey} className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-${userInfo.color}-500`}></div>
                <span className="text-sm text-gray-600">{userInfo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage instructions */}
        {/* <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2">How to use:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Add <code className="bg-gray-200 px-1 rounded">?user=ALICE</code> to URL</li>
            <li>• Or use route <code className="bg-gray-200 px-1 rounded">/u/ALICE</code></li>
            <li>• Configure tokens in .env as <code className="bg-gray-200 px-1 rounded">VITE_TOKEN_ALICE</code></li>
          </ul>
        </div> */}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={loadAuthConfig}
            className="btn-primary"
          >
            Try Again
          </button>
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