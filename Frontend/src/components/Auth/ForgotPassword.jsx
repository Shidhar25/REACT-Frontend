import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; // For message icons
import AmbulanceGif from '../../assets/background.gif'; // Import the GIF

export default function ForgotPassword() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(''); // Stores the question from the backend
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // New state for input validation errors
  const [formErrors, setFormErrors] = useState({
    email: '',
    securityAnswer: '',
    newPassword: '',
  });

  // Regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/; // Password at least 6 characters long

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value.trim()) error = 'Email is required.';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address.';
        break;
      case 'securityAnswer':
        if (!value.trim()) error = 'Security Answer is required.';
        break;
      case 'newPassword':
        if (!value.trim()) error = 'New Password is required.';
        else if (!passwordRegex.test(value)) error = 'Password must be at least 6 characters long.';
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'securityAnswer') setSecurityAnswer(value);
    else if (name === 'newPassword') setNewPassword(value);
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Step 1: Request
  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateField('email', email)) {
      setMessage('Please correct the email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        // Assuming backend returns security question type, e.g., { securityQuestion: "PET_NAME" }
        setSecurityQuestion(data.securityQuestion || 'PET_NAME'); // Default if not returned
        setMessage('Security question retrieved. Please answer it.');
        setStep(2);
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Email not found or failed to retrieve security question.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify and Reset
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    let isValid = true;
    if (!validateField('securityAnswer', securityAnswer)) isValid = false;
    if (!validateField('newPassword', newPassword)) isValid = false;

    if (!isValid) {
      setMessage('Please correct the errors in the form.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer, newPassword }),
      });
      if (res.ok) {
        setMessage('Password reset successful! You can now log in.');
        setStep(3);
        // Optionally redirect to login after a short delay
        setTimeout(() => navigate('/'), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.message || 'Verification failed. Incorrect answer or weak password.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Security question text mapping (from Register.jsx, assume consistent)
  const questionText = {
    PET_NAME: "What is your pet’s name?",
    BIRTH_CITY: "In which city were you born?",
    FAVORITE_TEACHER: "Who was your favorite teacher?",
    MOTHER_MAIDEN_NAME: "What is your mother's maiden name?",
  };

  const inputClass = (name) => `w-full px-4 py-2 border ${formErrors[name] ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
      <style jsx>{`
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
      {/* Full background GIF */}
      <img
        src={AmbulanceGif}
        alt="Ambulance background"
        className="fixed inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
        style={{ filter: 'brightness(0.3) blur(2px)', opacity: 1.2 }}
        draggable="false"
      />
      {/* Main container for the form, now with transparency and glow */}
      <div className="bg-white/10 p-8 rounded-lg shadow-xl w-full max-w-sm border border-white/20 relative z-10 glow-effect">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-white">Email<br />
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass('email')}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-md" disabled={loading}>
              {loading ? 'Sending Request...' : 'Next'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-white">Security Question<br />
                <input
                  value={questionText[securityQuestion] || 'Security Question'}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed" // Muted disabled style
                />
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium text-white">Security Answer<br />
                <input
                  name="securityAnswer"
                  value={securityAnswer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={inputClass('securityAnswer')}
                />
                {formErrors.securityAnswer && <p className="mt-1 text-sm text-red-600">{formErrors.securityAnswer}</p>}
              </label>
            </div>
            <div>
              <label className="block mb-1 font-medium text-white">New Password<br />
                <input
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  minLength="6"
                  className={inputClass('newPassword')}
                />
                {formErrors.newPassword && <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>}
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors shadow-md" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-green-600 font-medium flex items-center justify-center gap-2">
            <CheckCircleIcon className="h-5 w-5" /> {message}
          </div>
        )}
        {message && step !== 3 && ( // Display error message unless it's the final success message
          <p className={`mt-4 text-center text-sm flex items-center justify-center gap-2 ${message.includes('success') || message.includes('retrieved') ? 'text-green-600' : 'text-red-500'}`}>
            {message.includes('success') || message.includes('retrieved') ? <InformationCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
            {message}
          </p>
        )}
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}