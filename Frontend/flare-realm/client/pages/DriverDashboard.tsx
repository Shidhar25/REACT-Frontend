import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const patientRequests = [
  {
    name: "Manoj Patel",
    address: "XYZ Road, City",
    condition: "ABC",
    severity: "Mild",
  },
  {
    name: "Riya Sharma",
    address: "XYZ Road, City",
    condition: "ABC",
    severity: "Severe",
  },
  {
    name: "Shama Uzair",
    address: "XYZ Road, City",
    condition: "ABC",
    severity: "Severe",
  },
];

function PhoneIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z" />
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

function UserIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.57916 24.9396C8.27885 25.1606 7.89924 25.2571 7.53092 25.2003C7.15694 25.1494 6.8226 24.9452 6.59598 24.6449C6.37496 24.3446 6.27851 23.965 6.33531 23.591C6.39183 23.2226 6.59036 22.8883 6.89066 22.6616C9.81448 20.4912 13.362 19.3239 17.0002 19.3239C20.638 19.3239 24.1855 20.4912 27.1091 22.6616C27.4097 22.8883 27.6079 23.2226 27.6644 23.591C27.7212 23.965 27.6248 24.3446 27.4038 24.6449C27.1771 24.9452 26.8428 25.1494 26.4688 25.2003C26.1005 25.2571 25.7208 25.1606 25.4206 24.9396C22.984 23.1318 20.0316 22.1572 16.9998 22.1572C13.968 22.1572 11.0157 23.1318 8.57898 24.9396H8.57916Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 17.0004C0 12.4951 1.79091 8.16563 4.981 4.98101C8.16576 1.79092 12.4948 0 17.0003 0C21.5053 0 25.8343 1.79092 29.0189 4.98101C32.2093 8.16577 33.9999 12.4948 33.9999 17.0004C33.9999 21.5053 32.2093 25.8344 29.0189 29.019C25.8342 32.2094 21.5052 34 17.0003 34C12.4951 34 8.16562 32.2094 4.981 29.019C1.79091 25.8342 0 21.5052 0 17.0004ZM2.83355 17.0004C2.83355 13.2434 4.32947 9.63916 6.98139 6.98147C9.63922 4.32954 13.2432 2.83362 17.0003 2.83362C20.7573 2.83362 24.3614 4.32954 27.0191 6.98147C29.6711 9.63931 31.1673 13.2433 31.1673 17.0004C31.1673 20.7574 29.6711 24.3616 27.0191 27.0192C24.3616 29.6712 20.7576 31.1674 17.0003 31.1674C13.2429 31.1674 9.63908 29.6712 6.98139 27.0192C4.32947 24.3617 2.83355 20.7577 2.83355 17.0004Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.4161 12.2119C11.4161 10.7216 12.0055 9.2878 13.0597 8.23387C14.1136 7.17993 15.5474 6.59059 17.0377 6.58498C18.528 6.58498 19.9615 7.17998 21.0157 8.23387C22.0697 9.2878 22.6646 10.7216 22.6646 12.2119C22.6646 13.7022 22.0696 15.1357 21.0157 16.1899C19.9615 17.2439 18.528 17.8388 17.0377 17.8388C15.5474 17.8388 14.1136 17.2438 13.0597 16.1899C12.0054 15.1357 11.4161 13.7022 11.4105 12.2119M14.2497 12.2119C14.2497 11.4696 14.5384 10.7613 15.0657 10.2399C15.587 9.71292 16.2953 9.42385 17.0377 9.41824C17.78 9.41824 18.4883 9.71293 19.0097 10.2399C19.5367 10.7612 19.8258 11.4695 19.8258 12.2119C19.8258 12.9543 19.5367 13.6626 19.0097 14.1839C18.4884 14.7109 17.7801 15.0056 17.0377 15.0056C16.2953 15.0056 15.5871 14.7109 15.0657 14.1839C14.5384 13.6626 14.2497 12.9543 14.244 12.2119" fill="currentColor" />
    </svg>
  );
}

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="min-h-screen bg-white font-cantata max-w-md mx-auto border-4 border-black">
      {/* Header */}
      <div className="w-full h-[56px] bg-gray-200 flex items-center justify-between px-4">
        <div className="text-black text-2xl font-normal">Hi, User!</div>
        <div className="flex items-center gap-2">
          <LocationIcon className="w-5 h-6 text-black" />
          <div className="text-black text-[13px] font-normal leading-tight">
            Location:<br />Pune, India
          </div>
        </div>
        <div className="flex items-center gap-2">
        <UserIcon className="w-8 h-8 text-black" />
          <button
            onClick={handleLogout}
            className="text-black text-sm hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Live Patient Requests */}
      <div className="px-4 py-4">
        <div className="text-black text-xl font-semibold mb-4">Live Patient Requests:</div>
        {patientRequests.map((req, idx) => (
          <div key={req.name} className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-black text-base">
                <div><b>Name:</b> {req.name}</div>
                <div><b>Address:</b> {req.address}</div>
                <div><b>Condition:</b> {req.condition}</div>
                <div><b>Severity:</b> {req.severity}</div>
                <div className="flex gap-32 mt-4">
                  <button className="bg-red-600 text-white px-6 py-2 rounded font-semibold">Reject</button>
                  <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold" onClick={() => navigate('/driver/accepted')}>Accept</button>
                </div>
              </div>
              <div className="flex flex-col items-center ml-4 mt-2">
                <button className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
            {idx < patientRequests.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
} 