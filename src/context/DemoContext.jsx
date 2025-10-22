import { createContext, useContext, useState, useEffect } from 'react';
import { unfAPI, voicesAPI, templatesAPI, deliverablesAPI } from '../api/client';

const DemoContext = createContext();

export function DemoProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [voices, setVoices] = useState([]);
  const [elements, setElements] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [templatesRes, voicesRes, elementsRes] = await Promise.all([
        templatesAPI.getTemplates(),
        voicesAPI.getVoices(),
        unfAPI.getElements({ status: 'approved' })
      ]);

      setTemplates(templatesRes.data);
      setVoices(voicesRes.data);
      setElements(elementsRes.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createDeliverable(templateId, voiceId, instanceData) {
    setLoading(true);
    setError(null);

    try {
      // Create deliverable
      const response = await deliverablesAPI.createDeliverable({
        template_id: templateId,
        voice_id: voiceId,
        instance_data: instanceData,
        status: 'draft'
      });

      // Fetch with alerts to get full metadata
      const withAlerts = await deliverablesAPI.getDeliverableWithAlerts(response.data.id);

      setDeliverables(prev => [...prev, withAlerts.data]);
      return { success: true, deliverable: withAlerts.data };

    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  async function refreshDeliverable(deliverableId) {
    setLoading(true);
    try {
      await deliverablesAPI.refreshDeliverable(deliverableId);
      const updated = await deliverablesAPI.getDeliverableWithAlerts(deliverableId);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? updated.data : d)
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function refreshAllDeliverables() {
    setLoading(true);
    try {
      for (const d of deliverables) {
        await deliverablesAPI.refreshDeliverable(d.id);
      }

      // Reload all with alerts
      const updatedPromises = deliverables.map(d =>
        deliverablesAPI.getDeliverableWithAlerts(d.id)
      );
      const results = await Promise.all(updatedPromises);

      setDeliverables(results.map(r => r.data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function deleteDeliverable(deliverableId) {
    try {
      // Note: Backend doesn't have DELETE endpoint yet, so just remove from state
      setDeliverables(prev => prev.filter(d => d.id !== deliverableId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function updateElement(elementId, content) {
    setLoading(true);
    try {
      console.log('Updating element:', elementId);
      await unfAPI.updateElement(elementId, { content });

      // Reload elements
      const elementsRes = await unfAPI.getElements({ status: 'approved' });
      setElements(elementsRes.data);

      // Reload all deliverables with alerts
      const updatedPromises = deliverables.map(d =>
        deliverablesAPI.getDeliverableWithAlerts(d.id)
      );
      const results = await Promise.all(updatedPromises);

      setDeliverables(results.map(r => r.data));
      return { success: true };
    } catch (error) {
      console.error('Failed to update element:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function updateDeliverableStoryModel(deliverableId, newStoryModelId) {
    setLoading(true);
    try {
      // Update deliverable with new story model
      const response = await deliverablesAPI.updateDeliverable(deliverableId, {
        story_model_id: newStoryModelId
      });

      // Fetch with alerts
      const withAlerts = await deliverablesAPI.getDeliverableWithAlerts(response.data.id);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? withAlerts.data : d)
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const value = {
    templates,
    voices,
    elements,
    deliverables,
    loading,
    error,
    createDeliverable,
    refreshDeliverable,
    refreshAllDeliverables,
    deleteDeliverable,
    updateElement,
    updateDeliverableStoryModel,
    loadInitialData
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
}
