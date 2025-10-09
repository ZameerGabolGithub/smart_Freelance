// import React, { createContext, useContext, useState, useEffect } from 'react';
// import firebaseAuthService from '../services/firebaseAuth';

// const AuthContext = createContext();

// // Multi-account: declare available user keys shown in the switcher
// const AVAILABLE_USERS = {
//   DEFAULT: { name: 'Default', color: 'gray' },
//   AHSAN: { name: 'Ahsan', color: 'blue' },
//   ZAMEER: { name: 'Zameer', color: 'green' },
// };

// // IMPORTANT: For Create React App, environment variables must be prefixed with REACT_APP_
// // Build explicit maps so Webpack can replace values at build time
// const TOKENS = {
//   DEFAULT: process.env.REACT_APP_DEFAULT_TOKEN,
//   AHSAN: process.env.REACT_APP_TOKEN_AHSAN,
//   ZAMEER: process.env.REACT_APP_TOKEN_ZAMEER,
//   // CHARLIE: process.env.REACT_APP_TOKEN_CHARLIE,
// };

// const BIDDERS = {
//   DEFAULT: process.env.REACT_APP_DEFAULT_BIDDER,
//   AHSAN: process.env.REACT_APP_BIDDER_AHSAN,
//   ZAMEER: process.env.REACT_APP_BIDDER_ZAMEER,
//   // CHARLIE: process.env.REACT_APP_BIDDER_CHARLIE,
// };

// // Resolve token/bidder from the maps above for a given key
// const resolveCredsForUser = (keyRaw) => {
//   const key = (keyRaw || 'DEFAULT').toUpperCase();
//   const token = TOKENS[key] || null;
//   const bidderEnv = BIDDERS[key];
//   const bidderId = bidderEnv ? parseInt(bidderEnv, 10) : null;
  
//   console.log(`Resolving creds for ${key}:`, { token: token ? 'FOUND' : 'MISSING', bidderId });
  
//   return { token, bidderId };
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   // Firebase user state
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Multi-account token state
//   const [currentUser, setCurrentUser] = useState('DEFAULT');
//   const [token, setToken] = useState(null);
//   const [bidderId, setBidderId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Firebase auth state listener
//   useEffect(() => {
//     const unsubscribe = firebaseAuthService.onAuthStateChange(async (firebaseUser) => {
//       try {
//         if (firebaseUser) {
//           // User is logged in, get additional data
//           const userDataResult = await firebaseAuthService.getCurrentUserData(firebaseUser.uid);
          
//           if (userDataResult.success) {
//             setUser({
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               name: firebaseUser.displayName,
//               ...userDataResult.userData
//             });
//           } else {
//             // Fallback if Firestore data not found
//             setUser({
//               uid: firebaseUser.uid,
//               email: firebaseUser.email,
//               name: firebaseUser.displayName,
//               preferences: {
//                 skills: [],
//                 minBudget: 50,
//                 maxBudget: 2000,
//                 autoStart: false,
//                 maxBidsPerDay: 10
//               }
//             });
//           }
//         } else {
//           // User is logged out
//           setUser(null);
//         }
//       } catch (error) {
//         console.error('Auth state change error:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return unsubscribe;
//   }, []);

//   // Get user key from URL params or localStorage
//   const getUserKeyFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const userParam = urlParams.get('user');
//     return userParam?.toUpperCase() || null;
//   };

//   // Initialize multi-account from localStorage on app startup
//   useEffect(() => {
//     const loadTokenConfig = () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         // Get user key from localStorage first (page refresh approach)
//         const storedKey = localStorage.getItem('freelancer_current_user');
//         const urlKey = getUserKeyFromUrl();
//         const key = (storedKey || urlKey || 'DEFAULT').toUpperCase();

//         console.log('🚀 App startup - Loading token config for:', key);
//         console.log('📋 Available tokens:', Object.keys(TOKENS).filter(k => TOKENS[k]));

//         const creds = resolveCredsForUser(key);

//         if (creds.token && creds.bidderId) {
//           setCurrentUser(key);
//           setToken(creds.token);
//           setBidderId(creds.bidderId);
          
//           // Sync localStorage
//           localStorage.setItem('freelancer_current_user', key);
//           localStorage.setItem('freelancer_token', creds.token);
//           localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
          
//           // Update URL if needed
//           if (urlKey !== key.toLowerCase()) {
//             const url = new URL(window.location.href);
//             url.searchParams.set('user', key.toLowerCase());
//             window.history.replaceState({}, '', url);
//           }
          
//           console.log(`✅ Loaded config for ${key}: ${AVAILABLE_USERS[key]?.name || 'Unknown'}`);
//         } else {
//           setError(`❌ Missing configuration for user: ${key}. Check .env file for REACT_APP_TOKEN_${key} and REACT_APP_BIDDER_${key}`);
//           console.error('Missing config for:', key, creds);
//         }
//       } catch (e) {
//         console.error('Error loading token config:', e);
//         setError('Failed to load token configuration');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadTokenConfig();
//   }, []);

//   // Firebase auth methods
//   const register = async (email, password, name) => {
//     try {
//       setError(null);
//       setLoading(true);
//       const result = await firebaseAuthService.register(email, password, name);
//       if (!result.success) {
//         setError(result.error);
//       }
//       return result;
//     } catch (error) {
//       setError(error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };



//   const clearError = () => {
//     setError(null);
//   };

//   // 🔄 FIXED: Page refresh approach for user switching
//   const switchUser = (keyRaw) => {
//     const key = (keyRaw || '').toUpperCase();
    
//     if (!key || key === currentUser) {
//       console.log('⏭️ Same user or invalid key, skipping switch');
//       return;
//     }

//     console.log(`🔄 Switching from ${currentUser} to ${key} with page refresh`);

//     if (!AVAILABLE_USERS[key]) {
//       const availableKeys = Object.keys(AVAILABLE_USERS).join(', ');
//       setError(`Unknown user: ${key}. Available: ${availableKeys}`);
//       return;
//     }

//     const creds = resolveCredsForUser(key);
//     if (!creds.token || !creds.bidderId) {
//       setError(`Missing configuration for ${key}. Add REACT_APP_TOKEN_${key} and REACT_APP_BIDDER_${key} to your .env file`);
//       return;
//     }

//     // Update localStorage BEFORE refresh
//     localStorage.setItem('freelancer_current_user', key);
//     localStorage.setItem('freelancer_token', creds.token);
//     localStorage.setItem('freelancer_bidder_id', String(creds.bidderId));
    
//     // Update URL and refresh page
//     const url = new URL(window.location.href);
//     url.searchParams.set('user', key.toLowerCase());
    
//     console.log(`🔄 Refreshing page with new user: ${key}`);
    
//     // Trigger full page reload to reinitialize everything
//     window.location.href = url.toString();
//   };

//   const value = {
//     // Firebase auth
//     user,
//     loading,
//     error,
//     isAuthenticated: !!user,
//     register,
//     login,
//     logout,
//     clearError,

//     // Multi-account API credentials
//     token,
//     bidderId,
//     currentUser,
//     switchUser,
//     availableUsers: AVAILABLE_USERS,
//     isLoading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
// import React, { createContext, useContext, useState } from 'react';
import firebaseAuthService from '../services/firebaseAuth';

const AuthContext = createContext();


const AVAILABLE_USERS = {
  DEFAULT: { name: 'Default', color: 'gray' },
  AHSAN: { name: 'Ahsan', color: 'blue' },
  ZAMEER: { name: 'Zameer', color: 'green' },
};

const TOKENS = {
  DEFAULT: process.env.REACT_APP_DEFAULT_TOKEN,
  AHSAN: process.env.REACT_APP_TOKEN_AHSAN,
  ZAMEER: process.env.REACT_APP_TOKEN_ZAMEER,
};

const BIDDERS = {
  DEFAULT: process.env.REACT_APP_DEFAULT_BIDDER,
  AHSAN: process.env.REACT_APP_BIDDER_AHSAN,
  ZAMEER: process.env.REACT_APP_BIDDER_ZAMEER,
};

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);
//       const result = await firebaseAuthService.login(email, password);
//       if (!result.success) {
//         setError(result.error);
//       }
//       return result;
//     } catch (error) {
//       setError(error.message);
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setError(null);
//       const result = await firebaseAuthService.logout();
//       if (!result.success) {
//         setError(result.error);
//       }
//       return result;
//     } catch (error) {
//       setError(error.message);
//       return { success: false, error: error.message };
//     }
//   };
const resolveCredsForUser = (keyRaw) => {
  const key = (keyRaw || 'DEFAULT').toUpperCase();
  const token = TOKENS[key] || null;
  const bidderEnv = BIDDERS[key];
  const bidderId = bidderEnv ? parseInt(bidderEnv, 10) : null;

  if (!token || !bidderId) {
    console.error(`Missing credentials for user: ${key}`);
  }

  return { token, bidderId };
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState('DEFAULT');
  const [token, setToken] = useState(null);
  const [bidderId, setBidderId] = useState(null);

    const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await firebaseAuthService.login(email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const creds = resolveCredsForUser(currentUser);
    setToken(creds.token);
    setBidderId(creds.bidderId);
  }, [currentUser]);

  const switchUser = (userKey) => {
    const key = (userKey || 'DEFAULT').toUpperCase();
    if (!AVAILABLE_USERS[key]) {
      console.error(`Unknown user: ${key}`);
      return;
    }
    setCurrentUser(key);
  };

  const value = {
    currentUser,
    token,
    bidderId,
    login,
    switchUser,
    availableUsers: AVAILABLE_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { resolveCredsForUser };
