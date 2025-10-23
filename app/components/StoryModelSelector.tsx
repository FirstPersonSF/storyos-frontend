"use client"

import { useState } from 'react';
import { useDemo } from '../context/DemoContext';

interface StoryModelSelectorProps {
  deliverableId: string;
  currentModelId: string;
  onModelChange: (newModelId: string) => Promise<void>;
  onCancel: () => void;
}

export default function StoryModelSelector({
  deliverableId,
  currentModelId,
  onModelChange,
  onCancel
}: StoryModelSelectorProps) {
  const { storyModels } = useDemo();
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="border-t-2 border-gray-200 pt-6 mt-6">
      <h4 className="text-lg font-bold text-foreground mb-4">Change Story Model</h4>

      {!showConfirm ? (
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

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#003A70] text-white px-6 py-3 rounded-lg hover:bg-[#0052A3] font-semibold text-base transition-colors"
            >
              Save & Re-render
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
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
              onClick={() => setShowConfirm(false)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
