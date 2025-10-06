import axios from 'axios';
import { API_CONFIG, getApiHeaders, STORAGE_KEYS } from '../utils/apiUtils';

class BidService {
  async placeBid(projectId, amount, period, description, token = null, bidderId = null) {
    if (!bidderId) {
      return { success: false, message: 'Bidder ID not configured. Please select a valid account.' };
    }

    const body = {
      project_id: projectId,
      bidder_id: bidderId,
      amount,
      period,
      description,
      milestone_percentage: 50
    };

    try {
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PLACE_BID}`,
        body,
        { headers: getApiHeaders(true, token), timeout: 15000 }
      );
      // Optional local cache of submitted bids
      try {
        const key = STORAGE_KEYS.BIDS;
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        prev.push({ projectId, amount, period, description, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(prev));
      } catch {}
      return { success: true, data: res.data };
    } catch (error) {
      let message = 'Failed to place bid';
      if (error.response) {
        const s = error.response.status;
        const d = error.response.data;
        if (s === 401) message = 'Authentication failed. Check your API token.';
        else if (s === 403) message = 'Permission denied.';
        else if (s === 400) message = d?.message || 'Invalid bid data.';
        else if (s === 429) message = 'Too many requests. Please wait.';
        else message = `API Error: ${s} - ${d?.message || error.response.statusText}`;
      } else if (error.request) {
        message = 'Network error. Please try again.';
      } else if (error.message) {
        message = error.message;
      }
      return { success: false, message };
    }
  }

  /**
   * Get locally stored bids
   * @returns {Array} Array of stored bids
   */
  getLocalBids() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]');
    } catch (error) {
      console.error('Error retrieving local bids:', error);
      return [];
    }
  }

  /**
   * Check if user has already bid on a project
   * @param {number} projectId - Project ID to check
   * @returns {boolean} True if user has bid on this project
   */
  hasBidOnProject(projectId) {
    const localBids = this.getLocalBids();
    return localBids.some(bid => bid.projectId === projectId);
  }

  /**
   * Store bid information locally
   * @param {number} projectId - Project ID
   * @param {Object} bidData - Bid data sent to API
   * @param {Object} response - API response
   */
  storeBidLocally(projectId, bidData, response) {
    try {
      const existingBids = JSON.parse(localStorage.getItem(STORAGE_KEYS.BIDS) || '[]');
      
      const bidRecord = {
        id: response.result?.id || Date.now(),
        projectId,
        amount: bidData.amount,
        period: bidData.period,
        description: bidData.description,
        timestamp: Date.now(),
        status: 'submitted'
      };
      
      existingBids.push(bidRecord);
      localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(existingBids));
    } catch (error) {
      console.error('Error storing bid locally:', error);
    }
  }
}

export const bidService = new BidService();
export default bidService;