import { useState, useEffect } from 'react';
import { unfAPI } from '../api/client';

export default function ElementsPage() {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadElements();
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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">UNF Elements</h1>
        <span className="text-sm text-gray-500">{elements.length} elements</span>
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
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {element.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {element.content}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Version {element.version}</span>
              <span>{new Date(element.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
