import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG, buildQueryParams, STORAGE_KEYS } from '../utils/apiUtils';
import { useAuth } from '../contexts/AuthContext';

export const useFreelancerAPI = () => {
  const { token, currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skillsCache, setSkillsCache] = useState({});

  const getUserInfo = useCallback(async () => {
    try {
      const response = await axios.get('https://www.freelancer.com/api/users/0.1/self', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data?.result?.id || null;
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw new Error('Failed to fetch user info');
    }
  }, [token]);

  const getUserSkills = useCallback(async (userId) => {
    if (skillsCache[userId]) {
      console.log(`Using cached skills for user ${userId}`);
      return skillsCache[userId];
    }

    try {
      const response = await axios.get(
        `https://www.freelancer.com/ajax-api/skills/top-skills.php?limit=9999&userId=${userId}&compact=true`
      );
      const skills = response.data?.topSkills?.map((skill) => skill.id) || [];
      setSkillsCache((prevCache) => ({ ...prevCache, [userId]: skills }));
      return skills;
    } catch (err) {
      console.error('Error fetching user skills:', err);
      throw new Error('Failed to fetch user skills');
    }
  }, [skillsCache]);

  const getProjectsBySkills = useCallback(async (skillIds) => {
    if (!skillIds || skillIds.length === 0) {
      console.warn('No skills found for the user. Returning an empty project list.');
      return [];
    }

    try {
      const params = {
        ...API_CONFIG.DEFAULT_PARAMS,
        jobs: skillIds,
      };
      const queryString = buildQueryParams(params);
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACTIVE_PROJECTS}?${queryString}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data?.result?.projects || [];
    } catch (err) {
      console.error('Error fetching projects by skills:', err);
      throw new Error('Failed to fetch projects by skills');
    }
  }, [token]);
  // Track last fetch time (ms epoch)
  const [lastFetchTime, setLastFetchTime] = useState(
    (() => {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
      return saved ? parseInt(saved, 10) : null;
    })()
  );

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

  const fetchRecentProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await getUserInfo();
      if (!userId) {
        throw new Error('User ID not found');
      }

      const skillIds = await getUserSkills(userId);
      const projects = await getProjectsBySkills(skillIds);

      setProjects(projects);
      console.log(`Fetched ${projects.length} projects for user ${currentUser}`);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch recent projects:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, getUserInfo, getUserSkills, getProjectsBySkills]);

  return {
    projects,
    loading,
    error,
    fetchRecentProjects,
    loadProjectsFromStorage
  };
};
