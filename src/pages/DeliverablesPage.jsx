import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { deliverablesAPI, templatesAPI, unfAPI, voicesAPI } from '../api/client';

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [elements, setElements] = useState([]);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    template_id: '',
    voice_id: '',
    instance_data: {},
    selected_elements: []
  });

  useEffect(() => {
    loadDeliverables();
    loadTemplates();
    loadElements();
    loadVoices();
  }, []);

  const loadDeliverables = async () => {
    try {
      setLoading(true);
      const response = await deliverablesAPI.getDeliverables();
      setDeliverables(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await templatesAPI.getTemplates();
      setTemplates(response.data);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const loadElements = async () => {
    try {
      const response = await unfAPI.getElements();
      // Only show approved elements
      setElements(response.data.filter(e => e.status === 'approved'));
    } catch (err) {
      console.error('Error loading elements:', err);
    }
  };

  const loadVoices = async () => {
    try {
      const response = await voicesAPI.getVoices();
      setVoices(response.data);
    } catch (err) {
      console.error('Error loading voices:', err);
    }
  };

  const loadDeliverableWithAlerts = async (id) => {
    try {
      const response = await deliverablesAPI.getDeliverableWithAlerts(id);
      setSelectedDeliverable(response.data);
      setAlerts(response.data.alerts || []);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      template_id: '',
      voice_id: '',
      instance_data: {},
      selected_elements: []
    });
    setShowCreateModal(true);
  };

  const toggleElement = (elementId) => {
    setFormData(prev => ({
      ...prev,
      selected_elements: prev.selected_elements.includes(elementId)
        ? prev.selected_elements.filter(id => id !== elementId)
        : [...prev.selected_elements, elementId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build element_versions mapping
      const element_versions = {};
      formData.selected_elements.forEach(elementId => {
        const element = elements.find(e => e.id === elementId);
        if (element) {
          element_versions[elementId] = element.version;
        }
      });

      await deliverablesAPI.createDeliverable({
        name: formData.name,
        template_id: formData.template_id,
        voice_id: formData.voice_id,
        instance_data: formData.instance_data,
        element_versions
      });

      setShowCreateModal(false);
      loadDeliverables();
    } catch (err) {
      alert('Error creating deliverable: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Deliverables</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{deliverables.length} deliverables</span>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create Deliverable
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliverables.map((deliverable) => (
          <div key={deliverable.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{deliverable.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Template v{deliverable.template_version} | Voice v{deliverable.voice_version}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded ${
                  deliverable.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : deliverable.status === 'approved'
                    ? 'bg-blue-100 text-blue-800'
                    : deliverable.status === 'review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {deliverable.status}
              </span>
            </div>

            {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded text-sm">
                <strong className="text-gray-700">Instance Data:</strong>
                <div className="mt-1 space-y-1">
                  {Object.entries(deliverable.instance_data).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="text-gray-600">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setViewingContent(deliverable)}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                View Content
              </button>
              <button
                onClick={() => loadDeliverableWithAlerts(deliverable.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Check for Updates
              </button>
            </div>

            {selectedDeliverable?.id === deliverable.id && (
              <div className="mt-4 p-4 border-t">
                {alerts && alerts.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-amber-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <strong>{alerts.length} Update{alerts.length !== 1 ? 's' : ''} Available</strong>
                    </div>
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="pl-7 text-sm text-gray-700">
                        <strong>{alert.element_name}:</strong> v{alert.old_version} → v{alert.new_version}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-green-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Up to date</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && createPortal((
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Deliverable</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deliverable Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q4 Product Launch Blog Post"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    required
                    value={formData.template_id}
                    onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} (v{template.version})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Voice
                  </label>
                  <select
                    required
                    value={formData.voice_id}
                    onChange={(e) => setFormData({ ...formData, voice_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select voice...</option>
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} (v{voice.version})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Elements to Include
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {elements.length === 0 ? (
                    <p className="text-gray-500 text-sm">No approved elements available</p>
                  ) : (
                    <div className="space-y-2">
                      {elements.map((element) => (
                        <label
                          key={element.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selected_elements.includes(element.id)}
                            onChange={() => toggleElement(element.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{element.name}</div>
                            <div className="text-xs text-gray-500">v{element.version} - {element.content.substring(0, 60)}...</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.selected_elements.length} element(s) selected
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      ), document.body)}

      {/* View Content Modal */}
      {viewingContent && createPortal((
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{viewingContent.name}</h2>
              <button
                onClick={() => setViewingContent(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Template: <strong>{viewingContent.template_version}</strong> |
                Voice: <strong>{viewingContent.voice_version}</strong> |
                Status: <strong className="capitalize">{viewingContent.status}</strong>
              </p>
            </div>

            {viewingContent.rendered_content && Object.keys(viewingContent.rendered_content).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(viewingContent.rendered_content).map(([section, content]) => (
                  <div key={section} className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">{section}</h3>
                    <div className="text-gray-700 whitespace-pre-wrap">{content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No rendered content available
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingContent(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
