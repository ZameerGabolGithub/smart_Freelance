import React from 'react';

/**
 * FetchButton component - button to fetch recent projects
 */
const FetchButton = ({ onFetch, loading, error, onRetry }) => {
  const handleClick = () => {
    if (error && onRetry) {
      onRetry();
    } else {
      onFetch();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main fetch button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`btn-primary flex items-center space-x-3 ${loading ? 'cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <>
            <div className="loading-spinner !h-5 !w-5 !border-white"></div>
            <span>Fetching Projects...</span>
          </>
        ) : error ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Retry Fetch</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Fetch Recent Projects</span>
          </>
        )}
      </button>

      {/* Info text */}
      <div className="text-center max-w-md">
        {/* <p className="text-gray-600 text-sm">
          Fetches projects from the last 5 minutes matching: 
          <span className="font-medium text-gray-800"> Full Stack Development</span>
        </p> */}
        {/* <p className="text-gray-500 text-xs mt-1">
          Results are cached locally for offline viewing
        </p> */}
      </div>

      {/* Error display with retry option */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Fetch Failed</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button
                onClick={onRetry}
                className="text-red-700 hover:text-red-800 text-sm font-medium mt-2 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchButton;