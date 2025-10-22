# StoryOS Enhanced Demo Page - Implementation Plan

## Overview
Transform the current demo page into a comprehensive, component-based interface that supports:
- Multiple deliverable creation with interactive builder
- Template/voice selection with dynamic instance fields
- Story model switching and re-rendering
- LLM transformation annotations and changelog
- Complete provenance tracking
- Impact alert workflow
- Responsive grid layout

**Estimated Time:** 6-8 hours
**Architecture:** Component-based with React Context for state management

---

## Phase 1: Foundation & Context (1.5 hours)

### Task 1.1: Create DemoContext
**File:** `src/context/DemoContext.jsx`

**Implementation:**
```javascript
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
      // Note: Add DELETE endpoint to backend if not exists
      setDeliverables(prev => prev.filter(d => d.id !== deliverableId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function updateElement(elementId, content) {
    setLoading(true);
    try {
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
```

**Verification:**
- Context provides all required data and methods
- Error handling returns user-friendly messages
- Loading states managed consistently

---

## Phase 2: Form Components (2 hours)

### Task 2.1: InstanceFieldsForm Component
**File:** `src/components/demo/InstanceFieldsForm.jsx`

**Implementation:**
```javascript
import { useState, useEffect } from 'react';

export default function InstanceFieldsForm({ template, instanceData, onChange }) {
  const [formData, setFormData] = useState(instanceData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(instanceData || {});
  }, [instanceData]);

  const handleChange = (fieldName, value) => {
    const updated = { ...formData, [fieldName]: value };
    setFormData(updated);
    onChange(updated);

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = (template.instance_fields || []).filter(f => f.required);

    requiredFields.forEach(field => {
      if (!formData[field.name] || formData[field.name].trim() === '') {
        newErrors[field.name] = `${field.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!template.instance_fields || template.instance_fields.length === 0) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ This template has no instance fields
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">
          Instance Fields {template.instance_fields.filter(f => f.required).length > 0 && '(* required)'}
        </p>
      </div>

      {template.instance_fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.name} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.description || `Enter ${field.name}`}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors[field.name] && (
            <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Verification:**
- Required fields marked with asterisk
- Validation errors display inline
- Empty state shows helpful message

### Task 2.2: DeliverableBuilder Component
**File:** `src/components/demo/DeliverableBuilder.jsx`

**Implementation:**
```javascript
import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import InstanceFieldsForm from './InstanceFieldsForm';

export default function DeliverableBuilder() {
  const { templates, voices, createDeliverable, loading } = useDemo();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [instanceData, setInstanceData] = useState({});
  const [error, setError] = useState(null);

  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    setInstanceData({});
    setError(null);
  };

  const handleCreate = async () => {
    if (!selectedTemplate || !selectedVoice) {
      setError('Please select both template and voice');
      return;
    }

    // Validate required instance fields
    const requiredFields = (selectedTemplate.instance_fields || []).filter(f => f.required);
    const missingFields = requiredFields.filter(f => !instanceData[f.name] || instanceData[f.name].trim() === '');

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.map(f => f.name).join(', ')}`);
      return;
    }

    const result = await createDeliverable(selectedTemplate.id, selectedVoice.id, instanceData);

    if (result.success) {
      // Reset form
      setSelectedTemplate(null);
      setSelectedVoice(null);
      setInstanceData({});
      setError(null);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">📝 Create New Deliverable</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Template Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template
          </label>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a template...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Voice Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voice
          </label>
          <select
            value={selectedVoice?.id || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.id === e.target.value);
              setSelectedVoice(voice);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a voice...</option>
            {voices.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Instance Fields Form */}
        {selectedTemplate && (
          <InstanceFieldsForm
            template={selectedTemplate}
            instanceData={instanceData}
            onChange={setInstanceData}
          />
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading || !selectedTemplate || !selectedVoice}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Creating...' : 'Create Deliverable'}
        </button>
      </div>
    </div>
  );
}
```

**Verification:**
- Template selection loads instance fields dynamically
- Form validation before submission
- Success resets form, error shows message

### Task 2.3: DemoActionsPanel Component
**File:** `src/components/demo/DemoActionsPanel.jsx`

**Implementation:**
```javascript
import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';

export default function DemoActionsPanel() {
  const { elements, updateElement, refreshAllDeliverables, loading } = useDemo();
  const [selectedElement, setSelectedElement] = useState(null);

  const handleUpdateElement = async () => {
    if (!selectedElement) {
      alert('Please select an element to update');
      return;
    }

    const updatedContent = selectedElement.content + '\n\n[UPDATED: ' + new Date().toLocaleTimeString() + ']';

    const result = await updateElement(selectedElement.id, updatedContent);

    if (result.success) {
      alert('Element updated! Check deliverables for impact alerts.');
    } else {
      alert('Update failed: ' + result.error);
    }
  };

  const handleRefreshAll = async () => {
    const result = await refreshAllDeliverables();

    if (result.success) {
      alert('All deliverables refreshed!');
    } else {
      alert('Refresh failed: ' + result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">🎯 Demo Actions</h2>

      <div className="flex gap-4">
        {/* Update Element */}
        <div className="flex-1 flex gap-2">
          <select
            value={selectedElement?.id || ''}
            onChange={(e) => {
              const elem = elements.find(el => el.id === e.target.value);
              setSelectedElement(elem);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select element to update...</option>
            {elements.map(elem => (
              <option key={elem.id} value={elem.id}>
                {elem.name} v{elem.version}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdateElement}
            disabled={loading || !selectedElement}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
          >
            Update Element
          </button>
        </div>

        {/* Refresh All */}
        <button
          onClick={handleRefreshAll}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          Refresh All Deliverables
        </button>
      </div>
    </div>
  );
}
```

**Verification:**
- Element dropdown populated from context
- Update triggers alert reload
- Refresh all updates entire grid

---

## Phase 3: Display Components (2.5 hours)

### Task 3.1: ProvenanceViewer Component
**File:** `src/components/demo/ProvenanceViewer.jsx`

**Implementation:**
```javascript
export default function ProvenanceViewer({ deliverable }) {
  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-3">📋 Provenance Record</h4>

      <div className="space-y-2 text-sm">
        {/* Template Info */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Template:</span>
          <span className="font-mono text-xs">{deliverable.template_id} (v{deliverable.template_version})</span>
        </div>

        {/* Story Model */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Story Model:</span>
          <span className="font-mono text-xs">{deliverable.story_model_id}</span>
        </div>

        {/* Voice */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Brand Voice:</span>
          <span className="font-mono text-xs">{deliverable.voice_id} (v{deliverable.voice_version})</span>
        </div>

        {/* Element Versions */}
        <div>
          <span className="text-gray-600 block mb-1">Element Versions:</span>
          <div className="bg-gray-50 rounded p-2 space-y-1">
            {Object.entries(deliverable.element_versions || {}).map(([id, version]) => (
              <div key={id} className="font-mono text-xs">
                {id.substring(0, 8)}... → v{version}
              </div>
            ))}
          </div>
        </div>

        {/* Instance Fields */}
        {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
          <div>
            <span className="text-gray-600 block mb-1">Instance Fields:</span>
            <div className="bg-gray-50 rounded p-2 space-y-1">
              {Object.entries(deliverable.instance_data).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transformation Metadata */}
        {deliverable.transformation_metadata && (
          <div>
            <span className="text-gray-600 block mb-1">Transformation:</span>
            <div className="bg-gray-50 rounded p-2 text-xs space-y-1">
              <div>Method: {deliverable.transformation_metadata.method}</div>
              {deliverable.transformation_metadata.model && (
                <div>Model: {deliverable.transformation_metadata.model}</div>
              )}
              <div>Changes: {deliverable.transformation_metadata.total_changes || 0}</div>
              <div>Timestamp: {new Date(deliverable.transformation_metadata.timestamp).toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t">
          <div>Created: {new Date(deliverable.created_at).toLocaleString()}</div>
          <div>Updated: {new Date(deliverable.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
```

**Verification:**
- All provenance fields displayed
- UUIDs truncated for readability
- Timestamps formatted properly

### Task 3.2: StoryModelSelector Component
**File:** `src/components/demo/StoryModelSelector.jsx`

**Implementation:**
```javascript
import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';

export default function StoryModelSelector({ deliverableId, currentModelId, onModelChange, onCancel }) {
  const { templates } = useDemo();
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract unique story models from templates
  const storyModels = [...new Set(templates.map(t => ({
    id: t.story_model_id,
    name: t.name.includes('Manifesto') ? 'Problem-Agitate-Solve' : 'Inverted Pyramid'
  })))];

  const handleSave = () => {
    if (selectedModelId === currentModelId) {
      onCancel();
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onModelChange(selectedModelId);
    setShowConfirm(false);
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-semibold text-sm mb-3">Change Story Model</h4>

      {!showConfirm ? (
        <div className="space-y-3">
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {storyModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save & Re-render
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-3">
            ⚠️ Changing the story model will reflow sections. Some content may need to be remapped.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Confirm Change
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Verification:**
- Lists available story models
- Shows confirmation warning
- Calls onModelChange callback

### Task 3.3: DeliverableCard Component
**File:** `src/components/demo/DeliverableCard.jsx`

**Implementation:**
```javascript
import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import ProvenanceViewer from './ProvenanceViewer';
import StoryModelSelector from './StoryModelSelector';

export default function DeliverableCard({ deliverable }) {
  const { refreshDeliverable, deleteDeliverable, updateDeliverableStoryModel } = useDemo();
  const [expanded, setExpanded] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const voiceColor = deliverable.voice_id.includes('Corporate')
    ? 'border-blue-500'
    : 'border-green-500';

  const voiceIcon = deliverable.voice_id.includes('Corporate') ? '🔵' : '🟢';

  const transformationBadge = deliverable.transformation_metadata
    ? (deliverable.transformation_metadata.method === 'llm' ? '🤖 LLM' : '⚙️ Rule-based')
    : null;

  const hasAlerts = deliverable.alerts && deliverable.alerts.length > 0;

  const handleRefresh = async () => {
    await refreshDeliverable(deliverable.id);
  };

  const handleDelete = async () => {
    if (confirm('Delete this deliverable?')) {
      await deleteDeliverable(deliverable.id);
    }
  };

  const handleModelChange = async (newModelId) => {
    await updateDeliverableStoryModel(deliverable.id, newModelId);
    setEditMode(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${voiceColor} overflow-hidden`}>
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{deliverable.name}</h3>
          {transformationBadge && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {transformationBadge}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div>{voiceIcon} Voice: v{deliverable.voice_version}</div>
          <div>Story Model: {deliverable.story_model_id?.substring(0, 20)}...</div>
          <div>Status: {deliverable.status}</div>

          {/* Instance Fields Summary */}
          {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
            <div className="text-xs mt-2 bg-gray-50 rounded p-2">
              <span className="font-semibold">Instance:</span>{' '}
              {Object.entries(deliverable.instance_data).slice(0, 2).map(([k, v]) => (
                <span key={k}>{k}: {v.substring(0, 15)}...</span>
              )).join(', ')}
              {Object.keys(deliverable.instance_data).length > 2 && (
                <span> +{Object.keys(deliverable.instance_data).length - 2} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Impact Alerts */}
      {hasAlerts && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-300">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-yellow-800">Impact Alerts</h4>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                {deliverable.alerts.map((alert) => (
                  <li key={alert.element_id}>
                    • {alert.element_name}: v{alert.old_version} → v{alert.new_version} ({alert.status})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 border-b bg-gray-50">
          {Object.entries(deliverable.rendered_content || {}).map(([section, content]) => (
            <div key={section} className="mb-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">📄 {section}</h4>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>

              {/* Transformation Notes */}
              {deliverable.transformation_notes?.[section] && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="font-semibold text-blue-800 mb-1">
                    💡 {deliverable.transformation_notes[section].summary}
                  </div>

                  {showChangelog && deliverable.transformation_notes[section].changes && (
                    <div className="mt-2 space-y-1">
                      {deliverable.transformation_notes[section].changes.map((change, idx) => (
                        <div key={idx} className="text-blue-700">
                          "{change.original}" → "{change.transformed}"
                          <div className="text-blue-600 ml-2">└─ {change.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {deliverable.transformation_notes && (
            <button
              onClick={() => setShowChangelog(!showChangelog)}
              className="text-xs text-blue-600 hover:underline"
            >
              {showChangelog ? 'Hide' : 'Show'} detailed changelog
            </button>
          )}
        </div>
      )}

      {/* Provenance Viewer */}
      {showProvenance && (
        <div className="p-4 border-b bg-gray-50">
          <ProvenanceViewer deliverable={deliverable} />
        </div>
      )}

      {/* Edit Mode - Story Model Selector */}
      {editMode && (
        <div className="p-4 border-b bg-gray-50">
          <StoryModelSelector
            deliverableId={deliverable.id}
            currentModelId={deliverable.story_model_id}
            onModelChange={handleModelChange}
            onCancel={() => setEditMode(false)}
          />
        </div>
      )}

      {/* Card Actions */}
      <div className="p-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          {expanded ? 'Hide Content ▲' : 'View Content ▼'}
        </button>
        <button
          onClick={() => setShowProvenance(!showProvenance)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          {showProvenance ? 'Hide' : 'Show'} Provenance
        </button>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
        >
          Refresh
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

**Verification:**
- Card displays all metadata
- Alerts show with yellow badge
- Content expands/collapses
- Provenance toggles
- Edit mode shows story model selector
- Transformation notes displayed when available

### Task 3.4: DeliverableGrid Component
**File:** `src/components/demo/DeliverableGrid.jsx`

**Implementation:**
```javascript
import { useDemo } from '../../context/DemoContext';
import DeliverableCard from './DeliverableCard';

export default function DeliverableGrid() {
  const { deliverables } = useDemo();

  if (deliverables.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-lg text-gray-600 mb-2">No deliverables yet</p>
        <p className="text-sm text-gray-500">Create your first deliverable using the form above</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Deliverables ({deliverables.length} total)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliverables.map(deliverable => (
          <DeliverableCard key={deliverable.id} deliverable={deliverable} />
        ))}
      </div>
    </div>
  );
}
```

**Verification:**
- Empty state shows helpful message
- Grid responsive (1/2/3 columns)
- Cards render with proper spacing

---

## Phase 4: Page Integration (1 hour)

### Task 4.1: Update DemoPage
**File:** `src/pages/DemoPage.jsx`

**Implementation:**
```javascript
import { Link } from 'react-router-dom';
import { DemoProvider } from '../context/DemoContext';
import DeliverableBuilder from '../components/demo/DeliverableBuilder';
import DemoActionsPanel from '../components/demo/DemoActionsPanel';
import DeliverableGrid from '../components/demo/DeliverableGrid';

export default function DemoPage() {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              StoryOS Phase 2 Demo
            </h1>
            <p className="text-gray-600">
              Interactive demonstration of voice transformations, story models, and impact alerts
            </p>
            <Link to="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              ← Back to Home
            </Link>
          </div>

          {/* Builder */}
          <DeliverableBuilder />

          {/* Actions */}
          <DemoActionsPanel />

          {/* Grid */}
          <DeliverableGrid />

          {/* Info Panel */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">How This Demo Works</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>1. Create Deliverables:</strong> Select template and voice, fill instance fields, click Create
              </p>
              <p>
                <strong>2. Update Elements:</strong> Select an element and click Update to trigger impact alerts
              </p>
              <p>
                <strong>3. View Transformations:</strong> Expand cards to see voice transformations and changelog
              </p>
              <p>
                <strong>4. Switch Story Models:</strong> Click Edit to change story model and re-render
              </p>
              <p>
                <strong>5. Check Provenance:</strong> Click Show Provenance to see full audit trail
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoProvider>
  );
}
```

**Verification:**
- All components render correctly
- Context provides data to children
- Layout matches mockup

---

## Phase 5: Testing & Polish (1 hour)

### Task 5.1: Manual Testing Checklist

**Create Deliverable Flow:**
- [ ] Select Brand Manifesto template → No instance fields shown
- [ ] Select Press Release template → Instance fields appear
- [ ] Leave required field empty → Error message displays
- [ ] Fill all fields → Create succeeds
- [ ] Card appears in grid with correct voice color

**Impact Alerts Flow:**
- [ ] Create 2 deliverables using same element
- [ ] Update that element via demo actions
- [ ] Both deliverables show yellow alert badges
- [ ] Alert shows version change (v1.0 → v1.1)
- [ ] Click Refresh on one deliverable → Its alert clears
- [ ] Click Refresh All → All alerts clear

**Provenance Viewer:**
- [ ] Click Show Provenance → All fields displayed
- [ ] Template ID, Story Model, Voice shown
- [ ] Element versions listed
- [ ] Instance data shown (if present)
- [ ] Timestamps formatted correctly

**Story Model Switching:**
- [ ] Click Edit → Story model selector appears
- [ ] Select different model → Confirmation warning shows
- [ ] Confirm → Deliverable re-renders with new sections
- [ ] Cancel → Returns to view mode

**Transformation Notes (when available):**
- [ ] Expand card → Transformation summary shows per section
- [ ] Click Show Changelog → Detailed changes display
- [ ] Annotations show original → transformed
- [ ] Reason for each change displayed

### Task 5.2: Responsive Design Testing
- [ ] Desktop (>1200px) → 3 columns
- [ ] Tablet (768-1200px) → 2 columns
- [ ] Mobile (<768px) → 1 column
- [ ] Cards remain readable at all sizes

### Task 5.3: Error Handling Testing
- [ ] Create deliverable with API error → Error message displays
- [ ] Network failure during refresh → User-friendly error
- [ ] Missing transformation_notes → No crash, graceful fallback

---

## Success Criteria

**Functionality:**
✅ Create multiple deliverables with different templates/voices/instance data
✅ Update elements triggers impact alerts on affected deliverables
✅ Refresh workflow clears alerts and pulls latest versions
✅ Story model switching re-renders deliverable
✅ Provenance viewer shows complete audit trail
✅ LLM transformation notes display (when backend provides them)

**UX:**
✅ Responsive grid layout works on all screen sizes
✅ Loading states shown during API calls
✅ Error messages are user-friendly
✅ Empty states guide user action

**Code Quality:**
✅ Components are modular and reusable
✅ Context manages state cleanly
✅ Error handling consistent across components
✅ Code follows existing project patterns

---

## Future Enhancements (Out of Scope)

- **Backend LLM Integration:** Actual transformation_notes generation
- **Real-time Updates:** WebSocket for live alert notifications
- **Deliverable Export:** PDF/DOCX download
- **Advanced Filtering:** Filter grid by template/voice/status
- **Undo/Redo:** Revert deliverable changes
- **Version History:** Timeline view of all deliverable revisions

---

## Notes for Implementation

**Order of Implementation:**
1. Start with DemoContext - foundation for everything
2. Build form components (Builder, InstanceFieldsForm, ActionsPanel)
3. Build display components (Card, Grid, Provenance, StoryModelSelector)
4. Integrate into DemoPage
5. Test thoroughly with manual checklist

**Key Dependencies:**
- Backend must return `transformation_notes` and `transformation_metadata` for LLM features
- Backend must support story_model_id update in deliverable update endpoint
- All existing API endpoints must continue working

**Testing Strategy:**
- Build incrementally, test each component in isolation first
- Use browser console to verify data flow
- Test error cases (network failures, validation errors)
- Final end-to-end test of all workflows

---

**Estimated Total Time: 6-8 hours**

This plan provides complete implementation details for every component, verification steps, and a comprehensive testing checklist.
