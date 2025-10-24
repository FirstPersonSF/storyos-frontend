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
  createDeliverable: (name: string, templateId: string, voiceId: string, instanceData: any) => Promise<{ success: boolean; deliverable?: any; error?: string }>;
  refreshDeliverable: (deliverableId: string) => Promise<{ success: boolean; error?: string }>;
  refreshAllDeliverables: () => Promise<{ success: boolean; error?: string }>;
  deleteDeliverable: (deliverableId: string) => Promise<{ success: boolean; error?: string }>;
  updateElement: (elementId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  updateDeliverableStoryModel: (deliverableId: string, newStoryModelId: string, instanceData?: any) => Promise<{ success: boolean; error?: string }>;
  updateDeliverableVoice: (deliverableId: string, newVoiceId: string) => Promise<{ success: boolean; error?: string }>;
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
      // Load both approved and superseded elements for complete provenance records
      const [templatesRes, voicesRes, approvedElementsRes, supersededElementsRes, storyModelsRes, deliverablesRes] = await Promise.all([
        templatesAPI.getTemplates(),
        voicesAPI.getVoices(),
        unfAPI.getElements({ status: 'approved' }),
        unfAPI.getElements({ status: 'superseded' }),
        storyModelsAPI.getStoryModels(),
        deliverablesAPI.getDeliverables()
      ]);

      // Combine approved and superseded elements
      const allElements = [...approvedElementsRes.data, ...supersededElementsRes.data];

      setTemplates(templatesRes.data);
      setVoices(voicesRes.data);
      setElements(allElements);
      setStoryModels(storyModelsRes.data);

      // Fetch all deliverables with alerts in a single efficient API call
      const deliverablesWithAlertsRes = await deliverablesAPI.getDeliverablesWithAlerts();

      // Progressive loading: display deliverables one by one with a slight delay
      const allDeliverables = deliverablesWithAlertsRes.data;
      setLoading(false); // Hide loading state to start showing skeleton cards

      // Add deliverables progressively with 100ms delay between each
      for (let i = 0; i < allDeliverables.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setDeliverables(prev => [...prev, allDeliverables[i]]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load initial data:', err);
      setLoading(false);
    }
  }

  async function createDeliverable(name: string, templateId: string, voiceId: string, instanceData: any) {
    // Don't set global loading state - let the caller handle it
    setError(null);

    try {
      // Create deliverable
      const response = await deliverablesAPI.createDeliverable({
        name: name,
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
    }
  }

  async function refreshDeliverable(deliverableId: string) {
    // Don't set global loading state - use card-level loading instead
    try {
      await deliverablesAPI.refreshDeliverable(deliverableId);
      const updated = await deliverablesAPI.getDeliverableWithAlerts(deliverableId);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? updated.data : d)
      );
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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

      // Reload elements (both approved and superseded)
      const [approvedRes, supersededRes] = await Promise.all([
        unfAPI.getElements({ status: 'approved' }),
        unfAPI.getElements({ status: 'superseded' })
      ]);
      setElements([...approvedRes.data, ...supersededRes.data]);

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

  async function updateDeliverableVoice(deliverableId: string, newVoiceId: string) {
    setLoading(true);
    try {
      // Update deliverable with new voice
      const updatePayload: any = {
        voice_id: newVoiceId
      };

      await deliverablesAPI.updateDeliverable(deliverableId, updatePayload);

      // Refresh to re-render content with new voice
      await deliverablesAPI.refreshDeliverable(deliverableId);

      // Fetch with alerts
      const withAlerts = await deliverablesAPI.getDeliverableWithAlerts(deliverableId);

      setDeliverables(prev =>
        prev.map(d => d.id === deliverableId ? withAlerts.data : d)
      );
      return { success: true };
    } catch (error: any) {
      console.error('Failed to update voice:', error);
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
    updateDeliverableVoice,
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
