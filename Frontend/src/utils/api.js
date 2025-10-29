/**
 * API Client
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// CONVERSATION API
// ============================================

export const conversationAPI = {
  // Get all conversations
  getAll: () => api.get('/conversations'),

  // Get single conversation with messages
  getById: (id) => api.get(`/conversations/${id}`),

  // Create new conversation
  create: (data = {}) => api.post('/conversations', data),

  // Update conversation
  update: (id, data) => api.patch(`/conversations/${id}`, data),

  // Delete conversation
  delete: (id) => api.delete(`/conversations/${id}`),

  // Send message
  sendMessage: (id, content) =>
    api.post(`/conversations/${id}/messages`, { content }),
};

// ============================================
// DOCUMENT API
// ============================================

export const documentAPI = {
  // Upload documents
  upload: (conversationId, files) => {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    
    // Append each file
    files.forEach((file) => {
      formData.append('documents', file);
    });

    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get documents for a conversation
  getByConversation: (conversationId) =>
    api.get(`/documents/conversation/${conversationId}`),

  // Delete document
  delete: (id) => api.delete(`/documents/${id}`),
};

// Export default api instance for custom requests
export default api;
