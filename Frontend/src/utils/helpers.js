// Date formatting utility
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Time formatting utility
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key);
    }
  },
  
  set: (key, value) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
};

// Validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
};

// Debounce utility
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Common form change handler
export const createFormChangeHandler = (setForm) => (e) => {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

// Common form submission handler
export const createFormSubmitHandler = (
  apiCall,
  formData,
  resetForm,
  setMessage,
  setLoading,
  successMessage = 'Operation completed successfully!'
) => {
  return async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      await apiCall(formData);
      setMessage(successMessage);
      if (resetForm) resetForm();
    } catch (error) {
      setMessage(error.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
};

// Parse form data for API calls
export const parseFormData = (formData, parsers = {}) => {
  const parsed = { ...formData };
  
  Object.keys(parsers).forEach(key => {
    if (key in parsed && parsed[key] !== '') {
      parsed[key] = parsers[key](parsed[key]);
    }
  });
  
  return parsed;
};

// Common number parsers
export const numberParsers = {
  int: (value) => parseInt(value, 10),
  float: (value) => parseFloat(value),
};

// Reset form to initial values
export const resetFormToInitial = (initialValues, setForm) => {
  setForm(initialValues);
};


