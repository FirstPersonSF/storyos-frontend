"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Clock } from "lucide-react"
import Link from "next/link"
import { unfAPI } from '@/lib/api/client';

export default function ElementsPage() {
  const [elements, setElements] = useState<any[]>([]);
  const [layers, setLayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingElement, setEditingElement] = useState<any>(null);
  const [expandedElementName, setExpandedElementName] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [formData, setFormData] = useState({
    layer_id: '',
    name: '',
    content: '',
    metadata: {}
  });

  useEffect(() => {
    loadElements();
    loadLayers();
  }, []);

  const loadElements = async () => {
    try {
      setLoading(true);
      const response = await unfAPI.getElements();
      setElements(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLayers = async () => {
    try {
      const response = await unfAPI.getLayers();
      setLayers(response.data);
    } catch (err) {
      console.error('Error loading layers:', err);
    }
  };

  const handleCreate = () => {
    setEditingElement(null);
    setFormData({
      layer_id: '',
      name: '',
      content: '',
      metadata: {}
    });
    setShowCreateModal(true);
  };

  const handleEdit = (element: any) => {
    setEditingElement(element);
    setFormData({
      layer_id: element.layer_id,
      name: element.name,
      content: element.content,
      metadata: element.metadata || {}
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingElement) {
        // Update creates a new version
        await unfAPI.updateElement(editingElement.id, {
          content: formData.content,
          metadata: formData.metadata
        });
      } else {
        // Create new element
        await unfAPI.createElement(formData);
      }
      setShowCreateModal(false);
      loadElements();
    } catch (err: any) {
      alert('Error saving element: ' + err.message);
    }
  };

  const handleApprove = async (elementId: string) => {
    try {
      await unfAPI.approveElement(elementId);
      loadElements();
    } catch (err: any) {
      alert('Error approving element: ' + err.message);
    }
  };

  const handleDelete = async (elementId: string, elementName: string) => {
    if (!confirm(`Are you sure you want to delete the draft element "${elementName}"?`)) {
      return;
    }
    try {
      await unfAPI.deleteElement(elementId);
      loadElements();
    } catch (err: any) {
      alert('Error deleting element: ' + err.message);
    }
  };

  // Group elements by name and get latest version of each
  const groupedElements = elements.reduce((acc: any, element: any) => {
    if (!acc[element.name]) {
      acc[element.name] = [];
    }
    acc[element.name].push(element);
    return acc;
  }, {});

  // Sort versions by version number (descending) for each element
  Object.keys(groupedElements).forEach(name => {
    groupedElements[name].sort((a: any, b: any) => b.version - a.version);
  });

  // Get unique element names with their latest version
  const allUniqueElements = Object.keys(groupedElements).map(name => ({
    name,
    latestVersion: groupedElements[name][0],
    allVersions: groupedElements[name],
    versionCount: groupedElements[name].length
  }));

  // Apply status filter
  const uniqueElements = allUniqueElements.filter(elementGroup => {
    const latestStatus = elementGroup.latestVersion.status;
    switch (statusFilter) {
      case 'active':
        return latestStatus === 'draft' || latestStatus === 'approved';
      case 'draft':
        return latestStatus === 'draft';
      case 'approved':
        return latestStatus === 'approved';
      case 'all':
        return true;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#003A70]">Loading elements...</div>
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
        <section className="border-b border-border bg-white py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-foreground">UNF Elements</h2>
                <p className="mt-2 text-lg text-muted-foreground">{uniqueElements.length} unique elements ({elements.length} total versions)</p>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-[#003A70] hover:bg-[#0052A3]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Element
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-foreground">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
              >
                <option value="active">Active (Draft + Approved)</option>
                <option value="draft">Draft Only</option>
                <option value="approved">Approved Only</option>
                <option value="all">All (Including Superseded)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Elements List */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {uniqueElements.map((elementGroup) => {
                const element = elementGroup.latestVersion;
                const isExpanded = expandedElementName === elementGroup.name;

                return (
                  <div key={elementGroup.name} className="space-y-4">
                    {/* Latest Version Card */}
                    <Card
                      onClick={() => setExpandedElementName(isExpanded ? null : elementGroup.name)}
                      className={`transition-all cursor-pointer ${
                        element.status === 'approved'
                          ? 'border-[#003A70]/20 bg-white shadow-lg hover:shadow-xl'
                          : element.status === 'draft'
                          ? 'border-yellow-200 bg-yellow-50 shadow-md hover:shadow-lg'
                          : 'border-border bg-secondary/30 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <CardHeader className="border-b-2 border-border pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-foreground">{element.name}</h3>
                          <Badge
                            className={
                              element.status === 'approved'
                                ? 'bg-[#003A70] hover:bg-[#0052A3] text-white'
                                : element.status === 'draft'
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                            }
                          >
                            {element.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="font-semibold">Version {element.version}</span>
                          <span>{new Date(element.created_at).toLocaleDateString()}</span>
                        </div>
                        {elementGroup.versionCount > 1 && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-[#003A70]">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">{elementGroup.versionCount} versions available - Click to view history</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="mb-6 text-base leading-relaxed text-foreground line-clamp-4">
                          {element.content}
                        </p>
                        <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                          {element.status === 'draft' ? (
                            <>
                              <Button
                                onClick={() => handleEdit(element)}
                                variant="outline"
                                className="flex-1 border-2 border-[#003A70]/20 hover:bg-[#003A70]/5 font-semibold"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleApprove(element.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleDelete(element.id, element.name)}
                                variant="outline"
                                className="flex-1 border-2 border-red-500/50 hover:bg-red-50 text-red-600 font-semibold"
                              >
                                Delete
                              </Button>
                            </>
                          ) : element.status === 'approved' ? (
                            <Button
                              onClick={() => handleEdit(element)}
                              variant="outline"
                              className="flex-1 border-2 border-[#003A70]/20 hover:bg-[#003A70]/5 font-semibold"
                            >
                              Create New Version
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              disabled
                              className="flex-1 border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                            >
                              Superseded (View Only)
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Version History Grid (when expanded) */}
                    {isExpanded && elementGroup.versionCount > 1 && (
                      <div className="pl-6 border-l-4 border-[#003A70]/20">
                        <h4 className="text-lg font-bold text-foreground mb-4">Version History</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {elementGroup.allVersions.slice(1).map((version: any) => (
                            <Card
                              key={version.id}
                              className={`transition-all ${
                                version.status === 'approved'
                                  ? 'border-[#003A70]/10 bg-white/50'
                                  : version.status === 'superseded'
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-border bg-secondary/20'
                              }`}
                            >
                              <CardHeader className="border-b border-border pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-muted-foreground">Version {version.version}</span>
                                    <Badge
                                      variant="outline"
                                      className={
                                        version.status === 'approved'
                                          ? 'border-[#003A70] text-[#003A70]'
                                          : version.status === 'superseded'
                                          ? 'border-gray-400 text-gray-600'
                                          : 'border-gray-300 text-gray-500'
                                      }
                                    >
                                      {version.status}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{new Date(version.created_at).toLocaleDateString()}</span>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                  {version.content}
                                </p>
                                <div className="mt-4 flex gap-2">
                                  {version.status === 'draft' ? (
                                    <>
                                      <Button
                                        onClick={() => handleEdit(version)}
                                        variant="outline"
                                        size="sm"
                                        className="border border-[#003A70]/20 hover:bg-[#003A70]/5 text-sm font-semibold"
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        onClick={() => handleApprove(version.id)}
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleDelete(version.id, version.name)}
                                        variant="outline"
                                        size="sm"
                                        className="border border-red-500/50 hover:bg-red-50 text-red-600 text-sm font-semibold"
                                      >
                                        Delete
                                      </Button>
                                    </>
                                  ) : version.status === 'approved' ? (
                                    <Button
                                      onClick={() => handleEdit(version)}
                                      variant="outline"
                                      size="sm"
                                      className="border border-[#003A70]/20 hover:bg-[#003A70]/5 text-sm font-semibold"
                                    >
                                      Create New Version
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-gray-500">Superseded (View Only)</span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {editingElement ? `Edit: ${editingElement.name}` : 'Create New Element'}
              </h2>

              {editingElement && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Editing will create a new version ({editingElement.version} → new version).
                    The old version will be marked as superseded.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!editingElement && (
                  <>
                    <div>
                      <label className="block text-base font-bold text-foreground mb-3">
                        Layer
                      </label>
                      <select
                        required
                        value={formData.layer_id}
                        onChange={(e) => setFormData({ ...formData, layer_id: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
                      >
                        <option value="">Select a layer...</option>
                        {layers.map((layer) => (
                          <option key={layer.id} value={layer.id}>
                            {layer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-bold text-foreground mb-3">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
                        placeholder="e.g., Company Mission Statement"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-base font-bold text-foreground mb-3">
                    Content
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#003A70] focus:border-[#003A70]"
                    placeholder="Enter the element content..."
                  />
                </div>
                <div className="flex gap-4 justify-end pt-4">
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
                    {editingElement ? 'Save New Version' : 'Create Element'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
