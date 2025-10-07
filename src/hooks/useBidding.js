// import { useState, useCallback } from 'react';
// import { bidService } from '../services/bidService';
// import { useAuth } from '../contexts/AuthContext';

// /**
//  * Custom hook for handling bidding operations
//  */
// export const useBidding = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const { token, bidderId } = useAuth();

//   /**
//    * Place a bid on a project
//    */
//   const placeBid = useCallback(async (projectId, amount = 750, period = 5, description = "I am interested in this project and would like to discuss the requirements in detail. I have experience with similar projects and can deliver high-quality work within the specified timeframe.") => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const result = await bidService.placeBid(projectId, amount, period, description, token, bidderId);
      
//       if (result.success) {
//         setSuccess(true);
//         // Show success alert
//         alert(`Bid placed successfully! Amount: $${amount}, Period: ${period} days`);
//         return result;
//       } else {
//         setError(result.message);
//         return result;
//       }
//     } catch (err) {
//       const errorMessage = err.message || 'An unexpected error occurred';
//       setError(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setLoading(false);
//     }
//   }, [token, bidderId]);

//   /**
//    * Clear error state
//    */
//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   /**
//    * Clear success state
//    */
//   const clearSuccess = useCallback(() => {
//     setSuccess(false);
//   }, []);

//   /**
//    * Reset all states
//    */
//   const reset = useCallback(() => {
//     setLoading(false);
//     setError(null);
//     setSuccess(false);
//   }, []);

//   return {
//     loading,
//     error,
//     success,
//     placeBid,
//     clearError,
//     clearSuccess,
//     reset
//   };
// };


import { useState, useCallback } from 'react';
import { bidService } from '../services/bidService';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for handling bidding operations with multi-account support
 */
export const useBidding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { token, bidderId, currentUser } = useAuth();

  /**
   * Place a bid on a project
   */
  const placeBid = useCallback(async (
    projectId, 
    amount = 750, 
    period = 5, 
    description = "I am interested in this project and would like to discuss the requirements in detail. I have experience with similar projects and can deliver high-quality work within the specified timeframe."
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Enhanced logging for multi-account debugging
    console.log(`🎯 Placing bid for ${currentUser}:`);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Amount: $${amount}`);
    console.log(`   Period: ${period} days`);
    console.log(`   Token: ${token ? `${token.substring(0, 15)}...` : 'MISSING'}`);
    console.log(`   Bidder ID: ${bidderId || 'MISSING'}`);

    try {
      // Validate required credentials
      if (!token) {
        throw new Error(`No access token available for ${currentUser}. Please check your environment configuration.`);
      }
      
      if (!bidderId) {
        throw new Error(`No bidder ID configured for ${currentUser}. Please check your environment configuration.`);
      }

      const result = await bidService.placeBid(projectId, amount, period, description, token, bidderId);

      if (result.success) {
        setSuccess(true);
        console.log(`✅ Bid placed successfully for ${currentUser}!`);
        
        // Show success alert with user info
        alert(`✅ Bid placed successfully for ${currentUser}!\n\nAmount: $${amount}\nPeriod: ${period} days\nProject ID: ${projectId}`);
        
        return result;
      } else {
        console.log(`❌ Bid failed for ${currentUser}:`, result.message);
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      console.error(`❌ Bidding error for ${currentUser}:`, errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [token, bidderId, currentUser]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear success state
   */
  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    placeBid,
    clearError,
    clearSuccess,
    reset,
    
    // Debug info for multi-account
    currentUser,
    hasToken: !!token,
    hasBidderId: !!bidderId
  };
};
