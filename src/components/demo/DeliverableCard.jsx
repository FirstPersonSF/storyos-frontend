import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDemo } from '../../context/DemoContext';
import ProvenanceViewer from './ProvenanceViewer';
import StoryModelSelector from './StoryModelSelector';

export default function DeliverableCard({ deliverable }) {
  const { refreshDeliverable, deleteDeliverable, updateDeliverableStoryModel } = useDemo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  // Get voice styling
  const isCorporate = deliverable.voice_id === '00a2f89d-0b2a-465c-b85a-29fbc4cc1b7e';
  const voiceStyles = isCorporate
    ? {
        border: 'border-blue-200',
        bg: 'bg-blue-50',
        borderB: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        label: 'Corporate'
      }
    : {
        border: 'border-green-200',
        bg: 'bg-green-50',
        borderB: 'border-green-200',
        badge: 'bg-green-100 text-green-800',
        label: 'Product'
      };

  // Determine transformation badge
  const transformationMethod = deliverable.transformation_metadata?.method || 'rule-based';
  const transformationBadge = transformationMethod === 'llm'
    ? { emoji: '🤖', label: 'LLM', styles: 'bg-purple-100 text-purple-800' }
    : { emoji: '⚙️', label: 'Rule-based', styles: 'bg-gray-100 text-gray-800' };

  const handleRefresh = async () => {
    await refreshDeliverable(deliverable.id);
  };

  const handleDelete = async () => {
    if (confirm('Delete this deliverable?')) {
      await deleteDeliverable(deliverable.id);
    }
  };

  const handleStoryModelChange = async (newModelId) => {
    const result = await updateDeliverableStoryModel(deliverable.id, newModelId);
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
    <div className={`bg-white rounded-lg shadow-sm border-2 ${voiceStyles.border} overflow-hidden`}>
      {/* Header */}
      <div className={`${voiceStyles.bg} px-4 py-3 border-b ${voiceStyles.borderB}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{deliverable.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className={`px-2 py-1 ${voiceStyles.badge} rounded flex items-center`}>
                {voiceStyles.label}
              </span>
              <span className={`px-2 py-1 ${transformationBadge.styles} rounded flex items-center gap-1`}>
                <span className="flex items-center">{transformationBadge.emoji}</span>
                <span>{transformationBadge.label}</span>
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded flex items-center">
                {deliverable.status}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={handleRefresh}
              className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Refresh
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Impact Alerts */}
        {deliverable.alerts && deliverable.alerts.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-xs font-semibold text-yellow-800 mb-1">
              ⚠️ Impact Alerts ({deliverable.alerts.length})
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              {deliverable.alerts.map((alert) => (
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
        <div className="p-4 space-y-4">
          {/* Rendered Sections */}
          {renderedContent && Object.entries(renderedContent).map(([section, content]) => (
            <div key={section} className="border-b pb-4 last:border-b-0">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">{section}</h4>

              {/* Content with potential inline annotations */}
              <div className="text-sm text-gray-600 relative group text-left">
                {content ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="italic text-gray-400 bg-gray-50 p-3 rounded border border-gray-200">
                    No content - section may not have elements bound in template
                  </div>
                )}

                {/* Inline annotation tooltip (if transformation notes exist for this section) */}
                {transformationNotes && transformationNotes[section] && (
                  <div className="absolute hidden group-hover:block bg-purple-50 border border-purple-200 rounded-lg p-3 shadow-lg z-10 top-full mt-2 left-0 right-0">
                    <p className="text-xs text-purple-800 font-semibold mb-1">
                      🤖 Transformation Summary:
                    </p>
                    <p className="text-xs text-purple-700 text-left">
                      {transformationNotes[section].summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Section transformation details */}
              {transformationNotes && transformationNotes[section] && transformationNotes[section].changes && (
                <details className="mt-2">
                  <summary className="text-xs text-purple-600 cursor-pointer hover:text-purple-800">
                    View {transformationNotes[section].changes.length} transformation(s)
                  </summary>
                  <ul className="mt-2 text-xs text-purple-700 space-y-1 pl-4">
                    {transformationNotes[section].changes.map((change, idx) => (
                      <li key={idx}>
                        • {change.type}: "{change.from}" → "{change.to}"
                        {change.reason && <span className="text-purple-600 italic"> ({change.reason})</span>}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}

          {/* Transformation Changelog (if LLM was used) */}
          {transformationMethod === 'llm' && deliverable.transformation_metadata && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowChangelog(!showChangelog)}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-2"
              >
                {showChangelog ? '▼' : '▶'} Transformation Changelog
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  {deliverable.transformation_metadata.total_changes || 0} changes
                </span>
              </button>

              {showChangelog && (
                <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-purple-800">
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
                    <div className="space-y-2 mt-3">
                      {Object.entries(transformationNotes).map(([section, notes]) => (
                        <div key={section} className="bg-white rounded p-2">
                          <p className="font-semibold text-xs text-purple-800">{section}</p>
                          <p className="text-xs text-purple-700 mt-1">{notes.summary}</p>
                          {notes.changes && notes.changes.length > 0 && (
                            <ul className="text-xs text-purple-600 mt-2 space-y-1">
                              {notes.changes.map((change, idx) => (
                                <li key={idx}>
                                  • <strong>{change.type}:</strong> "{change.from}" → "{change.to}"
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
          <div className="border-t pt-4">
            <button
              onClick={() => setShowProvenance(!showProvenance)}
              className="text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              {showProvenance ? '▼' : '▶'} Provenance
            </button>
            {showProvenance && <ProvenanceViewer deliverable={deliverable} />}
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="border-t bg-gray-50 p-4">
          <StoryModelSelector
            deliverableId={deliverable.id}
            currentModelId={deliverable.story_model_id}
            onModelChange={handleStoryModelChange}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
