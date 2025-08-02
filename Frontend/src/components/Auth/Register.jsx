import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../assets/login.png';
import AmbulanceGif from '../../assets/background.gif';
import { GoogleLogin } from '@react-oauth/google';

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

  const inputClass = (name) => `w-full px-4 py-2 border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`;

return (
  <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
    <style>{`
      .glow-effect {
        box-shadow:
          0 0 20px rgba(59, 130, 246, 0.3),
          0 0 40px rgba(59, 130, 246, 0.2),
          0 0 60px rgba(59, 130, 246, 0.1),
          0 0 80px rgba(59, 130, 246, 0.05);
        animation: glow 3s ease-in-out infinite alternate;
      }
      @keyframes glow {
        from {
          box-shadow:
            0 0 20px rgba(59, 130, 246, 0.3),
            0 0 40px rgba(59, 130, 246, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1),
            0 0 80px rgba(59, 130, 246, 0.05);
        }
        to {
          box-shadow:
            0 0 30px rgba(59, 130, 246, 0.4),
            0 0 60px rgba(59, 130, 246, 0.3),
            0 0 90px rgba(59, 130, 246, 0.2),
            0 0 120px rgba(59, 130, 246, 0.1);
        }
      }
    `}</style>
    <img src={AmbulanceGif} alt="Ambulance background" className="fixed inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none" style={{ filter: 'brightness(0.3) blur(2px)', opacity: 0.4 }} draggable="false" />
    <div className="flex w-full max-w-4xl bg-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 border border-white/20 glow-effect">
      <div className="hidden md:flex flex-col justify-center items-center bg-white/10 p-8 w-1/2">
        <img src={LoginImage} alt="Register Visual" className="w-64 h-64 object-contain rounded-xl shadow-md" />
        <div className="mt-6 space-y-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              console.log('Google OAuth Success:', credentialResponse);
              await handleOAuthPreFill('google', credentialResponse.credential);
            }}
            onError={() => console.log('Google OAuth Error')}
            useOneTap
          />
          <button
            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/github'}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign up with GitHub
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-xl w-full max-w-sm border border-gray-100 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Register</h2>
          {/* Keep your form fields here as-is */}
           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                <label className="block mb-1 font-medium text-white">Full Name<br />
                   <input name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur} required maxLength="100" className={inputClass('fullName')} />
                   {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Email<br />
                   <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} required className={inputClass('email')} />
                   {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Phone Number<br />
                   <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('phoneNumber')} />
                   {formErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Government ID (PAN)<br />
                   <input name="governmentId" value={form.governmentId} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('governmentId')} placeholder="ABCDE1234F" />
                   {formErrors.governmentId && <p className="mt-1 text-sm text-red-600">{formErrors.governmentId}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Password<br />
                   <input name="password" type="password" value={form.password} onChange={handleChange} onBlur={handleBlur} required minLength="6" className={inputClass('password')} />
                   {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Security Question<br />
                   <select name="securityQuestion" value={form.securityQuestion} onChange={handleChange} onBlur={handleBlur} required className={inputClass('securityQuestion')}>
                     {securityQuestions.map((q) => (
                       <option key={q.value} value={q.value}>{q.label}</option>
                     ))}
                   </select>
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Security Answer<br />
                   <input name="securityAnswer" value={form.securityAnswer} onChange={handleChange} onBlur={handleBlur} required className={inputClass('securityAnswer')} />
                   {formErrors.securityAnswer && <p className="mt-1 text-sm text-red-600">{formErrors.securityAnswer}</p>}
                 </label>
               </div>
               <div>
                <label className="block mb-1 font-medium text-white">Register as:<br />
                   <select name="role" value={form.role} onChange={handleChange} className={inputClass('role')}>
                     {roles.map((role) => (
                       <option key={role.value} value={role.value}>{role.label}</option>
                     ))}
                   </select>
                 </label>
               </div>
              
               {/* Ambulance Driver fields */}
               {form.role === 'AMBULANCE_DRIVER' && (
                 <>
                   <div>
                    <label className="block mb-1 font-medium text-white">License Number<br />
                       <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="17" className={inputClass('licenseNumber')} placeholder="KA01 20200012345" />
                       {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Vehicle Registration Number<br />
                       <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('vehicleRegNumber')} placeholder="MH12AB1234" />
                       {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Hospital ID<br />
                       <input name="hospitalID" type="number" value={form.hospitalID} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('hospitalID')} />
                       {formErrors.hospitalID && <p className="mt-1 text-sm text-red-600">{formErrors.hospitalID}</p>}
                     </label>
                   </div>
                 </>
               )}
              
               {/* Fire Driver fields */}
               {form.role === 'FIRE_DRIVER' && (
                 <>
                   <div>
                    <label className="block mb-1 font-medium text-white">License Number<br />
                       <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="17" className={inputClass('licenseNumber')} placeholder="KA01 20200012345" />
                       {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Vehicle Registration Number<br />
                       <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('vehicleRegNumber')} placeholder="MH12AB1234" />
                       {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Fire Station ID<br />
                       <input name="fireStationId" type="number" value={form.fireStationId} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('fireStationId')} />
                       {formErrors.fireStationId && <p className="mt-1 text-sm text-red-600">{formErrors.fireStationId}</p>}
                     </label>
                   </div>
                 </>
               )}
              
               {/* Police Officer fields */}
               {form.role === 'POLICE_OFFICER' && (
                 <div>
                  <label className="block mb-1 font-medium text-white">Police Station ID<br />
                     <input name="policeStationId" type="number" value={form.policeStationId} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('policeStationId')} />
                     {formErrors.policeStationId && <p className="mt-1 text-sm text-red-600">{formErrors.policeStationId}</p>}
                   </label>
                 </div>
               )}
               
               {/* Admin fields */}
               {form.role === 'ADMIN' && (
                 <>
                   <div>
                    <label className="block mb-1 font-medium text-white">License Number<br />
                       <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="20" className={inputClass('licenseNumber')} placeholder="MH-FIRE-0234" />
                       {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Vehicle Registration Number<br />
                       <input name="vehicleRegNumber" value={form.vehicleRegNumber} onChange={handleChange} onBlur={handleBlur} required maxLength="10" className={inputClass('vehicleRegNumber')} placeholder="MH15BA3254" />
                       {formErrors.vehicleRegNumber && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleRegNumber}</p>}
                     </label>
                   </div>
                   <div>
                    <label className="block mb-1 font-medium text-white">Fire Station ID<br />
                       <input name="fireStationId" type="number" value={form.fireStationId} onChange={handleChange} onBlur={handleBlur} required min="1" className={inputClass('fireStationId')} />
                       {formErrors.fireStationId && <p className="mt-1 text-sm text-red-600">{formErrors.fireStationId}</p>}
                     </label>
                   </div>
                 </>
               )}
              
               <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-md">
                 {loading ? 'Registering...' : 'Register'}
               </button>
             </form>
          {/* Submit button and error message */}
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-md">
            {loading ? 'Registering...' : 'Register'}
          </button>
          {message && <p className={`mt-4 text-center text-sm transition-opacity duration-300 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
          <div className="mt-4 text-center">
            <span className="text-white">Already have an account? </span>
            <a href="/" className="text-blue-600 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

 }





