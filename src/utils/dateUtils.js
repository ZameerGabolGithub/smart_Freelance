/**
 * Formats Unix timestamp to Pakistan local time
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string in Pakistan time
 */
export const formatUnixToPakistanTime = (unixTimestamp) => {
  try {
    const date = new Date(unixTimestamp * 1000);
    
    // Format to Pakistan time (Asia/Karachi)
    const options = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Gets current Unix timestamp minus specified seconds
 * @param {number} secondsToSubtract - Number of seconds to subtract from current time
 * @returns {number} Unix timestamp
 */
export const getUnixTimestamp = (secondsToSubtract = 0) => {
  return Math.floor(Date.now() / 1000) - secondsToSubtract;
};

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount}`;
  }
};