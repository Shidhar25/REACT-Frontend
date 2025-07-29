import { useState } from 'react';

const roles = [
  { value: 'USER', label: 'User (Requester)' },
  { value: 'AMBULANCE_DRIVER', label: 'Ambulance Driver' },
  { value: 'FIRE_DRIVER', label: 'Fire Truck Driver' },
  { value: 'POLICE_OFFICER', label: 'Police Officer' },
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    governmentId: '',
    password: '',
    role: 'USER',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage('Registration successful!');
        setForm({ fullName: '', email: '', phoneNumber: '', governmentId: '', password: '', role: 'USER' });
      } else {
        const data = await res.json();
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name<br />
              <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email<br />
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number<br />
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Government ID<br />
              <input name="governmentId" value={form.governmentId} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Password<br />
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">Role<br />
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Register</button>
        </form>
        {message && <p className={`mt-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
} 