"use client"

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDemo } from '../context/DemoContext';
import ProvenanceViewer from './ProvenanceViewer';
import StoryModelSelector from './StoryModelSelector';

interface DeliverableCardProps {
  deliverable: any;
}

export default function DeliverableCard({ deliverable }: DeliverableCardProps) {
  const { refreshDeliverable, deleteDeliverable, updateDeliverableStoryModel } = useDemo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  // Get voice styling - using v0 color palette
  const isCorporate = deliverable.voice_id === '00a2f89d-0b2a-465c-b85a-29fbc4cc1b7e';
  const voiceStyles = isCorporate
    ? {
        border: 'border-[#003A70]/20',
        bg: 'bg-[#003A70]/5',
        borderB: 'border-[#003A70]/20',
        badge: 'bg-[#003A70] text-white',
        label: 'Corporate'
      }
    : {
        border: 'border-green-200',
        bg: 'bg-green-50',
        borderB: 'border-green-200',
        badge: 'bg-green-600 text-white',
        label: 'Product'
      };

  // Determine transformation badge
  const transformationMethod = deliverable.transformation_metadata?.method || 'rule-based';
  const transformationBadge = transformationMethod === 'llm'
    ? { emoji: '🤖', label: 'LLM', styles: 'bg-[#E92076] text-white' }
    : { emoji: '⚙️', label: 'Rule-based', styles: 'bg-gray-600 text-white' };

  const handleRefresh = async () => {
    await refreshDeliverable(deliverable.id);
  };

  const handleDelete = async () => {
    if (confirm('Delete this deliverable?')) {
      await deleteDeliverable(deliverable.id);
    }
  };

  const handleStoryModelChange = async (newModelId: string, instanceData?: any) => {
    const result = await updateDeliverableStoryModel(deliverable.id, newModelId, instanceData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  // Parse rendered content
  const renderedContent = typeof deliverable.rendered_content === 'string'
    ? JSON.parse(deliverable.rendered_content)
    : deliverable.rendered_content;

  // Parse transformation notes if available
  const transformationNotes = deliverable.transformation_notes
    ? (typeof deliverable.transformation_notes === 'string'
      ? JSON.parse(deliverable.transformation_notes)
      : deliverable.transformation_notes)
    : null;

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 ${voiceStyles.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${voiceStyles.bg} px-6 py-4 border-b-2 ${voiceStyles.borderB}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{deliverable.name}</h3>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className={`px-3 py-1 ${voiceStyles.badge} rounded-lg font-semibold flex items-center`}>
                {voiceStyles.label}
              </span>
              <span className={`px-3 py-1 ${transformationBadge.styles} rounded-lg font-semibold flex items-center gap-1.5`}>
                <span className="flex items-center">{transformationBadge.emoji}</span>
                <span>{transformationBadge.label}</span>
              </span>
              <span className="px-3 py-1 bg-gray-600 text-white rounded-lg font-semibold flex items-center">
                {deliverable.status}
              </span>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-lg font-semibold flex items-center">
                v{deliverable.version}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm px-4 py-2 bg-white border-2 border-[#003A70] text-[#003A70] rounded-lg hover:bg-[#003A70] hover:text-white font-semibold transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm px-4 py-2 bg-white border-2 border-[#003A70] text-[#003A70] rounded-lg hover:bg-[#003A70] hover:text-white font-semibold transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleRefresh}
              className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleDelete}
              className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Impact Alerts */}
        {deliverable.alerts && deliverable.alerts.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm font-bold text-yellow-800 mb-2">
              ⚠️ Impact Alerts ({deliverable.alerts.length})
            </p>
            <ul className="text-sm text-yellow-700 space-y-1.5">
              {deliverable.alerts.map((alert: any) => (
                <li key={alert.element_id}>
                  • {alert.element_name}: v{alert.old_version} → v{alert.new_version} ({alert.status})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Rendered Sections */}
          {renderedContent && Object.entries(renderedContent).map(([section, content]: [string, any]) => (
            <div key={section} className="border-b-2 border-gray-200 pb-6 last:border-b-0">
              <h4 className="text-lg font-bold text-foreground mb-3">{section}</h4>

              {/* Content with potential inline annotations */}
              <div className="text-base text-muted-foreground relative group text-left">
                {content ? (
                  <div className="prose prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-6 space-y-1.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1.5">{children}</ol>,
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="italic text-gray-400 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    No content - section may not have elements bound in template
                  </div>
                )}

                {/* Inline annotation tooltip (if transformation notes exist for this section) */}
                {transformationNotes && transformationNotes[section] && (
                  <div className="absolute hidden group-hover:block bg-[#E92076]/10 border-2 border-[#E92076] rounded-lg p-4 shadow-lg z-10 top-full mt-2 left-0 right-0">
                    <p className="text-sm text-[#E92076] font-bold mb-2">
                      🤖 Transformation Summary:
                    </p>
                    <p className="text-sm text-muted-foreground text-left">
                      {transformationNotes[section].summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Section transformation details */}
              {transformationNotes && transformationNotes[section] && transformationNotes[section].changes && (
                <details className="mt-3">
                  <summary className="text-sm text-[#E92076] cursor-pointer hover:text-[#003A70] font-semibold">
                    View {transformationNotes[section].changes.length} transformation(s)
                  </summary>
                  <ul className="mt-3 text-sm text-muted-foreground space-y-1.5 pl-6">
                    {transformationNotes[section].changes.map((change: any, idx: number) => (
                      <li key={idx}>
                        • {change.type}: &quot;{change.from}&quot; → &quot;{change.to}&quot;
                        {change.reason && <span className="text-[#E92076] italic"> ({change.reason})</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}

          {/* Transformation Changelog (if LLM was used) */}
          {transformationMethod === 'llm' && deliverable.transformation_metadata && (
            <div className="border-t-2 border-gray-200 pt-6">
              <button
                onClick={() => setShowChangelog(!showChangelog)}
                className="text-base font-bold text-[#E92076] hover:text-[#003A70] flex items-center gap-3"
              >
                {showChangelog ? '▼' : '▶'} Transformation Changelog
                <span className="text-sm bg-[#E92076] text-white px-3 py-1 rounded-lg font-semibold">
                  {deliverable.transformation_metadata.total_changes || 0} changes
                </span>
              </button>

              {showChangelog && (
                <div className="mt-4 bg-[#E92076]/10 border-2 border-[#E92076] rounded-lg p-4 space-y-3">
                  <div className="text-sm text-foreground">
                    <div><strong>Method:</strong> {deliverable.transformation_metadata.method}</div>
                    {deliverable.transformation_metadata.model && (
                      <div><strong>Model:</strong> {deliverable.transformation_metadata.model}</div>
                    )}
                    {deliverable.transformation_metadata.timestamp && (
                      <div><strong>Timestamp:</strong> {new Date(deliverable.transformation_metadata.timestamp).toLocaleString()}</div>
                    )}
                  </div>

                  {/* Detailed changelog by section */}
                  {transformationNotes && (
                    <div className="space-y-3 mt-4">
                      {Object.entries(transformationNotes).map(([section, notes]: [string, any]) => (
                        <div key={section} className="bg-white rounded-lg p-3">
                          <p className="font-bold text-sm text-[#E92076]">{section}</p>
                          <p className="text-sm text-muted-foreground mt-2">{notes.summary}</p>
                          {notes.changes && notes.changes.length > 0 && (
                            <ul className="text-sm text-muted-foreground mt-3 space-y-1.5">
                              {notes.changes.map((change: any, idx: number) => (
                                <li key={idx}>
                                  • <strong>{change.type}:</strong> &quot;{change.from}&quot; → &quot;{change.to}&quot;
                                  {change.reason && <span className="italic"> ({change.reason})</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Provenance Toggle */}
          <div className="border-t-2 border-gray-200 pt-6">
            <button
              onClick={() => setShowProvenance(!showProvenance)}
              className="text-base font-bold text-[#003A70] hover:text-[#0052A3]"
            >
              {showProvenance ? '▼' : '▶'} Provenance
            </button>
            {showProvenance && <ProvenanceViewer deliverable={deliverable} />}
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="border-t-2 bg-gray-50 p-6">
          <StoryModelSelector
            deliverableId={deliverable.id}
            currentModelId={deliverable.story_model_id}
            currentInstanceData={deliverable.instance_data}
            onModelChange={handleStoryModelChange}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
