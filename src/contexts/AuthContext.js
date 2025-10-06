import React, { createContext, useContext, useState, useEffect } from 'react';
// import dotenv from 'dotenv'; dotenv.config();

const AuthContext = createContext();

// Static mapping of available user keys (add more as needed)
const AVAILABLE_USERS = {
  AHSAN: { name: 'Zameer', color: 'blue' },
  // BOB: { name: 'Bob', color: 'green' },
  // CHARLIE: { name: 'Charlie', color: 'purple' },
  // Add more users here as you configure them in .env
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bidderId, setBidderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user key from URL params or localStorage
  const getUserKeyFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    // Also check for route pattern /u/:userKey
    const pathMatch = window.location.pathname.match(/^\/u\/([^\/]+)/);
    const routeUser = pathMatch ? pathMatch[1].toUpperCase() : null;
    
    return userParam?.toUpperCase() || routeUser;
  };

const loadAuthConfig = () => {
  try {
    setIsLoading(true);
    setError(null);

    // Debug log to verify environment variables
    console.log('Environment Vbgbgtariables:',  process.env.REACT_APP_TOKEN);

    // Get user key from URL or localStorage
    const urlUserKey = getUserKeyFromUrl();
    const storedUserKey = localStorage.getItem('freelancer_current_user');

    const userKey = urlUserKey || storedUserKey;

    if (!userKey) {
      // No user specified, try default
      // const defaultToken = (import.meta.env && import.meta.env.VITE_DEFAULT_TOKEN) || 'fallback_default_token';
      // const defaultBidder = (import.meta.env && import.meta.env.VITE_DEFAULT_BIDDER) || 'fallback_default_bidder';
const defaultToken = process.env.REACT_APP_TOKEN
const defaultBidder = process.env.REACT_APP_BIDDER
      if (defaultToken && defaultBidder) {
        setToken(defaultToken);
        setBidderId(parseInt(defaultBidder, 10));
        setCurrentUser('DEFAULT');
        localStorage.setItem('freelancer_current_user', 'DEFAULT');
        console.log('Using default token configuration');
      } else {
        setError('No user specified and no default token configured');
      }
      return;
    }

    // Check if user key is valid
    if (!AVAILABLE_USERS[userKey] && userKey !== 'DEFAULT') {
      setError(`Unknown user: ${userKey}. Available users: ${Object.keys(AVAILABLE_USERS).join(', ')}`);
      return;
    }

    // Get token and bidder ID for the user
    const userToken = process.env.REACT_APP_TOKEN;
    const userBidder = process.env.REACT_APP_BIDDER;

    if (!userToken || !userBidder) {
      setError(`Missing configuration for user: ${userKey}. Please check your .env file.`);
      return;
    }

    // Set auth state
    setToken(userToken);
    setBidderId(parseInt(userBidder, 10));
    setCurrentUser(userKey);

    // Store in localStorage
    localStorage.setItem('freelancer_current_user', userKey);
    localStorage.setItem('freelancer_token', userToken);
    localStorage.setItem('freelancer_bidder_id', userBidder);

    console.log(`Authenticated as ${userKey} (${AVAILABLE_USERS[userKey]?.name || 'Default'})`);
  } catch (err) {
    console.error('Error loading auth config:', err);
    setError('Failed to load authentication configuration');
  } finally {
    setIsLoading(false);
  }
};

  // Switch to a different user
  const switchUser = (userKey) => {
    if (!userKey || userKey === currentUser) return;
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('user', userKey);
    window.history.pushState({}, '', url);
    
    // Reload auth config
    loadAuthConfig();
  };

  // Load auth on mount and when URL changes
  useEffect(() => {
    loadAuthConfig();
    
    // Listen for URL changes (back/forward navigation)
    const handlePopState = () => {
      loadAuthConfig();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const value = {
    currentUser,
    token,
    bidderId,
    isLoading,
    error,
    switchUser,
    availableUsers: AVAILABLE_USERS,
    loadAuthConfig
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};