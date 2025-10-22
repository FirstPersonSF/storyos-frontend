import { Link } from 'react-router-dom';
import DeliverableBuilder from '../components/demo/DeliverableBuilder';
import DemoActionsPanel from '../components/demo/DemoActionsPanel';
import DeliverableGrid from '../components/demo/DeliverableGrid';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            StoryOS Interactive Demo
          </h1>
          <p className="text-gray-600">
            Create deliverables, update elements, and explore voice transformations
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm mt-2 mb-6 inline-block">
            ← Back to Home
          </Link>
        </div>

        {/* Info Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-left">How This Demo Works</h3>
          <div className="space-y-2 text-sm text-blue-800 text-left">
            <p className="text-left">
              <strong>1. Create Deliverables:</strong> Select a template and voice to generate content. Add instance fields for customization.
            </p>
            <p className="text-left">
              <strong>2. Voice Transformations:</strong> Same content + different voices = different outputs (e.g., "automation" → "autonomous technologies" vs "smart automation")
            </p>
            <p className="text-left">
              <strong>3. Story Models:</strong> Click "Edit" on any deliverable to swap story models and see how structure changes.
            </p>
            <p className="text-left">
              <strong>4. Impact Alerts:</strong> Update a UNF element to trigger yellow alert badges on deliverables. Refresh to pull latest versions.
            </p>
            <p className="text-left">
              <strong>5. Provenance:</strong> Click "Provenance" to see complete audit trail (templates, voices, elements, transformations).
            </p>
            <p className="mt-3 text-xs text-blue-700 text-left">
              💡 <strong>Technical:</strong> Rule-based transformations (microsecond execution) • Zero API costs • Fully deterministic
            </p>
          </div>
        </div>

        {/* Test Workflow Checklist */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Test Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Test 1-3: Basic Operations</h3>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Create deliverable (Brand Manifesto)</li>
                <li>✓ Create deliverable (Press Release with instance fields)</li>
                <li>✓ View rendered content sections</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Test 4-6: Advanced Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>✓ Compare voice transformations (Corporate vs Product)</li>
                <li>✓ Swap story model (Edit → Change Story Model)</li>
                <li>✓ View provenance (Expand → Provenance)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deliverable Builder */}
        <DeliverableBuilder />

        {/* Demo Actions */}
        <DemoActionsPanel />

        {/* Deliverables Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Deliverables</h2>
          <DeliverableGrid />
        </div>

        {/* Transformation Examples */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-xl font-semibold mb-3">🔍 How to See Voice Transformations</h2>

          <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Start Guide:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 text-left">
              <li>Select "Brand Manifesto" template above</li>
              <li>Choose "Corporate Brand Voice"</li>
              <li>Click "Create Deliverable"</li>
              <li>Repeat with "Product Division Voice"</li>
              <li>Click "Expand" on both cards to compare content</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Corporate Voice Transforms:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-left">
                <li>"automation" → <strong>"autonomous technologies"</strong></li>
                <li>"we" → <strong>"Hexagon AB"</strong> (third-person)</li>
                <li>"digital transformation" → <strong>"digital reality solutions"</strong></li>
                <li>Formal, expanded language</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Product Voice Transforms:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-left">
                <li>"automation" → <strong>"smart automation"</strong></li>
                <li>"Hexagon AB" → <strong>"we"</strong> (first-person)</li>
                <li>"digital transformation" → <strong>"smart digital tools"</strong></li>
                <li>Casual, simplified language</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              💡 <strong>Tip:</strong> The transformations happen automatically when you create a deliverable.
              Same source elements + different voices = different output text! This is Phase 2 in action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
