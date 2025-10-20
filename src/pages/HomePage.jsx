export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to StoryOS</h1>
        <p className="mt-2 text-gray-600">
          Content management system for enterprise storytelling
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Elements Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    UNF Elements
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    Reusable content blocks
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="/elements"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View all elements
              </a>
            </div>
          </div>
        </div>

        {/* Deliverables Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Deliverables
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    Final outputs with alerts
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="/deliverables"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View all deliverables
              </a>
            </div>
          </div>
        </div>

        {/* API Docs Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    API Documentation
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    REST API docs
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href="https://web-production-9c58.up.railway.app/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                View API docs →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          How StoryOS Works
        </h2>
        <div className="space-y-3 text-blue-900">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <strong>Create Reusable Elements</strong>
              <p className="text-sm text-blue-800 mt-1">Build a library of approved content blocks (mission statements, product features, etc.) organized by UNF layers.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <strong>Assemble Deliverables</strong>
              <p className="text-sm text-blue-800 mt-1">Combine elements with templates and brand voices to create blog posts, marketing materials, and other content.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <strong>Track Version Changes</strong>
              <p className="text-sm text-blue-800 mt-1">When you update an element, all deliverables using it get alerts showing old → new version changes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-amber-900 mb-2">
          Try the Demo Workflow
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-amber-900">
          <li>Go to <strong>UNF Elements</strong> and create a new element (or edit an existing one)</li>
          <li>Approve the element if it's a draft</li>
          <li>Go to <strong>Deliverables</strong> and create a deliverable using your elements</li>
          <li>Go back to <strong>UNF Elements</strong> and edit one of the elements you used</li>
          <li>Return to <strong>Deliverables</strong> and click "Check for Updates" to see the impact alert!</li>
        </ol>
      </div>
    </div>
  );
}
