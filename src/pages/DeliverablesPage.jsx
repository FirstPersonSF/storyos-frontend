import { useState, useEffect } from 'react';
import { deliverablesAPI } from '../api/client';

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    loadDeliverables();
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

  const loadDeliverableWithAlerts = async (id) => {
    try {
      const response = await deliverablesAPI.getDeliverableWithAlerts(id);
      setSelectedDeliverable(response.data);
      setAlerts(response.data.alerts || []);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Deliverables</h1>
        <span className="text-sm text-gray-500">{deliverables.length} deliverables</span>
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

            <button
              onClick={() => loadDeliverableWithAlerts(deliverable.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Check for Updates
            </button>

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
    </div>
  );
}
