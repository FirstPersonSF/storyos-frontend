"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deliverablesAPI, templatesAPI, unfAPI, voicesAPI } from '@/lib/api/client';

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [viewingContent, setViewingContent] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    template_id: '',
    voice_id: '',
    instance_data: {},
    selected_elements: [] as string[]
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
    } catch (err: any) {
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
      setElements(response.data.filter((e: any) => e.status === 'approved'));
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

  const loadDeliverableWithAlerts = async (id: string) => {
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

  const toggleElement = (elementId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_elements: prev.selected_elements.includes(elementId)
        ? prev.selected_elements.filter(id => id !== elementId)
        : [...prev.selected_elements, elementId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build element_versions mapping
      const element_versions: Record<string, number> = {};
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
    } catch (err: any) {
      alert('Error creating deliverable: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#003A70]">Loading deliverables...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-[#003A70]">StoryOS</h1>
              </div>
              <span className="text-sm text-muted-foreground">v1.0.0</span>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <section className="border-b border-border bg-white py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold tracking-tight text-foreground">Deliverables</h2>
                <p className="mt-4 text-xl text-muted-foreground">{deliverables.length} deliverables</p>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-[#003A70] hover:bg-[#0052A3] text-base font-semibold px-6 py-3 h-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Deliverable
              </Button>
            </div>
          </div>
        </section>

        {/* Deliverables List */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {deliverables.length === 0 ? (
              <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-16 text-center shadow-lg">
                <div className="mb-4 text-6xl">📦</div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">No deliverables yet</h3>
                <p className="mb-6 text-lg text-muted-foreground">
                  Create your first deliverable to get started
                </p>
                <Button
                  onClick={handleCreate}
                  className="bg-[#003A70] hover:bg-[#0052A3] text-base font-semibold"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Deliverable
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {deliverables.map((deliverable) => (
                  <div
                    key={deliverable.id}
                    className="rounded-lg border-2 border-[#003A70]/10 bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                  >
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{deliverable.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Template v{deliverable.template_version} | Voice v{deliverable.voice_version} | Created {new Date(deliverable.created_at).toLocaleDateString()}
                        </p>
                        <Badge className="mt-2 bg-[#003A70] hover:bg-[#0052A3] text-white">
                          {deliverable.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setExpandedId(expandedId === deliverable.id ? null : deliverable.id)}
                          variant="outline"
                          className="border-2 border-border font-semibold"
                        >
                          {expandedId === deliverable.id ? "Collapse" : "Expand"}
                        </Button>
                        <Button
                          onClick={() => setViewingContent(deliverable)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                        >
                          View Content
                        </Button>
                        <Button
                          onClick={() => loadDeliverableWithAlerts(deliverable.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Check for Updates
                        </Button>
                      </div>
                    </div>

                    {/* Instance Data */}
                    {deliverable.instance_data && Object.keys(deliverable.instance_data).length > 0 && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <p className="text-sm font-bold text-foreground mb-2">Instance Data:</p>
                        <div className="space-y-1">
                          {Object.entries(deliverable.instance_data).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-sm text-muted-foreground">
                              <span className="font-semibold">{key}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Update Alerts */}
                    {selectedDeliverable?.id === deliverable.id && (
                      <div className="mb-6">
                        {alerts && alerts.length > 0 ? (
                          <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6">
                            <div className="mb-4 flex items-center gap-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              <h4 className="text-lg font-bold text-yellow-900">
                                {alerts.length} Update{alerts.length !== 1 ? 's' : ''} Available
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {alerts.map((alert: any, idx: number) => (
                                <div key={idx} className="text-sm text-yellow-800">
                                  <strong>{alert.element_name}:</strong> v{alert.old_version} → v{alert.new_version}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border-2 border-green-400 bg-green-50 p-6">
                            <div className="flex items-center gap-3 text-green-700">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="font-bold">Up to date</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Expanded Content Preview */}
                    {expandedId === deliverable.id && deliverable.rendered_content && (
                      <div className="border-t-2 border-gray-200 pt-6 mt-6 space-y-4">
                        <h4 className="text-lg font-bold text-foreground mb-4">Rendered Content</h4>
                        {Object.entries(deliverable.rendered_content).map(([section, content]) => (
                          <div key={section} className="border-b pb-4 last:border-b-0">
                            <h5 className="text-sm font-semibold text-[#003A70] mb-2">{section}</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{content as string}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-white py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 StoryOS. Content management for enterprise storytelling.
            </p>
          </div>
        </footer>
      </div>

      {/* Create Deliverable Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Create New Deliverable</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-foreground mb-3">
                    Deliverable Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
                    placeholder="e.g., Q4 Product Launch Blog Post"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-bold text-foreground mb-3">
                      Template
                    </label>
                    <select
                      required
                      value={formData.template_id}
                      onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
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
                    <label className="block text-base font-bold text-foreground mb-3">
                      Brand Voice
                    </label>
                    <select
                      required
                      value={formData.voice_id}
                      onChange={(e) => setFormData({ ...formData, voice_id: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
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
                  <label className="block text-base font-bold text-foreground mb-3">
                    Select Elements to Include
                  </label>
                  <div className="border-2 border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
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
                              <div className="font-semibold text-sm text-foreground">{element.name}</div>
                              <div className="text-xs text-muted-foreground">v{element.version} - {element.content.substring(0, 60)}...</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.selected_elements.length} element(s) selected
                  </p>
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t-2">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="px-6 py-3 text-base font-semibold border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-3 bg-[#003A70] hover:bg-[#0052A3] text-base font-semibold"
                  >
                    Create Deliverable
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Content Modal */}
      {viewingContent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-8 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{viewingContent.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Template: v{viewingContent.template_version} | Voice: v{viewingContent.voice_version} | Status: {viewingContent.status}
                </p>
              </div>
              <button
                onClick={() => setViewingContent(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {viewingContent.rendered_content && Object.keys(viewingContent.rendered_content).length > 0 ? (
                Object.entries(viewingContent.rendered_content).map(([section, content]) => (
                  <div key={section} className="border-b-2 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-[#003A70] mb-3">{section}</h3>
                    <div className="prose prose-base max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-3">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-6 space-y-1.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1.5">{children}</ol>,
                        }}
                      >
                        {content as string}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No rendered content available
                </div>
              )}

              {/* Transformation Notes Section */}
              {viewingContent.metadata?.transformation_notes && Object.keys(viewingContent.metadata.transformation_notes).length > 0 && (
                <div className="border-t-4 border-gray-300 pt-6 mt-8">
                  <h3 className="text-xl font-bold text-[#003A70] mb-4">🤖 Transformation Notes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-generated rationale explaining how the content was transformed to match the brand voice
                  </p>
                  <div className="space-y-4">
                    {Object.entries(viewingContent.metadata.transformation_notes).map(([section, notes]) => (
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
            </div>

            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-8 flex justify-end">
              <Button
                onClick={() => setViewingContent(null)}
                variant="outline"
                className="px-6 py-3 text-base font-semibold border-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
