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
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Template
          </label>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a template...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Voice Selector */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Voice
          </label>
          <select
            value={selectedVoice?.id || ''}
            onChange={(e) => {
              const voice = voices.find(v => v.id === e.target.value);
              setSelectedVoice(voice);
            }}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
