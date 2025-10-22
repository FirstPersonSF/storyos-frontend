"use client"

import { ArrowLeft, Plus, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function DeliverablesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [viewingContent, setViewingContent] = useState<any>(null)

  // Sample deliverables data
  const deliverables = [
    {
      id: 1,
      name: "Brand Manifesto - Corporate Voice",
      template: "Brand Manifesto",
      voice: "Corporate Brand Voice",
      storyModel: "Brand Narrative Framework",
      createdAt: "2025-01-15",
      hasUpdates: false,
      rendered_content: {
        "Opening": "Today's industries must balance growth with responsibility. Hexagon AB delivers autonomous technologies that transform data into real-world outcomes.",
        "Problem": "Despite rapid advances in technology, many organisations still struggle to connect their data and use it to drive real-world outcomes.",
        "Solution": "Our Reality Technology connects physical and digital realities to improve performance and sustainability.",
        "Call to Action": "Discover how Hexagon AB empowers industries to act faster and more responsibly."
      }
    },
    {
      id: 2,
      name: "Press Release Q1 2025",
      template: "Press Release",
      voice: "Product Division Voice",
      storyModel: "News Story Framework",
      createdAt: "2025-01-14",
      hasUpdates: true,
      updatedElements: ["Problem", "Key Messages"],
      rendered_content: {
        "Headline": "We Transform Data Into Action",
        "Problem": "Industries struggle with data silos and underutilized digital tools.",
        "Solution": "We unify sensors, software, and smart automation to bridge the gap from data to action.",
        "Benefits": "Turns data into decisions that improve efficiency and safety."
      }
    },
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-5xl font-bold tracking-tight text-foreground">Deliverables</h2>
              <p className="mt-4 text-xl text-muted-foreground">{deliverables.length} deliverables</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-[#003A70] px-6 py-3 text-base font-semibold text-white hover:bg-[#0052A3] transition-colors">
              <Plus className="h-5 w-5" />
              Create Deliverable
            </button>
          </div>
        </div>
      </section>

      {/* Deliverables List */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-6">
            {deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="rounded-lg border-2 border-[#003A70]/10 bg-white p-8 shadow-lg transition-all hover:shadow-xl"
              >
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-foreground">{deliverable.name}</h3>
                      {deliverable.hasUpdates && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Updates Available
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Created on {deliverable.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === deliverable.id ? null : deliverable.id)}
                      className="rounded-md border-2 border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
                    >
                      {expandedId === deliverable.id ? "Collapse" : "Expand"}
                    </button>
                    <button
                      onClick={() => setViewingContent(deliverable)}
                      className="rounded-md border-2 border-[#003A70] bg-[#003A70] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052A3] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Template</p>
                    <p className="text-sm font-medium text-foreground">{deliverable.template}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Voice</p>
                    <p className="text-sm font-medium text-foreground">{deliverable.voice}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Story Model</p>
                    <p className="text-sm font-medium text-foreground">{deliverable.storyModel}</p>
                  </div>
                </div>

                {/* Update Alert */}
                {deliverable.hasUpdates && deliverable.updatedElements && (
                  <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="text-lg font-bold text-yellow-900">Element Updates Detected</h4>
                    </div>
                    <p className="mb-4 text-sm text-yellow-800">
                      The following elements have been updated since this deliverable was created:
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {deliverable.updatedElements.map((element, i) => (
                        <Badge key={i} variant="outline" className="border-yellow-600 text-yellow-900">
                          {element}
                        </Badge>
                      ))}
                    </div>
                    <button className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700 transition-colors">
                      <RefreshCw className="h-4 w-4" />
                      Refresh Deliverable
                    </button>
                  </div>
                )}

                {/* Expanded Content */}
                {expandedId === deliverable.id && deliverable.rendered_content && (
                  <div className="mt-6 space-y-4 border-t pt-6">
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

          {/* Empty State (show when no deliverables) */}
          {deliverables.length === 0 && (
            <div className="rounded-lg border-2 border-[#003A70]/10 bg-white p-16 text-center shadow-lg">
              <div className="mb-4 text-6xl">📦</div>
              <h3 className="mb-2 text-2xl font-bold text-foreground">No deliverables yet</h3>
              <p className="mb-6 text-lg text-muted-foreground">
                Create your first deliverable to get started
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#003A70] px-6 py-3 text-base font-semibold text-white hover:bg-[#0052A3] transition-colors">
                <Plus className="h-5 w-5" />
                Create Deliverable
              </button>
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

      {/* View Content Modal */}
      {viewingContent && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingContent(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{viewingContent.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Template: {viewingContent.template} | Voice: {viewingContent.voice}
                </p>
              </div>
              <button
                onClick={() => setViewingContent(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {viewingContent.rendered_content && Object.entries(viewingContent.rendered_content).map(([section, content]) => (
                <div key={section} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold text-[#003A70] mb-3">{section}</h3>
                  <p className="text-base text-gray-700 leading-relaxed">{content as string}</p>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setViewingContent(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
