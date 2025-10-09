import React, { useState } from 'react';
import axios from 'axios';

const HardcodedFetchButtons = ({ onProjectsFetched }) => {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  // Hardcoded user configurations with access tokens
  const HARDCODED_USERS = {
    ZUBAIR: {
      name: 'Zubair',
      token: 'O24GYV9TM3b8FYixHDj0xWYYPoz1Bx',
      color: '#007bff'
    },
    ZAMEER: {
      name: 'Zameer',
      token: 'eAcop16b08CqobJFgC5om046SS4Jl5',
      color: '#28a745'
    },
    AHSAN: {
      name: 'Ahsan',
      token: 'Ui8H5ulpHRzd1e1kaaQCot48Qt04yw',
      color: '#dc3545'
    }
  };

  // Fetch projects function with hardcoded token
  const fetchProjectsWithHardcodedToken = async (userKey) => {
    const userConfig = HARDCODED_USERS[userKey];
    
    if (!userConfig) return;

    setLoading(prev => ({ ...prev, [userKey]: true }));

    try {
      console.log(`\n🚀 HARDCODED FETCH: ${userKey.toUpperCase()}`);
      console.log(`👤 User: ${userConfig.name}`);
      console.log(`🔑 Token: ${userConfig.token.substring(0, 20)}...`);

      // Freelancer API call
      const url = 'https://www.freelancer.com/api/projects/0.1/projects/active/';
      const params = {
        limit: 20,
        from_time: 1759914771,
        sort_field: 'submitdate',
        sort_order: 'desc',
        'project_types[]': 'fixed',
        'frontend_project_statuses[]': 'open',
        currency: 'USD'
      };

      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${url}?${queryString}`;

      console.log(`🌐 API URL: ${fullUrl}`);

      const response = await axios.get(fullUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'freelancer-oauth-v1': userConfig.token,
        },
        timeout: 15000,
      });

      console.log(`📥 Response Status: ${response.status}`);
      
      if (response.data && response.data.result && response.data.result.projects) {
        const allProjects = response.data.result.projects;
        
        // Filter USD projects
        const usdProjects = allProjects.filter(project => 
          project.currency && project.currency.code === 'USD'
        );

        // Add user context to projects
        const projectsWithContext = usdProjects.map(project => ({
          ...project,
          fetchedBy: userKey,
          fetchedByName: userConfig.name,
          fetchedAt: new Date().toISOString(),
          userColor: userConfig.color
        }));

        const resultData = {
          projects: projectsWithContext,
          total: allProjects.length,
          usdCount: usdProjects.length,
          fetchedAt: new Date().toISOString(),
          user: userKey,
          userName: userConfig.name,
          token: userConfig.token.substring(0, 15) + '...'
        };

        setResults(prev => ({ ...prev, [userKey]: resultData }));

        // Save to localStorage
        localStorage.setItem(`hardcoded_projects_${userKey}`, JSON.stringify(projectsWithContext));

        // Callback to parent
        if (onProjectsFetched) {
          onProjectsFetched(userKey, projectsWithContext, resultData);
        }

        console.log(`✅ Successfully fetched ${projectsWithContext.length} USD projects for ${userConfig.name}`);
        
        // Success notification
        alert(`✅ ${userConfig.name} - Fetch Successful!\n\n` +
              `Total Projects: ${allProjects.length}\n` +
              `USD Projects: ${usdProjects.length}\n` +
              `Token: ${userConfig.token.substring(0, 20)}...`);

      } else {
        throw new Error('Invalid API response structure');
      }

    } catch (error) {
      console.error(`❌ Error fetching projects for ${userKey}:`, error);
      
      const errorMsg = error.response 
        ? `API Error: ${error.response.status} - ${error.response.statusText}`
        : `Network Error: ${error.message}`;

      setResults(prev => ({
        ...prev,
        [userKey]: {
          error: errorMsg,
          fetchedAt: new Date().toISOString(),
          user: userKey,
          userName: userConfig.name,
          token: userConfig.token.substring(0, 15) + '...'
        }
      }));

      alert(`❌ ${userConfig.name} - Fetch Failed!\n\nError: ${errorMsg}\nToken: ${userConfig.token.substring(0, 20)}...`);
    } finally {
      setLoading(prev => ({ ...prev, [userKey]: false }));
    }
  };

  // Clear all results
  const clearResults = () => {
    setResults({});
    Object.keys(HARDCODED_USERS).forEach(userKey => {
      localStorage.removeItem(`hardcoded_projects_${userKey}`);
    });
    console.log('🗑️ Cleared all hardcoded fetch results');
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      border: '2px solid #007bff',
      margin: '20px 0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div>
          <h3 style={{ margin: '0', color: '#495057', fontSize: '18px' }}>
            🎯 Hardcoded Token Fetch Buttons
          </h3>
          <p style={{ margin: '4px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
            Direct API calls with individual user access tokens
          </p>
        </div>
        
        {Object.keys(results).length > 0 && (
          <button
            onClick={clearResults}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🗑️ Clear Results
          </button>
        )}
      </div>

      {/* Fetch Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '20px' 
      }}>
        {Object.entries(HARDCODED_USERS).map(([userKey, userConfig]) => {
          const isLoading = loading[userKey];
          
          return (
            <button
              key={userKey}
              onClick={() => fetchProjectsWithHardcodedToken(userKey)}
              disabled={isLoading}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 16px',
                backgroundColor: userConfig.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transform: isLoading ? 'scale(0.98)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }
              }}
            >
              <div style={{ fontSize: '24px' }}>
                {isLoading ? '⏳' : '🚀'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                  {isLoading ? 'Fetching...' : `Fetch from ${userConfig.name}`}
                </div>
                <div style={{ fontSize: '11px', opacity: '0.8', fontFamily: 'monospace' }}>
                  {userConfig.token.substring(0, 16)}...
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Token Information */}
      <div style={{
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '1px solid #dee2e6'
      }}>
        <h5 style={{ margin: '0 0 12px 0', color: '#495057' }}>
          🔑 Hardcoded Access Tokens
        </h5>
        {Object.entries(HARDCODED_USERS).map(([userKey, userConfig]) => (
          <div key={userKey} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '13px'
          }}>
            <span style={{ fontWeight: '600', color: userConfig.color }}>
              {userConfig.name}:
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {userConfig.token}
            </span>
          </div>
        ))}
      </div>

      {/* Results Display */}
      {Object.keys(results).length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#495057' }}>
            📊 Fetch Results Comparison
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {Object.entries(results).map(([userKey, result]) => {
              const userConfig = HARDCODED_USERS[userKey];
              
              return (
                <div
                  key={userKey}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: `3px solid ${result.error ? '#dc3545' : userConfig.color}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: userConfig.color
                      }}
                    />
                    <strong style={{ color: userConfig.color, fontSize: '16px' }}>
                      {userConfig.name}
                    </strong>
                  </div>
                  
                  {result.error ? (
                    <div>
                      <div style={{ color: '#dc3545', marginBottom: '8px' }}>
                        ❌ {result.error}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        🔑 Token: {result.token}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ marginBottom: '4px' }}>
                          📦 Total Projects: <strong>{result.total}</strong>
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          💰 USD Projects: <strong>{result.usdCount}</strong>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        borderTop: '1px solid #f1f3f5',
                        paddingTop: '8px'
                      }}>
                        <div>🕒 {new Date(result.fetchedAt).toLocaleTimeString()}</div>
                        <div>🔑 {result.token}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HardcodedFetchButtons;
