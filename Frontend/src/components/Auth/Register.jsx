import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import reactLogo from '../../assets/react-logo.png';


const roles = [
  { value: 'USER', label: 'User (Default Requester)' },
  { value: 'AMBULANCE_DRIVER', label: 'Ambulance Driver' },
  { value: 'FIRE_DRIVER', label: 'Fire Truck Driver' },
  { value: 'POLICE_OFFICER', label: 'Police Officer' },
  { value: 'FIRE_STATION_ADMIN', label: 'Fire Station Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'AMBULANCE_ADMIN', label: 'Ambulance Admin' },
  { value: 'POLICE_STATION_ADMIN', label: 'Police Station Admin' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    role: 'USER',
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
    fireStationId: '',
    policeStationId: '',
    securityQuestion: 'PET_NAME',
    securityAnswer: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // New state for individual input errors
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    licenseNumber: '',
    vehicleRegNumber: '',
    hospitalID: '',
    fireStationId: '',
    policeStationId: '',
    securityAnswer: '',
  });

  // Regex patterns - updated to match backend DTO validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const licenseRegex = /^[A-Z]{2}-[A-Z]+-\d{4}$/i; // Format: STATE-TYPE-NUMBER (e.g., MH-FIRE-0234)
  const vehicleRegRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i; // Format: STATE + 2 digits + 2 letters + 4 digits (e.g., MH15BA3254)

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full Name is required.';
        else if (value.length > 100) error = 'Full Name cannot exceed 100 characters.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'phoneNumber':
        if (!value.trim()) error = 'Phone Number is required.';
        else if (!phoneRegex.test(value)) error = 'Must be a 10-digit Indian number (starts with 6-9).';
        break;
      case 'governmentId':
        if (!value.trim()) error = 'Government ID is required.';
        else if (!panRegex.test(value)) error = 'Enter valid PAN number (e.g., ABCDE1234F).';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required.';
        else if (value.length < 6) error = 'Password must be at least 6 characters long.';
        break;
      case 'licenseNumber':
        if (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER' || form.role === 'ADMIN') {
          if (!value.trim()) error = 'License Number is required.';
          else if (!licenseRegex.test(value)) error = 'Enter valid License (e.g., MH-FIRE-0234).';
        }
        break;
      case 'vehicleRegNumber':
        if (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER' || form.role === 'ADMIN') {
          if (!value.trim()) error = 'Vehicle Registration is required.';
          else if (!vehicleRegRegex.test(value)) error = 'Enter valid Vehicle Reg (e.g., MH15BA3254).';
        }
        break;
      case 'hospitalID':
        if (form.role === 'AMBULANCE_DRIVER') {
          if (!value.toString().trim()) error = 'Hospital ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Hospital ID must be a positive number.';
        }
        break;
      case 'fireStationId':
        if (form.role === 'FIRE_DRIVER' || form.role === 'ADMIN') {
          if (!value.toString().trim()) error = 'Fire Station ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Fire Station ID must be a positive number.';
        }
        break;
      case 'policeStationId':
        if (form.role === 'POLICE_OFFICER') {
          if (!value.toString().trim()) error = 'Police Station ID is required.';
          else if (isNaN(Number(value)) || Number(value) <= 0) error = 'Police Station ID must be a positive number.';
        }
        break;
      case 'securityAnswer':
        if (!value.trim()) error = 'Security Answer is required.';
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateAllFields = () => {
    let isValid = true;
    const fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'governmentId', 'password', 'securityAnswer'];

    // Add role-specific fields
    if (form.role === 'AMBULANCE_DRIVER') {
      fieldsToValidate.push('licenseNumber', 'vehicleRegNumber', 'hospitalID');
    } else if (form.role === 'FIRE_DRIVER') {
      fieldsToValidate.push('licenseNumber', 'vehicleRegNumber', 'fireStationId');
    } else if (form.role === 'POLICE_OFFICER') {
      fieldsToValidate.push('policeStationId');
    } else if (form.role === 'ADMIN') {
      fieldsToValidate.push('licenseNumber', 'vehicleRegNumber', 'fireStationId');
    }
    // Other admin roles (FIRE_STATION_ADMIN, AMBULANCE_ADMIN, POLICE_STATION_ADMIN) don't need additional fields

    for (const fieldName of fieldsToValidate) {
      // Ensure specific ID fields are not empty if role applies
      if ((fieldName === 'hospitalID' || fieldName === 'fireStationId' || fieldName === 'policeStationId') && !form[fieldName]) {
        setFormErrors(prev => ({ ...prev, [fieldName]: `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
        isValid = false;
        continue;
      }
      // Ensure license/vehicle fields are not empty if role applies
      if ((fieldName === 'licenseNumber' || fieldName === 'vehicleRegNumber') && (form.role === 'AMBULANCE_DRIVER' || form.role === 'FIRE_DRIVER' || form.role === 'ADMIN') && !form[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required.` }));
          isValid = false;
          continue;
      }

      if (!validateField(fieldName, form[fieldName])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateAllFields()) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);

    let endpoint = 'http://localhost:8080/auth/register';
    let body = {};

    switch (form.role) {
      case 'AMBULANCE_DRIVER':
        endpoint = 'http://localhost:8080/auth/register/ambulance-driver';
        body = { ...form, hospitalID: Number(form.hospitalID) };
        break;
      case 'FIRE_DRIVER':
        endpoint = 'http://localhost:8080/auth/register/fire-driver';
        body = { ...form, fireStationId: Number(form.fireStationId) };
        break;
      case 'POLICE_OFFICER':
        endpoint = 'http://localhost:8080/auth/register/police-officer';
        body = { ...form, policeStationId: Number(form.policeStationId) };
        break;
      case 'ADMIN':
        endpoint = 'http://localhost:8080/auth/register';
        body = { ...form, fireStationId: Number(form.fireStationId) };
        break;
      default:
        // All other roles (USER, FIRE_STATION_ADMIN, AMBULANCE_ADMIN, POLICE_STATION_ADMIN) 
        // use the general registration endpoint
        endpoint = 'http://localhost:8080/auth/register';
        body = { ...form };
        break;
    }

    // Clean up unnecessary fields based on role before sending
    const cleanedBody = { ...body };
    if (form.role !== 'AMBULANCE_DRIVER') { delete cleanedBody.hospitalID; }
    if (form.role !== 'FIRE_DRIVER' && form.role !== 'ADMIN') { delete cleanedBody.fireStationId; }
    if (form.role !== 'POLICE_OFFICER') { delete cleanedBody.policeStationId; }
    // Only include license and vehicle reg for specific roles
    if (!['AMBULANCE_DRIVER', 'FIRE_DRIVER', 'ADMIN'].includes(form.role)) { 
      delete cleanedBody.licenseNumber; 
      delete cleanedBody.vehicleRegNumber; 
    }
    // Other admin roles (USER, FIRE_STATION_ADMIN, AMBULANCE_ADMIN, POLICE_STATION_ADMIN) don't need driver-specific fields
    if (['USER', 'FIRE_STATION_ADMIN', 'AMBULANCE_ADMIN', 'POLICE_STATION_ADMIN'].includes(form.role)) { 
      delete cleanedBody.licenseNumber; 
      delete cleanedBody.vehicleRegNumber; 
      delete cleanedBody.hospitalID; 
      delete cleanedBody.fireStationId; 
      delete cleanedBody.policeStationId; 
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedBody),
      });

      if (res.ok) {
        setMessage('Registration successful!');
        setForm({
          fullName: '', email: '', phoneNumber: '', governmentId: '', password: '',
          role: 'USER', licenseNumber: '', vehicleRegNumber: '', hospitalID: '',
          fireStationId: '', policeStationId: '', securityQuestion: 'PET_NAME', securityAnswer: '',
        });
        setFormErrors({});
        // Redirect based on role after successful registration
        if (['ADMIN', 'FIRE_STATION_ADMIN', 'AMBULANCE_ADMIN', 'POLICE_STATION_ADMIN'].includes(form.role)) {
          setTimeout(() => navigate('/admin-dashboard'), 1500);
        } else {
            setTimeout(() => navigate('/'), 1500);
        }
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const securityQuestions = [
    { value: 'PET_NAME', label: "What is your pet's name?" },
    { value: 'BIRTH_CITY', label: 'In which city were you born?' },
    { value: 'FAVORITE_TEACHER', label: 'Who was your favorite teacher?' },
    { value: 'MOTHER_MAIDEN_NAME', label: "What is your mother's maiden name?" },
  ];

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
      style={{
        background: '#4b6cb7',
        background: '-webkit-linear-gradient(to bottom, #4b6cb7, #182848)',
        background: 'linear-gradient(to bottom, #4b6cb7, #182848)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 pointer-events-none"></div>
      
      {/* Global Grid Background Pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        {/* Additional larger grid for depth */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)
          `,
          backgroundSize: '240px 240px'
        }}></div>
        {/* Extra large grid for structure */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 3px, transparent 3px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 3px, transparent 3px)
          `,
          backgroundSize: '480px 480px'
        }}></div>
      </div>

      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="flex flex-col justify-center p-6">
          <div className="max-w-2xl w-full space-y-6 mx-auto py-6 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mb-4">
              <img src={reactLogo} alt="Login Visual" className="w-20 h-20 object-cover rounded-xl" />

              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
                filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
              }}>
                Create Account
              </h2>
              <p className="text-cyan-100 text-sm font-medium">Join our emergency response network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                  <input 
                    name="fullName" 
                    value={form.fullName} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    maxLength="100"
                    className={`w-full px-3 py-3 border ${formErrors.fullName ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && <p className="mt-1 text-sm text-red-300">{formErrors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <input 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    className={`w-full px-3 py-3 border ${formErrors.email ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-300">{formErrors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                  <input 
                    name="phoneNumber" 
                    value={form.phoneNumber} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    maxLength="10"
                    className={`w-full px-3 py-3 border ${formErrors.phoneNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-300">{formErrors.phoneNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Government ID (PAN)</label>
                  <input 
                    name="governmentId" 
                    value={form.governmentId} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    maxLength="10"
                    className={`w-full px-3 py-3 border ${formErrors.governmentId ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="ABCDE1234F"
                  />
                  {formErrors.governmentId && <p className="mt-1 text-sm text-red-300">{formErrors.governmentId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    minLength="6"
                    className={`w-full px-3 py-3 border ${formErrors.password ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter your password"
                  />
                  {formErrors.password && <p className="mt-1 text-sm text-red-300">{formErrors.password}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Role</label>
                  <select 
                    name="role" 
                    value={form.role} 
                    onChange={handleChange} 
                    className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value} className="bg-gray-800 text-white">{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Security Question</label>
                  <select 
                    name="securityQuestion" 
                    value={form.securityQuestion} 
                    onChange={handleChange} 
                    className="w-full px-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  >
                    {securityQuestions.map((q) => (
                      <option key={q.value} value={q.value} className="bg-gray-800 text-white">{q.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Security Answer</label>
                  <input 
                    name="securityAnswer" 
                    value={form.securityAnswer} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    className={`w-full px-3 py-3 border ${formErrors.securityAnswer ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter your answer"
                  />
                  {formErrors.securityAnswer && <p className="mt-1 text-sm text-red-300">{formErrors.securityAnswer}</p>}
                </div>
              </div>
              
              {/* Ambulance Driver fields */}
              {form.role === 'AMBULANCE_DRIVER' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">License Number</label>
                    <input 
                      name="licenseNumber" 
                      value={form.licenseNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="17"
                      className={`w-full px-3 py-3 border ${formErrors.licenseNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="KA01 20200012345"
                    />
                    {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-300">{formErrors.licenseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Vehicle Registration</label>
                    <input 
                      name="vehicleRegNumber" 
                      value={form.vehicleRegNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="10"
                      className={`w-full px-3 py-3 border ${formErrors.vehicleRegNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="MH12AB1234"
                    />
                    {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-300">{formErrors.vehicleRegNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Hospital ID</label>
                    <input 
                      name="hospitalID" 
                      type="number" 
                      value={form.hospitalID} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      min="1"
                      className={`w-full px-3 py-3 border ${formErrors.hospitalID ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="Enter hospital ID"
                    />
                    {formErrors.hospitalID && <p className="mt-1 text-sm text-red-300">{formErrors.hospitalID}</p>}
                  </div>
                </div>
              )}
              
              {/* Fire Driver fields */}
              {form.role === 'FIRE_DRIVER' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">License Number</label>
                    <input 
                      name="licenseNumber" 
                      value={form.licenseNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="17"
                      className={`w-full px-3 py-3 border ${formErrors.licenseNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="KA01 20200012345"
                    />
                    {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-300">{formErrors.licenseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Vehicle Registration</label>
                    <input 
                      name="vehicleRegNumber" 
                      value={form.vehicleRegNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="10"
                      className={`w-full px-3 py-3 border ${formErrors.vehicleRegNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="MH12AB1234"
                    />
                    {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-300">{formErrors.vehicleRegNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Fire Station ID</label>
                    <input 
                      name="fireStationId" 
                      type="number" 
                      value={form.fireStationId} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      min="1"
                      className={`w-full px-3 py-3 border ${formErrors.fireStationId ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="Enter fire station ID"
                    />
                    {formErrors.fireStationId && <p className="mt-1 text-sm text-red-300">{formErrors.fireStationId}</p>}
                  </div>
                </div>
              )}
              
              {/* Police Officer fields */}
              {form.role === 'POLICE_OFFICER' && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Police Station ID</label>
                  <input 
                    name="policeStationId" 
                    type="number" 
                    value={form.policeStationId} 
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    required 
                    min="1"
                    className={`w-full px-3 py-3 border ${formErrors.policeStationId ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                    placeholder="Enter police station ID"
                  />
                  {formErrors.policeStationId && <p className="mt-1 text-sm text-red-300">{formErrors.policeStationId}</p>}
                </div>
              )}
               
              {/* Admin fields */}
              {form.role === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">License Number</label>
                    <input 
                      name="licenseNumber" 
                      value={form.licenseNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="20"
                      className={`w-full px-3 py-3 border ${formErrors.licenseNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="MH-FIRE-0234"
                    />
                    {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-300">{formErrors.licenseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Vehicle Registration</label>
                    <input 
                      name="vehicleRegNumber" 
                      value={form.vehicleRegNumber} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      maxLength="10"
                      className={`w-full px-3 py-3 border ${formErrors.vehicleRegNumber ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="MH15BA3254"
                    />
                    {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-300">{formErrors.vehicleRegNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Fire Station ID</label>
                    <input 
                      name="fireStationId" 
                      type="number" 
                      value={form.fireStationId} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      required 
                      min="1"
                      className={`w-full px-3 py-3 border ${formErrors.fireStationId ? 'border-red-400' : 'border-white/20'} rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300`}
                      placeholder="Enter fire station ID"
                    />
                    {formErrors.fireStationId && <p className="mt-1 text-sm text-red-300">{formErrors.fireStationId}</p>}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {message && (
                <div className={`px-4 py-3 rounded-lg text-sm backdrop-blur-sm ${
                  message.includes('success') 
                    ? 'bg-green-500/20 border border-green-300/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-300/30 text-red-200'
                }`}>
                  {message}
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <span className="text-white/80">Already have an account? </span>
              <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors">Sign in</Link>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-white/10">
              <button 
                onClick={() => navigate('/')} 
                className="text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors flex items-center justify-center mx-auto"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





