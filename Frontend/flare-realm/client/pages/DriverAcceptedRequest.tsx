import { useState } from "react";

const patient = {
  name: "Manoj Patel",
  address: "XYZ Road, City",
  condition: "ABC",
  severity: "Mild",
};
const hospital = {
  name: "Sunrise Hospital",
  address: "123 Hospital Rd, City",
  details: "Bed/OT/ICU assigned",
};
const payment = {
  amount: 1126.18,
  status: "Not Paid", // or "Paid"
};

function CollapseIcon({ className = "w-6 h-6", collapsed = false }: { className?: string; collapsed?: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function LocationIcon({ className = "w-5 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.92756 18.3319C-0.975854 14.1405 -0.975854 7.33483 2.92756 3.14353C6.83098 -1.04784 13.1691 -1.04784 17.0724 3.14353C20.9759 7.3349 20.9759 14.1406 17.0724 18.3319L10 26L2.92756 18.3319ZM10 6.21538C12.3241 6.21538 14.2114 8.24195 14.2114 10.7375C14.2114 13.233 12.3241 15.2596 10 15.2596C7.67591 15.2596 5.78857 13.233 5.78857 10.7375C5.78857 8.24195 7.67591 6.21538 10 6.21538Z" fill="currentColor" />
    </svg>
  );
}

export default function DriverAcceptedRequest() {
  // Simulate progress: false = en route to patient, true = en route to hospital
  const [reachedPatient, setReachedPatient] = useState(false);
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);

  const ambulanceLocation = "Ambulance Stand, ABC Road";
  const patientHome = patient.address;
  const hospitalLocation = `${hospital.name}, ${hospital.address}`;

  return (
    <div className="min-h-screen bg-white font-cantata max-w-md mx-auto flex flex-col relative">
      {/* Map Section (same as user dashboard) */}
      <div className="relative h-80 w-full">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
          alt="Map view"
          className="w-full h-full object-cover"
        />
        {/* Toggle for demo: switch between en route to patient and en route to hospital */}
        <button
          onClick={() => setReachedPatient((v) => !v)}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          {reachedPatient ? "En route to Hospital" : "En route to Patient"}
        </button>
      </div>

      {/* Collapsible Gray Info Panel (like user dashboard) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center">
        <div className="w-full bg-gray-100 rounded-3xl overflow-hidden transition-all duration-500">
          {/* Collapse/Expand Button for Info Panels */}
          <button
            onClick={() => setIsInfoCollapsed(v => !v)}
            className="z-20 mb-1 w-10 h-6 flex items-center justify-center bg-gray-300 rounded-t-full shadow mx-auto mt-2"
          >
            <CollapseIcon collapsed={isInfoCollapsed} />
          </button>
          {/* Collapsible Info Content */}
          <div
            className="transition-all duration-500"
            style={{
              maxHeight: isInfoCollapsed ? '0px' : '1000px',
              opacity: isInfoCollapsed ? 0 : 1,
              overflow: 'hidden',
              pointerEvents: isInfoCollapsed ? 'none' : 'auto',
            }}
          >
            {/* Scrollable area for yellow boxes */}
            <div className="overflow-y-auto p-4 pb-0" style={{ maxHeight: '320px' }}>
              {/* 1. Distance/Route Box */}
              <div className="bg-yellow-100 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-4 mb-4 relative">
                  {/* Vertical route icons */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <div className="w-px h-8 border-l-2 border-dashed border-gray-400 my-1"></div>
                    <LocationIcon className="w-5 h-6 text-black" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 h-[70px]">
                    <div className="text-black text-xs font-normal mb-2">
                      {!reachedPatient ? ambulanceLocation : patientHome}
                    </div>
                    <div className="w-full h-px bg-gray-300 mb-2"></div>
                    <div className="text-black text-xs font-normal">
                      {!reachedPatient ? patientHome : hospitalLocation}
                    </div>
                  </div>
                </div>
                {/* Distance and Time pill */}
                <div className="bg-emergency-orange text-center py-2 rounded">
                  <span className="text-black text-xs font-normal">
                    Distance: {!reachedPatient ? "2.3 km" : "5.2 km"} | Est. Time: {!reachedPatient ? "14 mins" : "18 mins"}
                  </span>
                </div>
              </div>
              {/* 2. Patient Details Box */}
              <div className="bg-yellow-200 rounded-xl p-4 mb-4">
                <div className="text-black text-base font-semibold mb-2">Patient Details</div>
                <div className="text-black text-sm"><b>Name:</b> {patient.name}</div>
                <div className="text-black text-sm"><b>Address:</b> {patient.address}</div>
                <div className="text-black text-sm"><b>Condition:</b> {patient.condition}</div>
                <div className="text-black text-sm"><b>Severity:</b> {patient.severity}</div>
              </div>
              {/* 3. Hospital Details Box (scroll to see) */}
              <div className="bg-yellow-300 rounded-xl p-4 mb-4">
                <div className="text-black text-base font-semibold mb-2">Hospital Details</div>
                <div className="text-black text-sm"><b>Name:</b> {hospital.name}</div>
                <div className="text-black text-sm"><b>Address:</b> {hospital.address}</div>
                <div className="text-black text-sm">{hospital.details}</div>
              </div>
            </div>
          </div>
          {/* Payment Panel (Always Visible) */}
          <div className="p-4 pt-2">
            <div className="bg-emergency-yellow flex items-center justify-between px-4 py-3 rounded-xl w-full">
              <span className="text-black text-base font-normal">
                Total Amount: Rs. {payment.amount.toFixed(2)}
              </span>
              <span className={`text-base font-bold px-4 py-2 rounded ${payment.status === "Paid" ? "bg-green-400 text-black" : "bg-red-400 text-black"}`}>
                {payment.status === "Paid" ? "Paid" : "Not Paid"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 