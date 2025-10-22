import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ElementsPage from './pages/ElementsPage';
import DeliverablesPage from './pages/DeliverablesPage';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import { DemoProvider } from './context/DemoContext';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold text-blue-600">StoryOS</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/elements"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Elements
                  </Link>
                  <Link
                    to="/deliverables"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Deliverables
                  </Link>
                  <Link
                    to="/demo"
                    className="border-transparent text-blue-500 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    🎬 Demo
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/elements" element={<ElementsPage />} />
            <Route path="/deliverables" element={<DeliverablesPage />} />
            <Route path="/demo" element={
              <DemoProvider>
                <DemoPage />
              </DemoProvider>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
