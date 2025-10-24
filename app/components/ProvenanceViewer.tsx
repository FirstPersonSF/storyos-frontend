"use client"

import { useState, useEffect } from 'react';
import { useDemo } from '../context/DemoContext';
import { deliverablesAPI } from '@/lib/api/client';

interface ProvenanceViewerProps {
  deliverable: any;
}

export default function ProvenanceViewer({ deliverable }: ProvenanceViewerProps) {
  const { templates, voices, elements, storyModels } = useDemo();
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Find names from context
  const template = templates.find(t => t.id === deliverable.template_id);
  const voice = voices.find(v => v.id === deliverable.voice_id);
  const storyModel = storyModels.find(sm => sm.id === deliverable.story_model_id);

  // Load version history on mount
  useEffect(() => {
    const loadVersions = async () => {
      setLoadingVersions(true);
      try {
        const response = await deliverablesAPI.getDeliverableVersions(deliverable.id);
        setVersions(response.data);
      } catch (error) {
        console.error('Failed to load version history:', error);
      } finally {
        setLoadingVersions(false);
      }
    };
    loadVersions();
  }, [deliverable.id]);

  // Helper to get element name
  const getElementName = (elementId: string) => {
    const element = elements.find(e => e.id === elementId);
    return element ? element.name : 'Unknown';
  };

  // Helper to get story model name
  const getStoryModelName = (storyModelId: string) => {
    const model = storyModels.find(sm => sm.id === storyModelId);
    return model ? model.name : 'Unknown Story Model';
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
            <div className="font-bold text-base text-foreground">{storyModel?.name || 'Unknown Story Model'}</div>
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

        {/* Version History */}
        <div>
          <span className="text-muted-foreground font-semibold block mb-2">Version History:</span>
          {loadingVersions ? (
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 text-sm text-gray-500">
              Loading version history...
            </div>
          ) : versions.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="space-y-3">
                {versions.map((version: any, index: number) => {
                  const isCurrentVersion = version.id === deliverable.id;
                  const versionStoryModel = getStoryModelName(version.story_model_id);
                  const versionVoice = voices.find(v => v.id === version.voice_id);
                  const versionVoiceName = versionVoice ? `${versionVoice.name} v${version.voice_version}` : `v${version.voice_version}`;

                  return (
                    <div
                      key={version.id}
                      className={`p-3 rounded-lg border ${
                        isCurrentVersion
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">v{version.version}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            version.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : version.status === 'superseded'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {version.status}
                          </span>
                          {isCurrentVersion && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-600 text-white">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(version.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><span className="font-semibold">Story Model:</span> {versionStoryModel}</div>
                        <div><span className="font-semibold">Voice:</span> {versionVoiceName}</div>
                        {version.prev_deliverable_id && (
                          <div className="text-xs text-gray-400 mt-1">
                            ↑ Supersedes previous version
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {versions.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-gray-500">
                  <strong>Total versions:</strong> {versions.length} • <strong>Changes tracked:</strong> Story model, voice, instance data, element updates
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 text-sm text-gray-500">
              No version history available
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4 border-t-2 border-gray-200">
          <div><span className="font-bold">Created:</span> {new Date(deliverable.created_at).toLocaleString()}</div>
          <div><span className="font-bold">Updated:</span> {new Date(deliverable.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
