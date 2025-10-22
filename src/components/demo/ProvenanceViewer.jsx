export default function ProvenanceViewer({ deliverable }) {
  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-sm text-gray-700 mb-3">📋 Provenance Record</h4>

      <div className="space-y-2 text-sm text-left">
        {/* Template Info */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Template:</span>
          <span className="font-mono text-xs">{deliverable.template_id} (v{deliverable.template_version})</span>
        </div>

        {/* Story Model */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Story Model:</span>
          <span className="font-mono text-xs">{deliverable.story_model_id}</span>
        </div>

        {/* Voice */}
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-600">Brand Voice:</span>
          <span className="font-mono text-xs">{deliverable.voice_id} (v{deliverable.voice_version})</span>
        </div>

        {/* Element Versions */}
        <div>
          <span className="text-gray-600 block mb-1">Element Versions:</span>
          <div className="bg-gray-50 rounded p-2 space-y-1">
            {Object.entries(deliverable.element_versions || {}).map(([id, version]) => (
              <div key={id} className="font-mono text-xs">
                {id.substring(0, 8)}... → v{version}
              </div>
            ))}
          </div>
        </div>

        {/* Instance Fields */}
        {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
          <div>
            <span className="text-gray-600 block mb-1">Instance Fields:</span>
            <div className="bg-gray-50 rounded p-2 space-y-1">
              {Object.entries(deliverable.instance_data).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transformation Metadata */}
        {deliverable.transformation_metadata && (
          <div>
            <span className="text-gray-600 block mb-1">Transformation:</span>
            <div className="bg-gray-50 rounded p-2 text-xs space-y-1">
              <div>Method: {deliverable.transformation_metadata.method}</div>
              {deliverable.transformation_metadata.model && (
                <div>Model: {deliverable.transformation_metadata.model}</div>
              )}
              <div>Changes: {deliverable.transformation_metadata.total_changes || 0}</div>
              {deliverable.transformation_metadata.timestamp && (
                <div>Timestamp: {new Date(deliverable.transformation_metadata.timestamp).toLocaleString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t">
          <div>Created: {new Date(deliverable.created_at).toLocaleString()}</div>
          <div>Updated: {new Date(deliverable.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
