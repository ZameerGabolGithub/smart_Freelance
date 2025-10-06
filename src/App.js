import React, { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import FetchButton from './components/FetchButton';
import ProjectList from './components/ProjectList';
import AuthBanner from './components/AuthBanner';
import UserSwitcher from './components/UserSwitcher';
import AuthError from './components/AuthError';
import { useFreelancerAPI } from './hooks/useFreelancerAPI';
import { useModal } from './contexts/ModalContext';
import { useBidding } from './hooks/useBidding';
import { useAuth } from './contexts/AuthContext';
import ProposalModal from './components/ProposalModal';


/**
 * Main App component
 */
function App() {
  const { isLoading: authLoading, error: authError } = useAuth();
  const {
    projects,
    loading,
    error,
    fetchRecentProjects,
    loadProjectsFromStorage,
    clearError,
    retryFetch,
    lastFetchTime,
    newCount,
    oldCount
  } = useFreelancerAPI();


  const evnn = process.env.REACT_APP_TOKEN;
  console.log("apdsds",evnn)

  const { modalState, closeModal } = useModal();
  const { placeBid } = useBidding();

  // Load projects from storage on component mount
  useEffect(() => {
    loadProjectsFromStorage();
  }, [loadProjectsFromStorage]);

  // Handle fetch projects
  const handleFetchProjects = async () => {
    try {
      clearError();
      await fetchRecentProjects();
    } catch (err) {
      // Error is already handled in the hook
      console.error('Failed to fetch projects:', err.message);
    }
  };

  // Handle retry
  const handleRetry = async () => {
    try {
      await retryFetch();
    } catch (err) {
      console.error('Retry failed:', err.message);
    }
  };
  
    // Handle bid submission from modal
    const handleSubmitBid = async ({ amount, period, description }) => {
      const { projectId } = modalState.data;
      const result = await placeBid(projectId, amount, period, description);
      if (result?.success) {
        console.log('Bid response:', result.data);
        alert('Bid placed successfully!');
        closeModal();
      } else if (result?.message) {
        throw new Error(result.message);
      } else {
        throw new Error('Failed to place bid');
      }
    };
  
  // Show auth error if there's an authentication issue
  if (authError) {
    return <AuthError />;
  }

  // Show loading state while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Security Warning Banner */}
        <AuthBanner />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Smart Freelance
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <UserSwitcher />
              </div>
            </div>
          </div>
        </header>
  
          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Fetch section */}
            <div className="mb-12">
              <FetchButton
                onFetch={handleFetchProjects}
                loading={loading}
                error={error}
                onRetry={handleRetry}
              />
            </div>
  
            {/* Projects section */}
            <div className="mb-8">
              <ProjectList
                projects={projects}
                loading={loading}
                error={error}
                lastFetchTime={lastFetchTime}
                newCount={newCount}
                oldCount={oldCount}
              />
            </div>
          </main>
  
          {/* Global Proposal Modal */}
          {modalState.isOpen && modalState.type === 'proposal' && (
            <ProposalModal
              open={modalState.isOpen}
              onClose={closeModal}
              onSubmit={handleSubmitBid}
              projectId={modalState.data?.projectId}
              projectTitle={modalState.data?.projectTitle}
              budgetDisplay={modalState.data?.budgetDisplay}
              initialAmount={modalState.data?.initialAmount || 250}
              initialPeriod={modalState.data?.initialPeriod || 5}
            />
          )}
        </div>
      </ErrorBoundary>
    );
  }
  
  export default App;