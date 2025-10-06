import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, buildQueryParams, STORAGE_KEYS, isProjectNew, NEW_THRESHOLD_SECONDS } from '../utils/apiUtils';
import { getUnixTimestamp } from '../utils/dateUtils';

/**
 * Custom hook for Freelancer API operations
 */
export const useFreelancerAPI = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // New: track last fetch time (ms epoch)
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
   * Fetch recent projects from Freelancer API
   */
  const fetchRecentProjects = useCallback(async () => {
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

      console.log('Fetching projects from:', url);

      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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

        console.log(`Successfully fetched ${sorted.length} USD projects (filtered from ${projectsData.length} total)`);
        return sorted;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      
      let errorMessage = 'Failed to fetch projects';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (err.response) {
        errorMessage = `API Error: ${err.response.status} - ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
      
      const storedProjects = loadProjectsFromStorage();
      if (storedProjects.length > 0) {
        console.log('Loaded projects from storage as fallback');
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadProjectsFromStorage, saveProjectsToStorage]);

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

  // New: auto-fetch every 5 minutes, and cleanup on unmount
  // New: auto-fetch every 5 minutes, and cleanup on unmount
  useEffect(() => {
    // initial load if empty
    loadProjectsFromStorage();
    
    const interval = setInterval(() => {
      fetchRecentProjects().catch(() => {});
    }, 30000); // 5 minutes (300000ms)
    
    return () => clearInterval(interval);
  }, [fetchRecentProjects, loadProjectsFromStorage]); // Remove 'projects' from dependencies
  // New: derive counts for New vs Old
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
    // New exposures
    lastFetchTime,
    newCount: newProjects.length,
    oldCount: oldProjects.length,
    newThresholdSeconds: NEW_THRESHOLD_SECONDS,
  };
};