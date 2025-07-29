import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    chronic: "",
    medications: "",
    surgeries: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    notes: "",
    governmentId: ""
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) setForm(JSON.parse(saved));
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const info = JSON.parse(userInfo);
      setForm(prev => ({
        ...prev,
        name: info.fullName || prev.name,
        governmentId: info.governmentId || prev.governmentId,
        phone: info.phoneNumber || prev.phone
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(form));
    setEditing(false);
    alert("Profile saved!");
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF] font-cantata max-w-md mx-auto py-6 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-900">My Profile</h1>
        <button
          onClick={() => navigate("/index")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Personal Info */}
        <div>
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 gap-3">
            <input name="name" value={form.name} onChange={handleChange} disabled={true} placeholder="Full Name" className="border rounded px-3 py-2 bg-gray-100" />
            <input name="governmentId" value={form.governmentId || ""} onChange={handleChange} disabled={true} placeholder="Government ID" className="border rounded px-3 py-2 bg-gray-100" />
            <input name="age" value={form.age} onChange={handleChange} disabled={!editing} placeholder="Age" className="border rounded px-3 py-2" />
            <input name="gender" value={form.gender} onChange={handleChange} disabled={!editing} placeholder="Gender" className="border rounded px-3 py-2" />
            <input name="phone" value={form.phone} onChange={handleChange} disabled={true} placeholder="Phone Number" className="border rounded px-3 py-2 bg-gray-100" />
            <input name="address" value={form.address} onChange={handleChange} disabled={!editing} placeholder="Address" className="border rounded px-3 py-2" />
          </div>
        </div>
        {/* Medical Info */}
        <div>
          <h2 className="text-lg font-semibold text-red-700 mb-2">Medical Information</h2>
          <div className="grid grid-cols-1 gap-3">
            <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} disabled={!editing} placeholder="Blood Group" className="border rounded px-3 py-2" />
            <input name="allergies" value={form.allergies} onChange={handleChange} disabled={!editing} placeholder="Allergies" className="border rounded px-3 py-2" />
            <input name="chronic" value={form.chronic} onChange={handleChange} disabled={!editing} placeholder="Chronic Conditions" className="border rounded px-3 py-2" />
            <input name="medications" value={form.medications} onChange={handleChange} disabled={!editing} placeholder="Current Medications" className="border rounded px-3 py-2" />
            <input name="surgeries" value={form.surgeries} onChange={handleChange} disabled={!editing} placeholder="Past Surgeries" className="border rounded px-3 py-2" />
            <textarea name="notes" value={form.notes} onChange={handleChange} disabled={!editing} placeholder="Other Notes" className="border rounded px-3 py-2" rows={2} />
          </div>
        </div>
        {/* Emergency Contact */}
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-2">Emergency Contact</h2>
          <div className="grid grid-cols-1 gap-3">
            <input name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} disabled={!editing} placeholder="Contact Name" className="border rounded px-3 py-2" />
            <input name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} disabled={!editing} placeholder="Relation" className="border rounded px-3 py-2" />
            <input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} disabled={!editing} placeholder="Contact Phone" className="border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Save</button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
} 