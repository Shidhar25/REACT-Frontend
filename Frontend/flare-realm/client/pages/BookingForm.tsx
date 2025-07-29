import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const issueTypes = [
  "Medical Emergency",
  "Car Accident",
  "Fire",
  "Plane Crash",
  "Natural Disaster",
  "Assault",
  "Heart Attack",
  "Stroke",
  "Other"
];

export default function BookingForm() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    issueType: "",
    notes: "",
    needAmbulance: false,
    requestedAmbulanceCount: 1,
    needPolice: false,
    requestedPoliceCount: 1,
    needFireBrigade: false,
    requestedFireTruckCount: 1,
    isForSelf: true,
    victimPhoneNumber: "",
    address: ""
  });

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enter coordinates manually.");
          setLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        [name]: checked,
        // Reset count to 1 when service is enabled
        ...(checked && name === 'needAmbulance' && { requestedAmbulanceCount: 1 }),
        ...(checked && name === 'needPolice' && { requestedPoliceCount: 1 }),
        ...(checked && name === 'needFireBrigade' && { requestedFireTruckCount: 1 })
      }));
    } else if (type === 'number') {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.issueType) {
      setError("Please select an issue type.");
      return;
    }
    
    if (!form.needAmbulance && !form.needPolice && !form.needFireBrigade) {
      setError("Please select at least one service (Ambulance, Police, or Fire Brigade).");
      return;
    }
    
    if (!form.isForSelf && !form.victimPhoneNumber) {
      setError("Please enter the victim's phone number.");
      return;
    }
    
    const latitudeNum = parseFloat(form.latitude);
    const longitudeNum = parseFloat(form.longitude);
    if (isNaN(latitudeNum) || isNaN(longitudeNum)) {
      setError("Please provide a valid location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8080/booking/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: latitudeNum,
          longitude: longitudeNum,
          issueType: form.issueType,
          notes: form.notes,
          needAmbulance: form.needAmbulance,
          requestedAmbulanceCount: form.requestedAmbulanceCount,
          needPolice: form.needPolice,
          requestedPoliceCount: form.requestedPoliceCount,
          needFireBrigade: form.needFireBrigade,
          requestedFireTruckCount: form.requestedFireTruckCount,
          isForSelf: form.isForSelf,
          victimPhoneNumber: form.victimPhoneNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Booking request failed.");
        return;
      }

      // Success - navigate to tracking page
      localStorage.setItem('lastBooking', JSON.stringify({
        userLocation: { latitude: latitudeNum, longitude: longitudeNum },
        userAddress: form.address,
        bookingResponse: data
      }));
      alert("Emergency request submitted successfully! Help is on the way.");
      navigate("/tracking");
      
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (locationLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-50 to-red-100 font-cantata flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-red-50 to-red-100 font-cantata overflow-hidden">
      {/* Header */}
      <div className="w-full h-16 bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-between px-6 shadow-lg">
        <div className="text-white text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          Emergency Request
        </div>
        <button
          onClick={handleLogout}
          className="text-white text-sm hover:bg-red-500 px-3 py-1 rounded transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="h-[calc(100vh-4rem)] p-6 overflow-hidden">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r mb-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
            {/* Left Column */}
            <div className="space-y-4 overflow-y-auto pr-2">
              {/* Location Information */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-xl">📍</span>
                  Location Details
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="18.5104"
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="73.8467"
                      inputMode="decimal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="908, ABS Road, City"
                  />
                </div>
              </div>

              {/* Emergency Details */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-xl">🚨</span>
                  Emergency Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Issue Type *</label>
                    <select
                      name="issueType"
                      value={form.issueType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select issue type</option>
                      {issueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={2}
                      placeholder="Describe the emergency situation..."
                    />
                  </div>
                </div>
              </div>

              {/* Victim Information */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-xl">👤</span>
                  Victim Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isForSelf"
                      checked={form.isForSelf}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label className="font-medium text-gray-700">This emergency is for myself</label>
                  </div>
                  
                  {!form.isForSelf && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Victim's Phone Number *</label>
                      <input
                        type="tel"
                        name="victimPhoneNumber"
                        value={form.victimPhoneNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="9876543210"
                        required={!form.isForSelf}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 overflow-y-auto pl-2">
              {/* Service Requirements */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-xl">🚑</span>
                  Required Services
                </h2>
                <div className="space-y-4">
                  {/* Ambulance */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="needAmbulance"
                        checked={form.needAmbulance}
                        onChange={handleChange}
                        className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label className="font-medium text-gray-700">🚑 Ambulance</label>
                    </div>
                    {form.needAmbulance && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Count:</span>
                        <input
                          type="number"
                          name="requestedAmbulanceCount"
                          value={form.requestedAmbulanceCount}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Police */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="needPolice"
                        checked={form.needPolice}
                        onChange={handleChange}
                        className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label className="font-medium text-gray-700">👮 Police</label>
                    </div>
                    {form.needPolice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Count:</span>
                        <input
                          type="number"
                          name="requestedPoliceCount"
                          value={form.requestedPoliceCount}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Fire Brigade */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="needFireBrigade"
                        checked={form.needFireBrigade}
                        onChange={handleChange}
                        className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label className="font-medium text-gray-700">🚒 Fire Brigade</label>
                    </div>
                    {form.needFireBrigade && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Count:</span>
                        <input
                          type="number"
                          name="requestedFireTruckCount"
                          value={form.requestedFireTruckCount}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                <h3 className="text-lg font-semibold mb-3 text-red-800">📋 Request Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Type:</span>
                    <span className="font-medium">{form.issueType || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-medium">
                      {[
                        form.needAmbulance && `${form.requestedAmbulanceCount} Ambulance`,
                        form.needPolice && `${form.requestedPoliceCount} Police`,
                        form.needFireBrigade && `${form.requestedFireTruckCount} Fire Truck`
                      ].filter(Boolean).join(", ") || "None selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">For:</span>
                    <span className="font-medium">{form.isForSelf ? "Self" : "Another person"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting Request...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🚨</span>
                  Submit Emergency Request
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/index")}
              className="px-6 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors shadow-lg"
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 