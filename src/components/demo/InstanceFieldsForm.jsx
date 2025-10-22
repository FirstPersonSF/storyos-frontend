import { useState, useEffect } from 'react';

export default function InstanceFieldsForm({ template, instanceData, onChange }) {
  const [formData, setFormData] = useState(instanceData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(instanceData || {});
  }, [instanceData]);

  const handleChange = (fieldName, value) => {
    const updated = { ...formData, [fieldName]: value };
    setFormData(updated);
    onChange(updated);

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  if (!template.instance_fields || template.instance_fields.length === 0) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ This template has no instance fields
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">
          Instance Fields {template.instance_fields.filter(f => f.required).length > 0 && '(* required)'}
        </p>
      </div>

      {template.instance_fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.name} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.description || `Enter ${field.name}`}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors[field.name] && (
            <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
