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

      <div className="flex gap-4 flex-wrap">
        {/* Update Element */}
        <div className="flex-1 min-w-[300px] flex gap-2">
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
