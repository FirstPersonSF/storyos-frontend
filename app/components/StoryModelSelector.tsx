"use client"

import { useState, useEffect, useRef } from 'react';
import { useDemo } from '../context/DemoContext';
import { templatesAPI } from '@/lib/api/client';

interface StoryModelSelectorProps {
  deliverableId: string;
  currentModelId: string;
  currentVoiceId: string;
  currentInstanceData: any;
  onModelChange: (newModelId: string, instanceData?: any) => Promise<void>;
  onVoiceChange: (newVoiceId: string) => Promise<void>;
  onCancel: () => void;
}

export default function StoryModelSelector({
  deliverableId,
  currentModelId,
  currentVoiceId,
  currentInstanceData,
  onModelChange,
  onVoiceChange,
  onCancel
}: StoryModelSelectorProps) {
  const { storyModels, templates, voices } = useDemo();
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);
  const [selectedVoiceId, setSelectedVoiceId] = useState(currentVoiceId);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstanceFields, setShowInstanceFields] = useState(false);
  const [instanceData, setInstanceData] = useState(currentInstanceData || {});
  const [instanceFields, setInstanceFields] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const confirmSectionRef = useRef<HTMLDivElement>(null);

  // Get template for selected story model
  const selectedTemplate = templates.find(t => t.story_model_id === selectedModelId);

  // Scroll to confirm section when it appears
  useEffect(() => {
    if (showConfirm && confirmSectionRef.current) {
      confirmSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showConfirm]);

  const handleSave = async () => {
    const modelChanged = selectedModelId !== currentModelId;
    const voiceChanged = selectedVoiceId !== currentVoiceId;

    // If nothing changed, just cancel
    if (!modelChanged && !voiceChanged) {
      onCancel();
      return;
    }

    // If only voice changed, handle it immediately
    if (voiceChanged && !modelChanged) {
      await onVoiceChange(selectedVoiceId);
      // Don't call onCancel() - let parent component handle UI state
      return;
    }

    // If model changed, check if new story model's template has instance fields
    if (selectedTemplate && selectedTemplate.instance_fields && selectedTemplate.instance_fields.length > 0) {
      setInstanceFields(selectedTemplate.instance_fields);
      setShowInstanceFields(true);
    } else {
      setShowConfirm(true);
    }
  };

  const handleInstanceFieldsComplete = () => {
    // Validate required fields
    const missingFields = instanceFields
      .filter((field: any) => field.required && !instanceData[field.name])
      .map((field: any) => field.name);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    setShowInstanceFields(false);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const modelChanged = selectedModelId !== currentModelId;
    const voiceChanged = selectedVoiceId !== currentVoiceId;

    // Handle model change first if needed
    if (modelChanged) {
      await onModelChange(selectedModelId, instanceData);
    }

    // Handle voice change if needed and model didn't change
    // (if model changed, voice stays the same)
    if (voiceChanged && !modelChanged) {
      await onVoiceChange(selectedVoiceId);
    }

    setShowConfirm(false);
  };

  const handleInstanceFieldChange = (fieldName: string, value: any) => {
    setInstanceData((prev: any) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="border-t-2 border-gray-200 pt-6 mt-6">
      <h4 className="text-lg font-bold text-foreground mb-4">Edit Deliverable</h4>

      {!showInstanceFields && !showConfirm ? (
        <div className="space-y-4">
          {/* Story Model Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Story Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
            >
              {storyModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Brand Voice
            </label>
            <select
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTemplate && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Template:</strong> {selectedTemplate.name}
              {selectedTemplate.instance_fields && selectedTemplate.instance_fields.length > 0 && (
                <span className="ml-2 text-[#003A70] font-semibold">
                  ({selectedTemplate.instance_fields.length} fields required)
                </span>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#003A70] text-white px-6 py-3 rounded-lg hover:bg-[#0052A3] font-semibold text-base transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : showInstanceFields ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-base text-blue-800 font-semibold mb-4">
              This story model requires additional information. Please fill in the fields below:
            </p>
            <div className="space-y-4">
              {instanceFields.map((field: any) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    {field.description || field.name}
                    {field.required && <span className="text-red-600 ml-1">*</span>}
                  </label>
                  {field.field_type === 'text' ? (
                    <input
                      type="text"
                      value={instanceData[field.name] || ''}
                      onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      required={field.required}
                      placeholder={field.description}
                    />
                  ) : field.field_type === 'date' ? (
                    <input
                      type="date"
                      value={instanceData[field.name] || ''}
                      onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type="text"
                      value={instanceData[field.name] || ''}
                      onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleInstanceFieldsComplete}
              className="flex-1 bg-[#003A70] text-white px-6 py-3 rounded-lg hover:bg-[#0052A3] font-semibold text-base transition-colors"
            >
              Continue
            </button>
            <button
              onClick={() => {
                setShowInstanceFields(false);
                setInstanceData(currentInstanceData || {});
              }}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-base transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div ref={confirmSectionRef} className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <p className="text-base text-yellow-800 mb-4 font-semibold">
            ⚠️ Changing the story model will reflow sections. Some content may need to be remapped.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold text-base transition-colors"
            >
              Confirm Change
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                if (instanceFields.length > 0) {
                  setShowInstanceFields(true);
                }
              }}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-base transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
