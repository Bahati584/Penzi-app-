import { API_BASE_URL } from '../config';

// Generic API call function with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Failed:', error);
    throw new Error(error.message || 'Network error. Please try again.');
  }
};

// SMS-related API calls
export const smsAPI = {
  processCommand: (smsData) => apiRequest('/sms/command', {
    method: 'POST',
    body: JSON.stringify(smsData),
  }),
  getMessages: () => apiRequest('/sms/messages'),
  getMessageById: (id) => apiRequest(`/sms/messages/${id}`),
  deleteMessage: (id) => apiRequest(`/sms/messages/${id}`, {
    method: 'DELETE',
  }),
};

// Match-related API calls (if you still need these for admin purposes)
export const matchAPI = {
  getAllMatchRequests: () => apiRequest('/matches'),
  getMatchRequestById: (id) => apiRequest(`/matches/${id}`),
};

// Penzi assistant API calls (simplified - most functionality now through SMS)
export const penziAPI = {
  registerUser: (userData) => apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getUserProfile: (phone) => apiRequest(`/users/phone/${phone}`),
  updateProfile: (updateData) => apiRequest('/users/details', {
    method: 'PUT',
    body: JSON.stringify(updateData)
  })
};

