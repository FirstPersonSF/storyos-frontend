"use client"

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDemo } from '../context/DemoContext';
import ProvenanceViewer from './ProvenanceViewer';
import StoryModelSelector from './StoryModelSelector';

interface DeliverableCardProps {
  deliverable: any;
}

export default function DeliverableCard({ deliverable }: DeliverableCardProps) {
  const { voices, refreshDeliverable, deleteDeliverable, updateDeliverableStoryModel, updateDeliverableVoice } = useDemo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const editSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to edit section when editing mode is enabled
  useEffect(() => {
    if (isEditing && editSectionRef.current) {
      editSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isEditing]);

  // Get voice styling - using v0 color palette
  // Find the voice by ID to check its name
  const deliverableVoice = voices.find(v => v.id === deliverable.voice_id);
  const isCorporate = deliverableVoice?.name?.toLowerCase().includes('corporate') || false;
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
    setIsUpdating(true);
    try {
      const result = await updateDeliverableStoryModel(deliverable.id, newModelId, instanceData);
      if (result.success) {
        setIsEditing(false);
        setShowSuccessMessage(true);
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVoiceChange = async (newVoiceId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateDeliverableVoice(deliverable.id, newVoiceId);
      if (result.success) {
        setIsEditing(false);
        setShowSuccessMessage(true);
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Parse rendered content
  const renderedContent = typeof deliverable.rendered_content === 'string'
    ? JSON.parse(deliverable.rendered_content)
    : deliverable.rendered_content;

  // Parse transformation notes if available
  const transformationNotes = deliverable.metadata?.transformation_notes
    ? (typeof deliverable.metadata.transformation_notes === 'string'
      ? JSON.parse(deliverable.metadata.transformation_notes)
      : deliverable.metadata.transformation_notes)
    : null;

  // Parse validation log if available
  const validationLog = deliverable.validation_log || [];
  const failedValidations = validationLog.filter((v: any) => !v.passed);
  const passedValidations = validationLog.filter((v: any) => v.passed);

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
              {validationLog.length > 0 && (
                <span className={`px-3 py-1 ${failedValidations.length > 0 ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg font-semibold flex items-center gap-1.5`}>
                  {failedValidations.length > 0 ? '⚠️' : '✓'} Validation {failedValidations.length > 0 ? `(${failedValidations.length} issues)` : 'Passed'}
                </span>
              )}
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

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <p className="text-sm font-bold text-green-800">
              ✅ Story model change saved successfully! New version created.
            </p>
          </div>
        )}

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

              </div>
            </div>
          ))}

          {/* Validation Results Section */}
          {validationLog.length > 0 && (
            <div className="border-t-4 border-gray-300 pt-6 mt-8">
              <h3 className="text-xl font-bold text-[#003A70] mb-4">
                {failedValidations.length > 0 ? '⚠️' : '✓'} Validation Results
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Automated checks ensuring content meets quality standards and template requirements
              </p>

              {/* Failed Validations */}
              {failedValidations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-red-900 mb-3">
                    Issues Found ({failedValidations.length})
                  </h4>
                  <div className="space-y-3">
                    {failedValidations.map((validation: any, idx: number) => (
                      <div key={idx} className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-red-600 text-xl">❌</span>
                          <div className="flex-1">
                            <h5 className="text-sm font-semibold text-red-900 mb-1">
                              {validation.rule.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </h5>
                            <p className="text-sm text-red-800">{validation.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passed Validations Summary */}
              {passedValidations.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-green-900 mb-3">
                    Passed Checks ({passedValidations.length})
                  </h4>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {passedValidations.map((validation: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm text-green-800">
                            {validation.rule.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transformation Notes Section */}
          {transformationNotes && Object.keys(transformationNotes).length > 0 && (
            <div className="border-t-4 border-gray-300 pt-6 mt-8">
              <h3 className="text-xl font-bold text-[#003A70] mb-4">🤖 Transformation Notes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI-generated rationale explaining how the content was transformed to match the brand voice
              </p>
              <div className="space-y-4">
                {Object.entries(transformationNotes).map(([section, notes]) => (
                  <div key={section} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">{section}</h4>
                    <div className="text-sm text-blue-800 whitespace-pre-wrap">
                      {notes as string}
                    </div>
                  </div>
                ))}
              </div>
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
        <div
          ref={editSectionRef}
          className="border-t-2 bg-yellow-50 border-yellow-300 p-6 animate-pulse relative"
          style={{ animationIterationCount: '2', animationDuration: '0.5s' }}
        >
          {isUpdating && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-[#003A70] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-bold text-[#003A70]">Updating deliverable...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
              </div>
            </div>
          )}
          <StoryModelSelector
            deliverableId={deliverable.id}
            currentModelId={deliverable.story_model_id}
            currentVoiceId={deliverable.voice_id}
            currentInstanceData={deliverable.instance_data}
            onModelChange={handleStoryModelChange}
            onVoiceChange={handleVoiceChange}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
