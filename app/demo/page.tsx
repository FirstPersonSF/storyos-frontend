"use client"

import { ArrowLeft, CheckCircle2, Lightbulb } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DemoPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("")

  const templates = [
    { id: "manifesto", name: "Brand Manifesto" },
    { id: "press", name: "Press Release" },
  ]

  const voices = [
    { id: "corporate", name: "Corporate Brand Voice" },
    { id: "product", name: "Product Division Voice" },
  ]

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

      {/* Page Header */}
      <section className="border-b border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-5xl font-bold tracking-tight text-foreground">Interactive Demo</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Create deliverables, update elements, and explore voice transformations
          </p>
          <Link href="/" className="mt-4 inline-block text-[#003A70] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
          {/* How This Demo Works */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-12">
            <h3 className="mb-10 text-4xl font-bold text-blue-900">How This Demo Works</h3>
            <div className="space-y-6">
              {[
                {
                  number: 1,
                  title: "Create Deliverables",
                  description:
                    "Select a template and voice to generate content. Add instance fields for customization.",
                },
                {
                  number: 2,
                  title: "Voice Transformations",
                  description:
                    'Same content + different voices = different outputs (e.g., "automation" → "autonomous technologies" vs "smart automation")',
                },
                {
                  number: 3,
                  title: "Story Models",
                  description: 'Click "Edit" on any deliverable to swap story models and see how structure changes.',
                },
                {
                  number: 4,
                  title: "Impact Alerts",
                  description:
                    "Update a UNF element to trigger yellow alert badges on deliverables. Refresh to pull latest versions.",
                },
                {
                  number: 5,
                  title: "Provenance",
                  description:
                    "Click 'Provenance' to see complete audit trail (templates, voices, elements, transformations).",
                },
              ].map((item) => (
                <div key={item.number} className="flex items-start gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                    {item.number}
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-bold text-blue-900">{item.title}</h4>
                    <p className="text-lg leading-relaxed text-blue-800">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-blue-300 pt-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 flex-shrink-0 text-blue-700" />
                <p className="text-base text-blue-700">
                  <strong>Technical:</strong> Rule-based transformations (microsecond execution) • Zero API costs •
                  Fully deterministic
                </p>
              </div>
            </div>
          </div>

          {/* Test Workflows */}
          <div className="rounded-lg border-2 border-border bg-white p-12">
            <h3 className="mb-10 text-4xl font-bold text-foreground">📋 Test Workflows</h3>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h4 className="mb-6 text-2xl font-bold text-foreground">Test 1-3: Basic Operations</h4>
                <ul className="space-y-4">
                  {[
                    "Create deliverable (Brand Manifesto)",
                    "Create deliverable (Press Release with instance fields)",
                    "View rendered content sections",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                      <span className="text-lg text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-2xl font-bold text-foreground">Test 4-6: Advanced Features</h4>
                <ul className="space-y-4">
                  {[
                    "Compare voice transformations (Corporate vs Product)",
                    "Swap story model (Edit → Change Story Model)",
                    "View provenance (Click on 'Provenance' button)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
                      <span className="text-lg text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Create New Deliverable */}
          <div className="rounded-lg border-2 border-border bg-white">
            <div className="border-b border-border p-8">
              <h3 className="text-3xl font-bold text-foreground">📝 Create New Deliverable</h3>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {/* Template Selector */}
                <div>
                  <label className="mb-3 block text-lg font-semibold text-foreground">Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-lg border-2 border-border bg-white px-4 py-4 text-lg focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
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
                  <label className="mb-3 block text-lg font-semibold text-foreground">Voice</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full rounded-lg border-2 border-border bg-white px-4 py-4 text-lg focus:border-[#003A70] focus:outline-none focus:ring-2 focus:ring-[#003A70]/20"
                  >
                    <option value="">Select a voice...</option>
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Story Model Info */}
                {selectedTemplate && (
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                    <p className="mb-2 text-sm font-semibold text-blue-900">Story Model</p>
                    <p className="mb-3 text-lg font-medium text-blue-800">Brand Narrative Framework</p>
                    <p className="text-sm text-blue-700">
                      ℹ️ Story model is set by the template. You can change it after creation using the Edit button.
                    </p>
                  </div>
                )}

                {/* Create Button */}
                <button
                  disabled={!selectedTemplate || !selectedVoice}
                  className="h-12 w-full rounded-lg bg-[#003A70] text-base font-semibold text-white hover:bg-[#0052A3] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create Deliverable
                </button>
              </div>
            </div>
          </div>

          {/* Voice Transformation Examples */}
          <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-50 to-green-50 p-12">
            <h3 className="mb-10 text-4xl font-bold text-foreground">🔍 How to See Voice Transformations</h3>

            {/* Quick Start Guide */}
            <div className="mb-8 rounded-lg border-2 border-blue-300 bg-white p-8">
              <h4 className="mb-6 text-2xl font-bold text-foreground">Quick Start Guide</h4>
              <ol className="space-y-4">
                {[
                  'Select "Brand Manifesto" template above',
                  'Choose "Corporate Brand Voice"',
                  'Click "Create Deliverable"',
                  'Repeat with "Product Division Voice"',
                  "Click on 'Expand' button on both cards to compare content",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                      {i + 1}
                    </div>
                    <span className="pt-2 text-lg text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Transformation Comparison */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Corporate Voice */}
              <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-8">
                <h4 className="mb-6 text-2xl font-bold text-blue-900">Corporate Voice Transforms</h4>
                <ul className="space-y-4">
                  {[
                    '"automation" → "autonomous technologies"',
                    '"we" → "Hexagon AB" (third-person)',
                    '"digital transformation" → "digital reality solutions"',
                    "Formal, expanded language",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-xl text-blue-600">•</span>
                      <span className="text-lg text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Voice */}
              <div className="rounded-lg border-2 border-green-300 bg-green-50 p-8">
                <h4 className="mb-6 text-2xl font-bold text-green-900">Product Voice Transforms</h4>
                <ul className="space-y-4">
                  {[
                    '"automation" → "smart automation"',
                    '"Hexagon AB" → "we" (first-person)',
                    '"digital transformation" → "smart digital tools"',
                    "Casual, simplified language",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-xl text-green-600">•</span>
                      <span className="text-lg text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-8 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-lg text-yellow-900">
                  <strong>Tip:</strong> The transformations happen automatically when you create a deliverable. Same
                  source elements + different voices = different output text! This is Phase 2 in action.
                </p>
              </div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div>
            <h3 className="mb-6 text-4xl font-bold text-foreground">Deliverables</h3>
            <div className="rounded-lg border-2 border-border bg-white p-16 text-center">
              <div className="mb-4 text-6xl">📄</div>
              <h4 className="mb-2 text-2xl font-bold text-foreground">No deliverables yet</h4>
              <p className="text-lg text-muted-foreground">
                Create your first deliverable using the form above to get started
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
