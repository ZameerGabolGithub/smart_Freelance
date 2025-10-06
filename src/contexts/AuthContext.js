// import React, { createContext, useContext, useState, useEffect } from 'react';
// // import dotenv from 'dotenv'; dotenv.config();

// const AuthContext = createContext();

// // Static mapping of available user keys (add more as needed)
// const AVAILABLE_USERS = {
//   AHSAN: { name: 'Zameer', color: 'blue' },
//   // BOB: { name: 'Bob', color: 'green' },
//   // CHARLIE: { name: 'Charlie', color: 'purple' },
//   // Add more users here as you configure them in .env
// };

// // Resolve env vars for a given userKey (CRA: REACT_APP_* keys)
// const resolveCredsForUser = (userKey) => {
//   const key = (userKey || '').toUpperCase();
//   if (key === 'DEFAULT') {
//     return {
//       token: process.env.REACT_APP_DEFAULT_TOKEN,
//       bidderId: process.env.REACT_APP_DEFAULT_BIDDER ? parseInt(process.env.REACT_APP_DEFAULT_BIDDER, 10) : null,
//     };
//   }
//   return {
//     token: process.env[`REACT_APP_TOKEN_${key}`],
//     bidderId: process.env[`REACT_APP_BIDDER_${key}`] ? parseInt(process.env[`REACT_APP_BIDDER_${key}`], 10) : null,
//   };
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [bidderId, setBidderId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Get user key from URL params or localStorage
//   const getUserKeyFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const userParam = urlParams.get('user');
    
//     // Also check for route pattern /u/:userKey
//     const pathMatch = window.location.pathname.match(/^\/u\/([^\/]+)/);
//     const routeUser = pathMatch ? pathMatch[1].toUpperCase() : null;
    
//     return userParam?.toUpperCase() || routeUser;
//   };

// const loadAuthConfig = () => {
//   try {
//     setIsLoading(true);
//     setError(null);

//     // Debug log to verify environment variables
//     console.log('Environment Variables:',  process.env.REACT_APP_DEFAULT_TOKEN);

//     // Get user key from URL or localStorage
//     const urlUserKey = getUserKeyFromUrl();
//     const storedUserKey = localStorage.getItem('freelancer_current_user');

//     const userKey = urlUserKey || storedUserKey;

//     if (!userKey) {
//       // No user specified, try default
//       const creds = resolveCredsForUser('DEFAULT');
//       if (creds.token && creds.bidderId) {
//         setToken(creds.token);
//         setBidderId(creds.bidderId);
//         setCurrentUser('DEFAULT');
//         localStorage.setItem('freelancer_current_user', 'DEFAULT');
//         localStorage.setItem('freelancer_token', creds.token);
//         localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
//         console.log('Using default token configuration');
//       } else {
//         setError('No user specified and no default token configured');
//       }
//       return;
//     }

//     // Check if user key is valid
//     if (!AVAILABLE_USERS[userKey] && userKey !== 'DEFAULT') {
//       setError(`Unknown user: ${userKey}. Available users: ${Object.keys(AVAILABLE_USERS).join(', ')}`);
//       return;
//     }

//     // Resolve creds for the given userKey
//     const { token: userToken, bidderId: userBidder } = resolveCredsForUser(userKey);

//     if (!userToken || !userBidder) {
//       setError(`Missing configuration for user: ${userKey}. Please check your .env file.`);
//       return;
//     }

//     // Set auth state
//     setToken(userToken);
//     setBidderId(userBidder);
//     setCurrentUser(userKey);

//     // Store in localStorage
//     localStorage.setItem('freelancer_current_user', userKey);
//     localStorage.setItem('freelancer_token', userToken);
//     localStorage.setItem('freelancer_bidder_id', String(userBidder));

//     console.log(`Authenticated as ${userKey} (${AVAILABLE_USERS[userKey]?.name || 'Default'})`);
//   } catch (err) {
//     console.error('Error loading auth config:', err);
//     setError('Failed to load authentication configuration');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // Switch to a different user (immediate state update)
//   const switchUser = (userKey) => {
//     const key = (userKey || '').toUpperCase();
//     if (!key || key === currentUser) return;

//     // Validate key
//     if (!AVAILABLE_USERS[key] && key !== 'DEFAULT') {
//       setError(`Unknown user: ${key}. Available users: ${Object.keys(AVAILABLE_USERS).join(', ')}`);
//       return;
//     }

//     // Resolve creds
//     const { token: nextToken, bidderId: nextBidder } = resolveCredsForUser(key);
//     if (!nextToken || !nextBidder) {
//       setError(`Missing configuration for user: ${key}. Please check your .env file.`);
//       return;
//     }

//     // Update URL without reload
//     const url = new URL(window.location.href);
//     url.searchParams.set('user', key);
//     window.history.pushState({}, '', url);

//     // Update state and storage immediately
//     setError(null);
//     setToken(nextToken);
//     setBidderId(nextBidder);
//     setCurrentUser(key);
//     localStorage.setItem('freelancer_current_user', key);
//     localStorage.setItem('freelancer_token', nextToken);
//     localStorage.setItem('freelancer_bidder_id', String(nextBidder));
//   };

//   // Load auth on mount and when URL changes
//   useEffect(() => {
//     loadAuthConfig();
    
//     // Listen for URL changes (back/forward navigation)
//     const handlePopState = () => {
//       loadAuthConfig();
//     };
    
//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, []);

//   const value = {
//     currentUser,
//     token,
//     bidderId,
//     isLoading,
//     error,
//     switchUser,
//     availableUsers: AVAILABLE_USERS,
//     loadAuthConfig
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseAuthService from '../services/firebaseAuth';

const AuthContext = createContext();

// Multi-account: declare available user keys shown in the switcher
const AVAILABLE_USERS = {
  DEFAULT: { name: 'Default', color: 'gray' },
  AHSAN: { name: 'Ahsan', color: 'blue' },
  ZUBAIR: { name: 'Zubair', color: 'green' }, 
};

// IMPORTANT for CRA: env variables are statically inlined.
// Build explicit maps so Webpack can replace values at build time.
const TOKENS = {
  DEFAULT: process.env.REACT_APP_DEFAULT_TOKEN,
  AHSAN: process.env.REACT_APP_TOKEN_AHSAN,
  ZUBAIR: process.env.REACT_APP_TOKEN_ZUBAIR,
};

const BIDDERS = {
  DEFAULT: process.env.REACT_APP_DEFAULT_BIDDER,
  AHSAN: process.env.REACT_APP_BIDDER_AHSAN,
  ZUBAIR: process.env.REACT_APP_BIDDER_ZUBAIR,
};

// Resolve token/bidder from the maps above for a given key
const resolveCredsForUser = (keyRaw) => {
  const key = (keyRaw || 'DEFAULT').toUpperCase();
  const token = TOKENS[key] || null;
  const bidderEnv = BIDDERS[key];
  const bidderId = bidderEnv ? parseInt(bidderEnv, 10) : null;
  return { token, bidderId };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Multi-account token state
  const [currentUserKey, setCurrentUserKey] = useState('DEFAULT');
  const [apiToken, setApiToken] = useState(null);
  const [apiBidderId, setApiBidderId] = useState(null);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is logged in, get additional data
          const userDataResult = await firebaseAuthService.getCurrentUserData(firebaseUser.uid);
          
          if (userDataResult.success) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              ...userDataResult.userData
            });
          } else {
            // Fallback if Firestore data not found
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              preferences: {
                skills: [],
                minBudget: 50,
                maxBudget: 2000,
                autoStart: false,
                maxBidsPerDay: 10
              }
            });
          }
        } else {
          // User is logged out
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Initialize multi-account from URL/localStorage
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const urlKey = url.searchParams.get('user');
      const storedKey = localStorage.getItem('freelancer_current_user');
      const key = (urlKey || storedKey || 'DEFAULT').toUpperCase();
      const creds = resolveCredsForUser(key);
      if (creds.token && creds.bidderId) {
        setCurrentUserKey(key);
        setApiToken(creds.token);
        setApiBidderId(creds.bidderId);
        localStorage.setItem('freelancer_current_user', key);
        localStorage.setItem('freelancer_token', creds.token);
        localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
      } else {
        // keep DEFAULT but expose error for visibility
        setError(`Missing configuration for user: ${key}. Check .env variables.`);
      }
    } catch (e) {
      // ignore
    }
    // React to browser navigation changing ?user=
    const handlePop = () => {
      try {
        const u = new URL(window.location.href);
        const nextKey = (u.searchParams.get('user') || 'DEFAULT').toUpperCase();
        if (nextKey !== currentUserKey) {
          const creds = resolveCredsForUser(nextKey);
          if (creds.token && creds.bidderId) {
            setError(null);
            setCurrentUserKey(nextKey);
            setApiToken(creds.token);
            setApiBidderId(creds.bidderId);
            localStorage.setItem('freelancer_current_user', nextKey);
            localStorage.setItem('freelancer_token', creds.token);
            localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
          } else {
            setError(`Missing configuration for user: ${nextKey}. Check .env variables.`);
          }
        }
      } catch {}
    };
    window.addEventListener('popstate', handlePop);
    window.addEventListener('hashchange', handlePop);

    // Cross-tab storage sync
    const handleStorage = (e) => {
      if (e.key === 'freelancer_current_user' && e.newValue) {
        const nextKey = (e.newValue || 'DEFAULT').toUpperCase();
        if (nextKey !== currentUserKey) {
          const creds = resolveCredsForUser(nextKey);
          if (creds.token && creds.bidderId) {
            setError(null);
            setCurrentUserKey(nextKey);
            setApiToken(creds.token);
            setApiBidderId(creds.bidderId);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('hashchange', handlePop);
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUserKey]);

  const register = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await firebaseAuthService.register(email, password, name);
      
      if (!result.success) {
        setError(result.error);
        return result;
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await firebaseAuthService.login(email, password);
      
      if (!result.success) {
        setError(result.error);
        return result;
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const result = await firebaseAuthService.logout();
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const result = await firebaseAuthService.resetPassword(email);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      if (!user) return { success: false, error: "User not authenticated" };
      
      setError(null);
      const result = await firebaseAuthService.updateUserPreferences(user.uid, preferences);
      
      if (result.success) {
        // Update local user state
        setUser(prevUser => ({
          ...prevUser,
          preferences: preferences
        }));
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Expose switcher for multi-account selection
  const switchUser = (keyRaw) => {
    const key = (keyRaw || '').toUpperCase();
    if (!key || key === currentUserKey) return;
    if (!AVAILABLE_USERS[key] && key !== 'DEFAULT') {
      setError(`Unknown user: ${key}. Available: ${Object.keys(AVAILABLE_USERS).join(', ')}`);
      return;
    }
    const creds = resolveCredsForUser(key);
    if (!creds.token || !creds.bidderId) {
      setError(`Missing configuration for user: ${key}. Add REACT_APP_TOKEN_${key} and REACT_APP_BIDDER_${key}`);
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('user', key);
    window.history.pushState({}, '', url);
    setError(null);
    setCurrentUserKey(key);
    setApiToken(creds.token);
    setApiBidderId(creds.bidderId);
    localStorage.setItem('freelancer_current_user', key);
    localStorage.setItem('freelancer_token', creds.token);
    localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    resetPassword,
    updatePreferences,
    clearError,
    // Multi-account API credentials
    token: apiToken,
    bidderId: apiBidderId,
    currentUser: currentUserKey,
    switchUser,
    availableUsers: AVAILABLE_USERS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
