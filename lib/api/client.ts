import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-9c58.up.railway.app';

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
  getLayer: (id: string) => apiClient.get(`/unf/layers/${id}`),
  createLayer: (data: any) => apiClient.post('/unf/layers', data),

  // Elements
  getElements: (params?: any) => apiClient.get('/unf/elements', { params }),
  getElement: (id: string) => apiClient.get(`/unf/elements/${id}`),
  createElement: (data: any) => apiClient.post('/unf/elements', data),
  updateElement: (id: string, data: any) => apiClient.put(`/unf/elements/${id}`, data),
  approveElement: (id: string) => apiClient.post(`/unf/elements/${id}/approve`),
  getElementVersions: (id: string) => apiClient.get(`/unf/elements/${id}/versions`),
  getLatestApprovedElements: (layerId?: string) =>
    apiClient.get('/unf/elements/latest/approved', { params: { layer_id: layerId } }),
};

// Voices API
export const voicesAPI = {
  getVoices: (params?: any) => apiClient.get('/voices', { params }),
  getVoice: (id: string) => apiClient.get(`/voices/${id}`),
  createVoice: (data: any) => apiClient.post('/voices', data),
  updateVoice: (id: string, data: any) => apiClient.put(`/voices/${id}`, data),
};

// Story Models API
export const storyModelsAPI = {
  getStoryModels: () => apiClient.get('/story-models'),
  getStoryModel: (id: string) => apiClient.get(`/story-models/${id}`),
  getStoryModelByName: (name: string) => apiClient.get(`/story-models/by-name/${name}`),
  createStoryModel: (data: any) => apiClient.post('/story-models', data),
};

// Templates API
export const templatesAPI = {
  getTemplates: (params?: any) => apiClient.get('/templates', { params }),
  getTemplate: (id: string) => apiClient.get(`/templates/${id}`),
  createTemplate: (data: any) => apiClient.post('/templates', data),
  updateTemplate: (id: string, data: any) => apiClient.put(`/templates/${id}`, data),
  getSectionBindings: (templateId: string) => apiClient.get(`/templates/${templateId}/bindings`),
  createSectionBinding: (templateId: string, data: any) =>
    apiClient.post(`/templates/${templateId}/bindings`, data),
};

// Deliverables API
export const deliverablesAPI = {
  getDeliverables: (params?: any) => apiClient.get('/deliverables', { params }),
  getDeliverable: (id: string) => apiClient.get(`/deliverables/${id}`),
  getDeliverableWithAlerts: (id: string) => apiClient.get(`/deliverables/${id}/with-alerts`),
  getDeliverableVersions: (id: string) => apiClient.get(`/deliverables/${id}/versions`),
  createDeliverable: (data: any) => apiClient.post('/deliverables', data),
  updateDeliverable: (id: string, data: any) => apiClient.put(`/deliverables/${id}`, data),
  validateDeliverable: (id: string) => apiClient.post(`/deliverables/${id}/validate`),
  refreshDeliverable: (id: string) => apiClient.post(`/deliverables/${id}/refresh`),
};

export default apiClient;
