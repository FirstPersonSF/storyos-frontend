import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { unfAPI, voicesAPI, templatesAPI, deliverablesAPI } from '../api/client';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [corporateDeliverable, setCorporateDeliverable] = useState(null);
  const [productDeliverable, setProductDeliverable] = useState(null);
  const [voices, setVoices] = useState([]);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [demoStep, setDemoStep] = useState('intro'); // intro, comparison, update, alerts

  useEffect(() => {
    loadVoices();
    loadElements();
  }, []);

  const loadVoices = async () => {
    try {
      const response = await voicesAPI.getVoices();
      setVoices(response.data);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const loadElements = async () => {
    try {
      const response = await unfAPI.getElements();
      setElements(response.data.filter(e => e.status === 'approved'));
    } catch (error) {
      console.error('Failed to load elements:', error);
    }
  };

  const runVoiceComparisonDemo = async () => {
    setLoading(true);
    setDemoStep('comparison');

    try {
      // Get voices
      const corporateVoice = voices.find(v => v.name.includes('Corporate'));
      const productVoice = voices.find(v => v.name.includes('Product'));

      // Get Brand Manifesto template
      const templatesResponse = await templatesAPI.getTemplates();
      const manifestoTemplate = templatesResponse.data.find(t => t.name.includes('Brand Manifesto'));

      if (!corporateVoice || !productVoice || !manifestoTemplate) {
        alert('Missing required data. Please ensure Corporate Voice, Product Voice, and Brand Manifesto template exist.');
        setLoading(false);
        return;
      }

      // Create Corporate Voice deliverable
      const corpResponse = await deliverablesAPI.createDeliverable({
        name: 'Demo: Corporate Voice Brand Manifesto',
        template_id: manifestoTemplate.id,
        voice_id: corporateVoice.id,
        instance_data: {},
        status: 'draft'
      });
      setCorporateDeliverable(corpResponse.data);

      // Create Product Voice deliverable
      const prodResponse = await deliverablesAPI.createDeliverable({
        name: 'Demo: Product Voice Brand Manifesto',
        template_id: manifestoTemplate.id,
        voice_id: productVoice.id,
        instance_data: {},
        status: 'draft'
      });
      setProductDeliverable(prodResponse.data);

    } catch (error) {
      console.error('Failed to run demo:', error);
      alert('Demo failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateElementDemo = async () => {
    if (!selectedElement) {
      alert('Please select an element to update');
      return;
    }

    setLoading(true);
    setDemoStep('update');

    try {
      // Update the element content
      const updatedContent = selectedElement.content + '\n\n[UPDATED: ' + new Date().toLocaleTimeString() + ']';

      await unfAPI.updateElement(selectedElement.id, {
        content: updatedContent
      });

      // Reload elements to show the update
      await loadElements();

      // Reload deliverables to show impact alerts
      if (corporateDeliverable) {
        const refreshed = await deliverablesAPI.getDeliverableWithAlerts(corporateDeliverable.id);
        setCorporateDeliverable(refreshed.data);
      }
      if (productDeliverable) {
        const refreshed = await deliverablesAPI.getDeliverableWithAlerts(productDeliverable.id);
        setProductDeliverable(refreshed.data);
      }

      setDemoStep('alerts');

    } catch (error) {
      console.error('Failed to update element:', error);
      alert('Update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshDeliverablesDemo = async () => {
    setLoading(true);

    try {
      if (corporateDeliverable) {
        await deliverablesAPI.refreshDeliverable(corporateDeliverable.id);
        const refreshed = await deliverablesAPI.getDeliverableWithAlerts(corporateDeliverable.id);
        setCorporateDeliverable(refreshed.data);
      }
      if (productDeliverable) {
        await deliverablesAPI.refreshDeliverable(productDeliverable.id);
        const refreshed = await deliverablesAPI.getDeliverableWithAlerts(productDeliverable.id);
        setProductDeliverable(refreshed.data);
      }

      alert('Deliverables refreshed! Impact alerts should now be cleared.');

    } catch (error) {
      console.error('Failed to refresh:', error);
      alert('Refresh failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const highlightDifferences = (text1, text2) => {
    // Simple word-based diff highlighting
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);

    const highlighted = [];
    const maxLen = Math.max(words1.length, words2.length);

    for (let i = 0; i < maxLen; i++) {
      if (words1[i] !== words2[i]) {
        highlighted.push(i);
      }
    }

    return highlighted;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            StoryOS Phase 2 Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of voice transformations and impact alerts
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            ← Back to Home
          </Link>
        </div>

        {/* Demo Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo Walkthrough</h2>

          <div className="space-y-4">
            {/* Step 1: Voice Comparison */}
            <div className={`border rounded-lg p-4 ${demoStep === 'comparison' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Step 1: Voice Transformation Comparison</h3>
                  <p className="text-sm text-gray-600">Create the same deliverable with two different voices to see transformations</p>
                </div>
                <button
                  onClick={runVoiceComparisonDemo}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading && demoStep === 'intro' ? 'Creating...' : 'Run Demo'}
                </button>
              </div>
            </div>

            {/* Step 2: Element Update */}
            <div className={`border rounded-lg p-4 ${demoStep === 'update' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div>
                <h3 className="font-semibold text-lg mb-2">Step 2: Update UNF Element</h3>
                <p className="text-sm text-gray-600 mb-3">Update an element to trigger impact alerts on deliverables</p>

                <div className="flex gap-3">
                  <select
                    value={selectedElement?.id || ''}
                    onChange={(e) => {
                      const elem = elements.find(el => el.id === e.target.value);
                      setSelectedElement(elem);
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    disabled={!corporateDeliverable || !productDeliverable}
                  >
                    <option value="">Select an element to update...</option>
                    {elements.map(elem => (
                      <option key={elem.id} value={elem.id}>
                        {elem.name} v{elem.version}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={updateElementDemo}
                    disabled={loading || !selectedElement || !corporateDeliverable}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    Update Element
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Impact Alerts */}
            <div className={`border rounded-lg p-4 ${demoStep === 'alerts' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Step 3: Refresh & Clear Alerts</h3>
                  <p className="text-sm text-gray-600">Refresh deliverables to pull latest element versions and clear alerts</p>
                </div>
                <button
                  onClick={refreshDeliverablesDemo}
                  disabled={loading || !corporateDeliverable || demoStep !== 'alerts'}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  Refresh Deliverables
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Comparison Results */}
        {(corporateDeliverable || productDeliverable) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Voice Transformation Comparison</h2>

            {/* Transformation Key */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">🔍 What to Look For:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• <strong>Terminology:</strong> "automation" → "autonomous technologies" (Corporate) vs "smart automation" (Product)</li>
                <li>• <strong>Perspective:</strong> "Hexagon AB" (Corporate) vs "we" (Product)</li>
                <li>• <strong>Formality:</strong> Expanded forms (Corporate) vs contractions (Product)</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Corporate Voice */}
              <div>
                <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b-2 border-blue-600">
                  <h3 className="font-semibold">Corporate Voice</h3>
                  <p className="text-xs text-gray-600">Formal • Third-person • Brand terminology</p>
                </div>
                <div className="border border-gray-300 rounded-b-lg p-4 bg-white">
                  {corporateDeliverable?.rendered_content ? (
                    <div className="space-y-4">
                      {Object.entries(corporateDeliverable.rendered_content).map(([section, content]) => (
                        <div key={section}>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">{section}</h4>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {content.substring(0, 300)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No content generated yet</p>
                  )}
                </div>

                {/* Impact Alerts - Corporate */}
                {corporateDeliverable?.alerts && corporateDeliverable.alerts.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-yellow-800">Impact Alerts</h4>
                        <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                          {corporateDeliverable.alerts.map((alert) => (
                            <li key={alert.element_id}>
                              • {alert.element_name}: v{alert.old_version} → v{alert.new_version} ({alert.status})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Voice */}
              <div>
                <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b-2 border-green-600">
                  <h3 className="font-semibold">Product Voice</h3>
                  <p className="text-xs text-gray-600">Casual • First-person • Simplified terms</p>
                </div>
                <div className="border border-gray-300 rounded-b-lg p-4 bg-white">
                  {productDeliverable?.rendered_content ? (
                    <div className="space-y-4">
                      {Object.entries(productDeliverable.rendered_content).map(([section, content]) => (
                        <div key={section}>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">{section}</h4>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {content.substring(0, 300)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No content generated yet</p>
                  )}
                </div>

                {/* Impact Alerts - Product */}
                {productDeliverable?.alerts && productDeliverable.alerts.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-yellow-800">Impact Alerts</h4>
                        <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                          {productDeliverable.alerts.map((alert) => (
                            <li key={alert.element_id}>
                              • {alert.element_name}: v{alert.old_version} → v{alert.new_version} ({alert.status})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How Phase 2 Works</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>1. Rule-Based Transformations:</strong> No LLM required! Uses fast, predictable regex replacements based on voice rules.
            </p>
            <p>
              <strong>2. Three Transformation Types:</strong>
            </p>
            <ul className="ml-6 space-y-1">
              <li>• <strong>Lexicon:</strong> Generic terms → Brand-specific (e.g., "we" → "Hexagon AB")</li>
              <li>• <strong>Terminology:</strong> Industry terms → Brand terms (e.g., "automation" → "autonomous technologies")</li>
              <li>• <strong>Tone:</strong> Formality + Perspective shifts (e.g., first-person ↔ third-person)</li>
            </ul>
            <p>
              <strong>3. Impact Alerts:</strong> When a UNF element is updated, all deliverables using that element show alerts until refreshed.
            </p>
            <p className="mt-3 text-xs text-blue-700">
              💡 <strong>Performance:</strong> Microsecond-level execution • Zero API costs • Fully deterministic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
