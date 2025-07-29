import React from 'react';

// Reusable Input Component
export const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  placeholder = '',
  className = '',
  ...props 
}) => (
  <div className="form-group">
    <label className="form-label" htmlFor={name}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`form-input ${className}`}
      {...props}
    />
  </div>
);

// Reusable Select Component
export const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false, 
  className = '',
  ...props 
}) => (
  <div className="form-group">
    <label className="form-label" htmlFor={name}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`form-input ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Checkbox Component
export const FormCheckbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  className = '',
  ...props 
}) => (
  <div className="flex items-center">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
      {...props}
    />
    <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
      {label}
    </label>
  </div>
);

// Reusable Submit Button
export const SubmitButton = ({ 
  loading = false, 
  children, 
  className = '',
  ...props 
}) => (
  <button
    type="submit"
    disabled={loading}
    className={`btn btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="loading-spinner mr-2"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

// Message Display Component
export const Message = ({ message, type = 'info' }) => {
  if (!message) return null;

  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`border px-4 py-3 rounded-lg text-sm ${typeClasses[type]}`}>
      {message}
    </div>
  );
};
