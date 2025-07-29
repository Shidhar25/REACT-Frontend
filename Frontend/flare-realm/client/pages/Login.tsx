import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaAmbulance, FaFireExtinguisher, FaUserShield } from 'react-icons/fa';

const roles = ["USER", "ADMIN"];
const userTypes = [
  "CITIZEN",               // Default requester
  "AMBULANCE_DRIVER",      // Assigned to ambulance      // General officer
  "FIRE_DRIVER",           // Handles fire truck
                   // Super Admin
];

export default function Login() {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    governmentId: "",
    password: "",
    role: "USER",
    userType: "CITIZEN",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && (!form.fullName || !form.email || !form.phoneNumber || !form.governmentId || !form.password)) {
      setError("Please fill all fields.");
      return;
    }
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    if (isSignup) {
      try {
        const res = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Registration failed.");
          return;
        }
        alert("Registration successful! Please log in.");
        localStorage.setItem('userInfo', JSON.stringify({
          fullName: form.fullName,
          governmentId: form.governmentId,
          phoneNumber: form.phoneNumber
        }));
        setIsSignup(false);
      } catch (err) {
        setError("Network error. Please try again.");
      }
    } else {
      // Real login with JWT
      try {
        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Login failed.");
          return;
        }
        if (data.token) {
          alert("Login successful!");
          // Debug userType values
          console.log("userType from backend:", data.userType, "userType from form:", form.userType);
          // Store user info for profile
          localStorage.setItem('userInfo', JSON.stringify({
            fullName: data.fullName || form.fullName || "",
            governmentId: data.governmentId || form.governmentId || "",
            phoneNumber: data.phoneNumber || form.phoneNumber || ""
          }));
          // Store userId for API calls
          if (data.userId) {
            localStorage.setItem('userId', data.userId);
          }
          // Simple navigation - all users go to index for now
          login(data.token, data.role || form.role, data.userType || form.userType, "/index");
        } else {
          setError("No token received.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-red-100 relative overflow-hidden">
      {/* Emergency SVG/Icons background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex justify-center items-center z-0">
        <FaAmbulance size={180} className="text-red-400 mx-8" />
        <FaFireExtinguisher size={140} className="text-orange-400 mx-8" />
        <FaUserShield size={140} className="text-blue-400 mx-8" />
      </div>
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 w-full max-w-md z-10 border-t-8 border-red-500">
        <div className="flex flex-col items-center mb-6">
          <FaAmbulance size={48} className="text-red-500 mb-2 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-red-600 tracking-tight mb-1 drop-shadow">Emergency Response Portal</h1>
          <div className="text-blue-700 text-base font-medium mb-2 text-center">One platform for Ambulance, Fire, and Police emergencies</div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isSignup ? "Create Your Account" : "Sign In to Continue"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Government ID</label>
                <input
                  type="text"
                  name="governmentId"
                  value={form.governmentId}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400"
                  autoComplete="off"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">User Type</label>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                {userTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-blue-600 text-white py-2 rounded-xl font-bold shadow-lg hover:from-red-600 hover:to-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => setIsSignup((v) => !v)}
          >
            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Emergency Response Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
} 