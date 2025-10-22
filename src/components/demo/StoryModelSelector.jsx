import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';

export default function StoryModelSelector({ deliverableId, currentModelId, onModelChange, onCancel }) {
  const { templates } = useDemo();
  const [selectedModelId, setSelectedModelId] = useState(currentModelId);
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract unique story models from templates
  const storyModels = [];
  const seen = new Set();
  templates.forEach(t => {
    if (!seen.has(t.story_model_id)) {
      seen.add(t.story_model_id);
      storyModels.push({
        id: t.story_model_id,
        name: t.name.includes('Manifesto') ? 'Problem-Agitate-Solve' : 'Inverted Pyramid'
      });
    }
  });

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
