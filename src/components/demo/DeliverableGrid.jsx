import { useDemo } from '../../context/DemoContext';
import DeliverableCard from './DeliverableCard';

export default function DeliverableGrid() {
  const { deliverables, loading } = useDemo();

  if (loading && deliverables.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading deliverables...</p>
      </div>
    );
  }

  if (deliverables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg mb-2">No deliverables yet</p>
        <p className="text-gray-400 text-sm">
          Create your first deliverable using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deliverables.map((deliverable) => (
        <DeliverableCard key={deliverable.id} deliverable={deliverable} />
      ))}
    </div>
  );
}
