import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { unfAPI } from '../api/client';

export default function ElementsPage() {
  const [elements, setElements] = useState([]);
  const [layers, setLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingElement, setEditingElement] = useState(null);
  const [formData, setFormData] = useState({
    layer_id: '',
    name: '',
    content: '',
    metadata: {}
  });

  useEffect(() => {
    loadElements();
    loadLayers();
  }, []);

  const loadElements = async () => {
    try {
      setLoading(true);
      const response = await unfAPI.getElements();
      setElements(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLayers = async () => {
    try {
      const response = await unfAPI.getLayers();
      setLayers(response.data);
    } catch (err) {
      console.error('Error loading layers:', err);
    }
  };

  const handleCreate = () => {
    setEditingElement(null);
    setFormData({
      layer_id: '',
      name: '',
      content: '',
      metadata: {}
    });
    setShowCreateModal(true);
  };

  const handleEdit = (element) => {
    setEditingElement(element);
    setFormData({
      content: element.content,
      metadata: element.metadata || {}
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingElement) {
        // Update creates a new version
        await unfAPI.updateElement(editingElement.id, {
          content: formData.content,
          metadata: formData.metadata
        });
      } else {
        // Create new element
        await unfAPI.createElement(formData);
      }
      setShowCreateModal(false);
      loadElements();
    } catch (err) {
      alert('Error saving element: ' + err.message);
    }
  };

  const handleApprove = async (elementId) => {
    try {
      await unfAPI.approveElement(elementId);
      loadElements();
    } catch (err) {
      alert('Error approving element: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">UNF Elements</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{elements.length} elements</span>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create Element
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {elements.map((element) => (
          <div key={element.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{element.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  element.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : element.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : element.status === 'superseded'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {element.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {element.content}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Version {element.version}</span>
              <span>{new Date(element.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(element)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
              >
                Edit (New Version)
              </button>
              {element.status === 'draft' && (
                <button
                  onClick={() => handleApprove(element.id)}
                  className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>

      {/* Create/Edit Modal */}
      {showCreateModal && createPortal((
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h2 className="text-2xl font-bold mb-4">
              {editingElement ? `Edit: ${editingElement.name}` : 'Create New Element'}
            </h2>
            {editingElement && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  Editing will create a new version ({editingElement.version} → new version).
                  The old version will be marked as superseded.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingElement && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Layer
                    </label>
                    <select
                      required
                      value={formData.layer_id}
                      onChange={(e) => setFormData({ ...formData, layer_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a layer...</option>
                      {layers.map((layer) => (
                        <option key={layer.id} value={layer.id}>
                          {layer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Company Mission Statement"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the element content..."
                />
              </div>
              <div className="flex gap-3 justify-end">
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
                  {editingElement ? 'Save New Version' : 'Create Element'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ), document.body)}
    </>
  );
}
