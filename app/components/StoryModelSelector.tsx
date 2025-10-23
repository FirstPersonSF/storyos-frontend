"use client"

import { useState, useEffect, useRef } from 'react';
import { useDemo } from '../context/DemoContext';
import { templatesAPI } from '@/lib/api/client';

interface StoryModelSelectorProps {
  deliverableId: string;
  currentModelId: string;
  currentInstanceData: any;
  onModelChange: (newModelId: string, instanceData?: any) => Promise<void>;
  onCancel: () => void;
}

export default function StoryModelSelector({
  deliverableId,
  currentModelId,
  currentInstanceData,
  onModelChange,
  onCancel
}: StoryModelSelectorProps) {
  const { storyModels, templates } = useDemo();
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);
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
    if (selectedModelId === currentModelId) {
      onCancel();
      return;
    }

    // Check if new story model's template has instance fields
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

  const handleConfirm = () => {
    onModelChange(selectedModelId, instanceData);
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
      <h4 className="text-lg font-bold text-foreground mb-4">Change Story Model</h4>

      {!showInstanceFields && !showConfirm ? (
        <div className="space-y-4">
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
