// import { useState, useCallback, useEffect } from 'react';
// import axios from 'axios';
// import { API_CONFIG, buildQueryParams, STORAGE_KEYS, isProjectNew, NEW_THRESHOLD_SECONDS } from '../utils/apiUtils';
// import { getUnixTimestamp } from '../utils/dateUtils';

// /**
//  * Custom hook for Freelancer API operations
//  */
// export const useFreelancerAPI = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   // New: track last fetch time (ms epoch)
//   const [lastFetchTime, setLastFetchTime] = useState(
//     (() => {
//       const saved = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
//       return saved ? parseInt(saved, 10) : null;
//     })()
//   );

//   /**
//    * Load projects from localStorage
//    */
//   const loadProjectsFromStorage = useCallback(() => {
//     try {
//       const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
//       if (storedProjects) {
//         const parsedProjects = JSON.parse(storedProjects);
//         setProjects(parsedProjects);
//         const savedFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
//         if (savedFetch) setLastFetchTime(parseInt(savedFetch, 10));
//         return parsedProjects;
//       }
//     } catch (error) {
//       console.error('Error loading projects from storage:', error);
//     }
//     return [];
//   }, []);

//   /**
//    * Save projects to localStorage
//    */
//   const saveProjectsToStorage = useCallback((projectsData) => {
//     try {
//       localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsData));
//       const nowMs = Date.now();
//       localStorage.setItem(STORAGE_KEYS.LAST_FETCH, nowMs.toString());
//       setLastFetchTime(nowMs);
//     } catch (error) {
//       console.error('Error saving projects to storage:', error);
//     }
//   }, []);

//   /**
//    * Fetch recent projects from Freelancer API
//    */
//   const fetchRecentProjects = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Calculate from_time (current time - 5 minutes)
//       const fromTime = getUnixTimestamp(300); // 300 seconds = 5 minutes

//       // Build query parameters
//       const params = {
//         ...API_CONFIG.DEFAULT_PARAMS,
//         from_time: fromTime
//       };

//       const queryString = buildQueryParams(params);
//       const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACTIVE_PROJECTS}?${queryString}`;

//       console.log('Fetching projects from:', url);

//       const response = await axios.get(url, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         timeout: 10000, // 10 second timeout
//       });

//       if (response.data && response.data.result && response.data.result.projects) {
//         const projectsData = response.data.result.projects || [];

//         // Filter for USD projects only
//         const usdProjects = projectsData.filter(project => 
//           project.currency && project.currency.code === 'USD'
//         );

//         // Sort with "new" first (<= 60s old based on submitdate vs now)
//         const nowUnix = Math.floor(Date.now() / 1000);
//         const sorted = [...usdProjects].sort((a, b) => {
//           const aNew = isProjectNew(a.submitdate, nowUnix);
//           const bNew = isProjectNew(b.submitdate, nowUnix);
//           if (aNew && !bNew) return -1;
//           if (!aNew && bNew) return 1;
//           // fallback to submitdate desc
//           return (b.submitdate || 0) - (a.submitdate || 0);
//         });

//         setProjects(sorted);
//         saveProjectsToStorage(sorted);

//         console.log(`Successfully fetched ${sorted.length} USD projects (filtered from ${projectsData.length} total)`);
//         return sorted;
//       } else {
//         throw new Error('Invalid response format from API');
//       }
//     } catch (err) {
//       console.error('Error fetching projects:', err);
      
//       let errorMessage = 'Failed to fetch projects';
      
//       if (err.code === 'ECONNABORTED') {
//         errorMessage = 'Request timeout - please try again';
//       } else if (err.response) {
//         errorMessage = `API Error: ${err.response.status} - ${err.response.statusText}`;
//       } else if (err.request) {
//         errorMessage = 'Network error - please check your connection';
//       } else {
//         errorMessage = err.message || 'Unknown error occurred';
//       }
      
//       setError(errorMessage);
      
//       const storedProjects = loadProjectsFromStorage();
//       if (storedProjects.length > 0) {
//         console.log('Loaded projects from storage as fallback');
//       }
      
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [loadProjectsFromStorage, saveProjectsToStorage]);

//   /**
//    * Clear error state
//    */
//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   /**
//    * Retry fetch operation
//    */
//   const retryFetch = useCallback(async () => {
//     clearError();
//     return await fetchRecentProjects();
//   }, [clearError, fetchRecentProjects]);

//   // New: auto-fetch every 5 minutes, and cleanup on unmount
//   // New: auto-fetch every 5 minutes, and cleanup on unmount
//   useEffect(() => {
//     // initial load if empty
//     loadProjectsFromStorage();
    
//     const interval = setInterval(() => {
//       fetchRecentProjects().catch(() => {});
//     }, 30000); // 5 minutes (300000ms)
    
//     return () => clearInterval(interval);
//   }, [fetchRecentProjects, loadProjectsFromStorage]); // Remove 'projects' from dependencies
//   // New: derive counts for New vs Old
//   const nowUnix = Math.floor(Date.now() / 1000);
//   const newProjects = projects.filter(p => isProjectNew(p.submitdate, nowUnix));
//   const oldProjects = projects.filter(p => !isProjectNew(p.submitdate, nowUnix));

//   return {
//     projects,
//     loading,
//     error,
//     fetchRecentProjects,
//     loadProjectsFromStorage,
//     clearError,
//     retryFetch,
//     // New exposures
//     lastFetchTime,
//     newCount: newProjects.length,
//     oldCount: oldProjects.length,
//     newThresholdSeconds: NEW_THRESHOLD_SECONDS,
//   };
// };

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, buildQueryParams, STORAGE_KEYS, isProjectNew, NEW_THRESHOLD_SECONDS } from '../utils/apiUtils';
import { getUnixTimestamp } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for Freelancer API operations with dynamic token support
 */
export const useFreelancerAPI = () => {
  const { token, bidderId, currentUser } = useAuth(); // Get dynamic token from AuthContext
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track last fetch time (ms epoch)
  const [lastFetchTime, setLastFetchTime] = useState(
    (() => {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
      return saved ? parseInt(saved, 10) : null;
    })()
  );

  /**
   * Load projects from localStorage
   */
  const loadProjectsFromStorage = useCallback(() => {
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
        const savedFetch = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
        if (savedFetch) setLastFetchTime(parseInt(savedFetch, 10));
        return parsedProjects;
      }
    } catch (error) {
      console.error('Error loading projects from storage:', error);
    }
    return [];
  }, []);

  /**
   * Save projects to localStorage
   */
  const saveProjectsToStorage = useCallback((projectsData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsData));
      const nowMs = Date.now();
      localStorage.setItem(STORAGE_KEYS.LAST_FETCH, nowMs.toString());
      setLastFetchTime(nowMs);
    } catch (error) {
      console.error('Error saving projects to storage:', error);
    }
  }, []);

  /**
   * Fetch recent projects from Freelancer API using dynamic token
   */
  const fetchRecentProjects = useCallback(async () => {
    // Check if we have a token
    if (!token) {
      const errorMsg = 'No access token available. Please select a user account.';
      console.error(errorMsg);
      setError(errorMsg);
      return [];
    }

    console.log(`🔄 Fetching projects for ${currentUser} with token: ${token?.substring(0, 20)}...`);
    console.log(`🔑 Using bidder ID: ${bidderId}`);

    setLoading(true);
    setError(null);

    try {
      // Calculate from_time (current time - 5 minutes)
      const fromTime = getUnixTimestamp(300); // 300 seconds = 5 minutes

      // Build query parameters
      const params = {
        ...API_CONFIG.DEFAULT_PARAMS,
        from_time: fromTime
      };

      const queryString = buildQueryParams(params);
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACTIVE_PROJECTS}?${queryString}`;
      
      console.log(`🌐 Fetching from: ${url}`);

      // Make API call with dynamic token
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'freelancer-oauth-v1': token, // Use dynamic token here!
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.data && response.data.result && response.data.result.projects) {
        const projectsData = response.data.result.projects || [];
        
        // Filter for USD projects only
        const usdProjects = projectsData.filter(project =>
          project.currency && project.currency.code === 'USD'
        );

        // Sort with "new" first (<= 60s old based on submitdate vs now)
        const nowUnix = Math.floor(Date.now() / 1000);
        const sorted = [...usdProjects].sort((a, b) => {
          const aNew = isProjectNew(a.submitdate, nowUnix);
          const bNew = isProjectNew(b.submitdate, nowUnix);
          if (aNew && !bNew) return -1;
          if (!aNew && bNew) return 1;
          // fallback to submitdate desc
          return (b.submitdate || 0) - (a.submitdate || 0);
        });

        setProjects(sorted);
        saveProjectsToStorage(sorted);
        
        console.log(`✅ Successfully fetched ${sorted.length} USD projects for ${currentUser} (filtered from ${projectsData.length} total)`);
        return sorted;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error(`❌ Error fetching projects for ${currentUser}:`, err);
      let errorMessage = `Failed to fetch projects for ${currentUser}`;
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (err.response) {
        errorMessage = `API Error: ${err.response.status} - ${err.response.statusText}`;
        if (err.response.status === 401) {
          errorMessage += ` - Invalid token for ${currentUser}`;
        }
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }

      setError(errorMessage);
      
      // Load stored projects as fallback
      const storedProjects = loadProjectsFromStorage();
      if (storedProjects.length > 0) {
        console.log('Loaded projects from storage as fallback');
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, bidderId, currentUser, loadProjectsFromStorage, saveProjectsToStorage]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Retry fetch operation
   */
  const retryFetch = useCallback(async () => {
    clearError();
    return await fetchRecentProjects();
  }, [clearError, fetchRecentProjects]);

  // Clear projects when user switches
  useEffect(() => {
    console.log(`👤 User switched to: ${currentUser}`);
    setProjects([]); // Clear previous user's projects
    setError(null);
    
    // Load projects from storage for new user
    loadProjectsFromStorage();
  }, [currentUser, loadProjectsFromStorage]);

  // Auto-fetch periodically, but only if we have a token
  useEffect(() => {
    if (!token) {
      console.log('⏳ No token available, skipping auto-fetch');
      return;
    }

    console.log(`🔄 Setting up auto-fetch for ${currentUser}`);
    
    const interval = setInterval(() => {
      if (token) { // Double-check token is still available
        console.log(`⏰ Auto-fetching for ${currentUser}...`);
        fetchRecentProjects().catch(() => {});
      }
    }, 30000); // 5 minutes

    return () => {
      console.log(`🛑 Clearing auto-fetch for ${currentUser}`);
      clearInterval(interval);
    };
  }, [token, currentUser, fetchRecentProjects]);

  // Derive counts for New vs Old
  const nowUnix = Math.floor(Date.now() / 1000);
  const newProjects = projects.filter(p => isProjectNew(p.submitdate, nowUnix));
  const oldProjects = projects.filter(p => !isProjectNew(p.submitdate, nowUnix));

  return {
    projects,
    loading,
    error,
    fetchRecentProjects,
    loadProjectsFromStorage,
    clearError,
    retryFetch,
    
    // Additional info
    lastFetchTime,
    newCount: newProjects.length,
    oldCount: oldProjects.length,
    newThresholdSeconds: NEW_THRESHOLD_SECONDS,
    
    // Debug info
    currentUser,
    token: token ? `${token.substring(0, 10)}...` : 'No token',
    bidderId
  };
};
