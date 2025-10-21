import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-9c58.up.railway.app';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// UNF API
export const unfAPI = {
  // Layers
  getLayers: () => apiClient.get('/unf/layers'),
  getLayer: (id) => apiClient.get(`/unf/layers/${id}`),
  createLayer: (data) => apiClient.post('/unf/layers', data),

  // Elements
  getElements: (params) => apiClient.get('/unf/elements', { params }),
  getElement: (id) => apiClient.get(`/unf/elements/${id}`),
  createElement: (data) => apiClient.post('/unf/elements', data),
  updateElement: (id, data) => apiClient.put(`/unf/elements/${id}`, data),
  approveElement: (id) => apiClient.post(`/unf/elements/${id}/approve`),
  getElementVersions: (id) => apiClient.get(`/unf/elements/${id}/versions`),
  getLatestApprovedElements: (layerId) =>
    apiClient.get('/unf/elements/latest/approved', { params: { layer_id: layerId } }),
};

// Voices API
export const voicesAPI = {
  getVoices: (params) => apiClient.get('/voices', { params }),
  getVoice: (id) => apiClient.get(`/voices/${id}`),
  createVoice: (data) => apiClient.post('/voices', data),
  updateVoice: (id, data) => apiClient.put(`/voices/${id}`, data),
};

// Story Models API
export const storyModelsAPI = {
  getStoryModels: () => apiClient.get('/story-models'),
  getStoryModel: (id) => apiClient.get(`/story-models/${id}`),
  getStoryModelByName: (name) => apiClient.get(`/story-models/by-name/${name}`),
  createStoryModel: (data) => apiClient.post('/story-models', data),
};

// Templates API
export const templatesAPI = {
  getTemplates: (params) => apiClient.get('/templates', { params }),
  getTemplate: (id) => apiClient.get(`/templates/${id}`),
  createTemplate: (data) => apiClient.post('/templates', data),
  updateTemplate: (id, data) => apiClient.put(`/templates/${id}`, data),
  getSectionBindings: (templateId) => apiClient.get(`/templates/${templateId}/bindings`),
  createSectionBinding: (templateId, data) =>
    apiClient.post(`/templates/${templateId}/bindings`, data),
};

// Deliverables API
export const deliverablesAPI = {
  getDeliverables: (params) => apiClient.get('/deliverables', { params }),
  getDeliverable: (id) => apiClient.get(`/deliverables/${id}`),
  getDeliverableWithAlerts: (id) => apiClient.get(`/deliverables/${id}/with-alerts`),
  createDeliverable: (data) => apiClient.post('/deliverables', data),
  updateDeliverable: (id, data) => apiClient.put(`/deliverables/${id}`, data),
  validateDeliverable: (id) => apiClient.post(`/deliverables/${id}/validate`),
  refreshDeliverable: (id) => apiClient.post(`/deliverables/${id}/refresh`),
};

export default apiClient;
