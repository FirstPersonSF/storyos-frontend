"use client"

import { ArrowLeft, CheckCircle2, Lightbulb, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DemoProvider, useDemo } from "../context/DemoContext"
import DeliverableCard from "../components/DeliverableCard"

function DemoPageContent() {
  const { templates, voices, deliverables, loading, createDeliverable } = useDemo()
  const [deliverableName, setDeliverableName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [instanceData, setInstanceData] = useState<Record<string, any>>({})

  // Get selected template object to access instance_fields
  const selectedTemplateObj = templates.find(t => t.id === selectedTemplate)
  const instanceFields = selectedTemplateObj?.instance_fields || []

  // Handle template change - reset instance data
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    setInstanceData({})
  }

  // Handle instance field change
  const handleInstanceFieldChange = (fieldName: string, value: any) => {
    setInstanceData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleCreateDeliverable = async () => {
    if (!deliverableName.trim()) {
      alert('Please enter a name for the deliverable')
      return
    }

    if (!selectedTemplate || !selectedVoice) {
      alert('Please select both a template and a voice')
      return
    }

    // Validate required instance fields
    const missingFields = instanceFields
      .filter((field: any) => field.required && !instanceData[field.name])
      .map((field: any) => field.name)

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`)
      return
    }

    setIsCreating(true)
    const result = await createDeliverable(deliverableName, selectedTemplate, selectedVoice, instanceData)
    setIsCreating(false)

    if (result.success) {
      // Clear selections after successful creation
      setDeliverableName("")
      setSelectedTemplate("")
      setSelectedVoice("")
      setInstanceData({})
    } else {
      alert(`Error creating deliverable: ${result.error}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-[#003A70]">StoryOS</h1>
            </div>
            <span className="text-sm text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-white to-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-[#003A70]">
              <Play className="h-4 w-4" />
              Interactive Demo
            </div>
            <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
              Interactive Demo
            </h2>
            <p className="text-pretty text-lg text-muted-foreground lg:text-xl">
              Create deliverables, update elements, and explore voice transformations
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
          {/* How This Demo Works */}
          <div>
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                How This Demo Works
              </h3>
            </div>
            <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-8 shadow-lg lg:p-12">
              <div className="space-y-6">
                {[
                  {
                    number: 1,
                    title: "Create Deliverables",
                    description:
                      "Select a template and voice to generate content. Add instance fields for customization.",
                    color: "#E92076",
                  },
                  {
                    number: 2,
                    title: "Voice Transformations",
                    description:
                      'Same content + different voices = different outputs (e.g., "automation" → "autonomous technologies" vs "smart automation")',
                    color: "#EF5898",
                  },
                  {
                    number: 3,
                    title: "Story Models",
                    description: 'Click "Edit" on any deliverable to swap story models and see how structure changes.',
                    color: "#4098D7",
                  },
                  {
                    number: 4,
                    title: "Impact Alerts",
                    description:
                      "Update a UNF element to trigger yellow alert badges on deliverables. Refresh to pull latest versions.",
                    color: "#2069A3",
                  },
                  {
                    number: 5,
                    title: "Provenance",
                    description:
                      'Click "Provenance" to see complete audit trail (templates, voices, elements, transformations).',
                    color: "#003A70",
                  },
                ].map((item) => (
                  <div key={item.number} className="flex items-start gap-6">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.number}
                    </div>
                    <div>
                      <h4 className="mb-2 text-xl font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-border pt-8">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-[#003A70]" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Technical:</strong> Rule-based transformations (microsecond
                    execution) • Zero API costs • Fully deterministic
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Workflows */}
          <div>
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Test Workflows</h3>
            </div>
            <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-8 shadow-lg lg:p-12">
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <h4 className="mb-6 text-2xl font-bold text-foreground">Basic Operations</h4>
                  <ul className="space-y-4">
                    {[
                      "Create deliverable (Brand Manifesto)",
                      "Create deliverable (Press Release with instance fields)",
                      "View rendered content sections",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                        <span className="text-sm leading-relaxed text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-6 text-2xl font-bold text-foreground">Advanced Features</h4>
                  <ul className="space-y-4">
                    {[
                      "Compare voice transformations (Corporate vs Product)",
                      "Swap story model (Edit → Change Story Model)",
                      'View provenance (Click on "Provenance" button)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                        <span className="text-sm leading-relaxed text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Create New Deliverable */}
          <div>
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Create New Deliverable
              </h3>
            </div>
            <div className="rounded-lg border-2 border-[#003A70]/10 bg-white shadow-lg">
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-foreground">
                      Deliverable Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliverableName}
                      onChange={(e) => setDeliverableName(e.target.value)}
                      className="w-full rounded-lg border-2 border-border bg-white px-4 py-3 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      placeholder="Enter a descriptive name for this deliverable"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Template Selector */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-foreground">Template</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="w-full rounded-lg border-2 border-border bg-white px-4 py-3 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      disabled={loading}
                    >
                      <option value="">Select a template...</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Voice Selector */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-foreground">Voice</label>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full rounded-lg border-2 border-border bg-white px-4 py-3 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                      disabled={loading}
                    >
                      <option value="">Select a voice...</option>
                      {voices.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instance Fields */}
                  {instanceFields.length > 0 && (
                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                      <h4 className="text-base font-bold text-foreground mb-4">Instance Fields</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Fill in the fields below to customize this {selectedTemplateObj?.name}
                      </p>
                      <div className="space-y-4">
                        {instanceFields.map((field: any) => (
                          <div key={field.name}>
                            <label className="mb-2 block text-sm font-semibold text-foreground">
                              {field.description || field.name}
                              {field.required && <span className="text-red-600 ml-1">*</span>}
                            </label>
                            {field.field_type === 'text' ? (
                              <input
                                type="text"
                                value={instanceData[field.name] || ''}
                                onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                                placeholder={field.description}
                                required={field.required}
                              />
                            ) : field.field_type === 'date' ? (
                              <input
                                type="date"
                                value={instanceData[field.name] || ''}
                                onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                                required={field.required}
                              />
                            ) : (
                              <input
                                type="text"
                                value={instanceData[field.name] || ''}
                                onChange={(e) => handleInstanceFieldChange(field.name, e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                                placeholder={field.description}
                                required={field.required}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story Model Info */}
                  {selectedTemplate && (
                    <div className="rounded-lg border-2 border-[#003A70]/20 bg-[#003A70]/5 p-6">
                      <p className="mb-2 text-sm font-semibold text-[#003A70]">Story Model</p>
                      <p className="mb-3 text-base font-medium text-foreground">Brand Narrative Framework</p>
                      <p className="text-sm text-muted-foreground">
                        Story model is set by the template. You can change it after creation using the Edit button.
                      </p>
                    </div>
                  )}

                  {/* Create Button */}
                  <button
                    onClick={handleCreateDeliverable}
                    disabled={!deliverableName.trim() || !selectedTemplate || !selectedVoice || isCreating}
                    className="h-12 w-full rounded-lg bg-[#003A70] text-base font-semibold text-white hover:bg-[#0052A3] disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Deliverable'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Transformation Examples */}
          <div>
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                Voice Transformations
              </h3>
              <p className="text-lg text-muted-foreground">See how different voices transform the same content</p>
            </div>
            <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-8 shadow-lg lg:p-12">
              {/* Quick Start Guide */}
              <div className="mb-12 rounded-lg border-2 border-[#003A70]/20 bg-[#003A70]/5 p-8">
                <h4 className="mb-6 text-2xl font-bold text-foreground">Quick Start Guide</h4>
                <ol className="space-y-4">
                  {[
                    'Select "Brand Manifesto" template above',
                    'Choose "Corporate Brand Voice"',
                    'Click "Create Deliverable"',
                    'Repeat with "Product Division Voice"',
                    'Click on "Expand" button on both cards to compare content',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                        style={{
                          backgroundColor:
                            i === 0
                              ? "#E92076"
                              : i === 1
                                ? "#EF5898"
                                : i === 2
                                  ? "#4098D7"
                                  : i === 3
                                    ? "#2069A3"
                                    : "#003A70",
                        }}
                      >
                        {i + 1}
                      </div>
                      <span className="pt-2 text-sm leading-relaxed text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Transformation Comparison */}
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Corporate Voice */}
                <div className="rounded-lg border-2 border-[#003A70]/20 bg-[#003A70]/5 p-8">
                  <h4 className="mb-6 text-xl font-bold text-[#003A70]">Corporate Voice Transforms</h4>
                  <ul className="space-y-3">
                    {[
                      '"automation" → "autonomous technologies"',
                      '"we" → "Hexagon AB" (third-person)',
                      '"digital transformation" → "digital reality solutions"',
                      "Formal, expanded language",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-lg text-[#003A70]">•</span>
                        <span className="text-sm leading-relaxed text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product Voice */}
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8">
                  <h4 className="mb-6 text-xl font-bold text-green-900">Product Voice Transforms</h4>
                  <ul className="space-y-3">
                    {[
                      '"automation" → "smart automation"',
                      '"Hexagon AB" → "we" (first-person)',
                      '"digital transformation" → "smart digital tools"',
                      "Casual, simplified language",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-lg text-green-600">•</span>
                        <span className="text-sm leading-relaxed text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tip */}
              <div className="mt-8 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <p className="text-sm leading-relaxed text-foreground">
                    <strong>Tip:</strong> The transformations happen automatically when you create a deliverable. Same
                    source elements + different voices = different output text!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div>
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">Deliverables</h3>
            </div>
            {deliverables.length > 0 ? (
              <div className="space-y-6">
                {deliverables.map((deliverable) => (
                  <DeliverableCard key={deliverable.id} deliverable={deliverable} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-16 shadow-lg text-center">
                <div className="mb-4 text-6xl">📄</div>
                <h4 className="mb-2 text-2xl font-bold text-foreground">No deliverables yet</h4>
                <p className="text-lg text-muted-foreground">
                  Create your first deliverable using the form above to get started
                </p>
              </div>
            )}
          </div>
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
  )
}

export default function DemoPage() {
  return (
    <DemoProvider>
      <DemoPageContent />
    </DemoProvider>
  )
}
