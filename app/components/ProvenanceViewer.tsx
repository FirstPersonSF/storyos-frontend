"use client"

import { useDemo } from '../context/DemoContext';

interface ProvenanceViewerProps {
  deliverable: any;
}

export default function ProvenanceViewer({ deliverable }: ProvenanceViewerProps) {
  const { templates, voices, elements } = useDemo();

  // Find names from context
  const template = templates.find(t => t.id === deliverable.template_id);
  const voice = voices.find(v => v.id === deliverable.voice_id);

  // Helper to get element name
  const getElementName = (elementId: string) => {
    const element = elements.find(e => e.id === elementId);
    return element ? element.name : 'Unknown';
  };

  return (
    <div className="mt-6 border-t-2 border-gray-200 pt-6">
      <h4 className="text-lg font-bold text-foreground mb-4">📋 Provenance Record</h4>

      <div className="space-y-4 text-base text-left">
        {/* Template Info */}
        <div>
          <span className="text-muted-foreground font-semibold block mb-2">Template:</span>
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div className="font-bold text-base text-foreground">{template?.name || 'Unknown Template'}</div>
            <div className="font-mono text-sm text-muted-foreground mt-1">{deliverable.template_id} (v{deliverable.template_version})</div>
          </div>
        </div>

        {/* Story Model */}
        <div>
          <span className="text-muted-foreground font-semibold block mb-2">Story Model:</span>
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div className="font-bold text-base text-foreground">Problem-Agitate-Solve (PAS)</div>
            <div className="font-mono text-sm text-muted-foreground mt-1">{deliverable.story_model_id}</div>
          </div>
        </div>

        {/* Voice */}
        <div>
          <span className="text-muted-foreground font-semibold block mb-2">Brand Voice:</span>
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
            <div className="font-bold text-base text-foreground">{voice?.name || 'Unknown Voice'}</div>
            <div className="font-mono text-sm text-muted-foreground mt-1">{deliverable.voice_id} (v{deliverable.voice_version})</div>
          </div>
        </div>

        {/* Element Versions */}
        <div>
          <span className="text-muted-foreground font-semibold block mb-2">Element Versions:</span>
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 space-y-2">
            {Object.entries(deliverable.element_versions || {}).map(([id, version]) => (
              <div key={id} className="text-sm">
                <div className="font-bold text-foreground">{getElementName(id)}</div>
                <div className="font-mono text-muted-foreground">{id.substring(0, 8)}... → v{version as number}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instance Fields */}
        {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
          <div>
            <span className="text-muted-foreground font-semibold block mb-2">Instance Fields:</span>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 space-y-2">
              {Object.entries(deliverable.instance_data).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-bold text-foreground">{key}:</span> <span className="text-muted-foreground">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transformation Metadata */}
        {deliverable.transformation_metadata && (
          <div>
            <span className="text-muted-foreground font-semibold block mb-2">Transformation:</span>
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 text-sm space-y-2">
              <div><span className="font-bold">Method:</span> {deliverable.transformation_metadata.method}</div>
              {deliverable.transformation_metadata.model && (
                <div><span className="font-bold">Model:</span> {deliverable.transformation_metadata.model}</div>
              )}
              <div><span className="font-bold">Changes:</span> {deliverable.transformation_metadata.total_changes || 0}</div>
              {deliverable.transformation_metadata.timestamp && (
                <div><span className="font-bold">Timestamp:</span> {new Date(deliverable.transformation_metadata.timestamp).toLocaleString()}</div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4 border-t-2 border-gray-200">
          <div><span className="font-bold">Created:</span> {new Date(deliverable.created_at).toLocaleString()}</div>
          <div><span className="font-bold">Updated:</span> {new Date(deliverable.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
