"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { unfAPI, voicesAPI, templatesAPI, deliverablesAPI, storyModelsAPI } from '@/lib/api/client';

interface DemoContextType {
  templates: any[];
  voices: any[];
  elements: any[];
  deliverables: any[];
  storyModels: any[];
  loading: boolean;
  error: string | null;
  createDeliverable: (templateId: string, voiceId: string, instanceData: any) => Promise<{ success: boolean; deliverable?: any; error?: string }>;
  refreshDeliverable: (deliverableId: string) => Promise<{ success: boolean; error?: string }>;
  refreshAllDeliverables: () => Promise<{ success: boolean; error?: string }>;
  deleteDeliverable: (deliverableId: string) => Promise<{ success: boolean; error?: string }>;
  updateElement: (elementId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  updateDeliverableStoryModel: (deliverableId: string, newStoryModelId: string, instanceData?: any) => Promise<{ success: boolean; error?: string }>;
  loadInitialData: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [storyModels, setStoryModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [templatesRes, voicesRes, elementsRes, storyModelsRes, deliverablesRes] = await Promise.all([
        templatesAPI.getTemplates(),
        voicesAPI.getVoices(),
        unfAPI.getElements({ status: 'approved' }),
        storyModelsAPI.getStoryModels(),
        deliverablesAPI.getDeliverables()
      ]);

      setTemplates(templatesRes.data);
      setVoices(voicesRes.data);
      setElements(elementsRes.data);
      setStoryModels(storyModelsRes.data);

      // Fetch alerts for each deliverable
      const deliverablesWithAlerts = await Promise.all(
        deliverablesRes.data.map(async (d: any) => {
          try {
            const withAlerts = await deliverablesAPI.getDeliverableWithAlerts(d.id);
            return withAlerts.data;
          } catch (err) {
            console.error(`Failed to load alerts for deliverable ${d.id}:`, err);
            return d;
          }
        })
      );

      setDeliverables(deliverablesWithAlerts);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createDeliverable(templateId: string, voiceId: string, instanceData: any) {
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

      // Add new deliverable to the top of the list
      setDeliverables(prev => [withAlerts.data, ...prev]);
      return { success: true, deliverable: withAlerts.data };

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  async function refreshDeliverable(deliverableId: string) {
    setLoading(true);
    try {
      await deliverablesAPI.refreshDeliverable(deliverableId);
      const updated = await deliverablesAPI.getDeliverableWithAlerts(deliverableId);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? updated.data : d)
      );
      return { success: true };
    } catch (error: any) {
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
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function deleteDeliverable(deliverableId: string) {
    try {
      // Note: Backend doesn't have DELETE endpoint yet, so just remove from state
      setDeliverables(prev => prev.filter(d => d.id !== deliverableId));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async function updateElement(elementId: string, content: string) {
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
    } catch (error: any) {
      console.error('Failed to update element:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function updateDeliverableStoryModel(deliverableId: string, newStoryModelId: string, instanceData?: any) {
    setLoading(true);
    try {
      // Update deliverable with new story model and instance data
      const updatePayload: any = {
        story_model_id: newStoryModelId
      };

      if (instanceData) {
        updatePayload.instance_data = instanceData;
      }

      await deliverablesAPI.updateDeliverable(deliverableId, updatePayload);

      // Refresh to re-render content with new story model
      await deliverablesAPI.refreshDeliverable(deliverableId);

      // Fetch with alerts
      const withAlerts = await deliverablesAPI.getDeliverableWithAlerts(deliverableId);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? withAlerts.data : d)
      );
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update story model:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const value: DemoContextType = {
    templates,
    voices,
    elements,
    deliverables,
    storyModels,
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
