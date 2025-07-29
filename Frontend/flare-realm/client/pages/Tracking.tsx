import { useState, useEffect } from "react";
import LiveMap from "./LiveMap";

// SVG Icons
const LocationIcon = ({ className = "w-5 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.92756 18.3319C-0.975854 14.1405 -0.975854 7.33483 2.92756 3.14353C6.83098 -1.04784 13.1691 -1.04784 17.0724 3.14353C20.9759 7.3349 20.9759 14.1406 17.0724 18.3319L10 26L2.92756 18.3319ZM10 6.21538C12.3241 6.21538 14.2114 8.24195 14.2114 10.7375C14.2114 13.233 12.3241 15.2596 10 15.2596C7.67591 15.2596 5.78857 13.233 5.78857 10.7375C5.78857 8.24195 7.67591 6.21538 10 6.21538Z"
      fill="currentColor"
    />
  </svg>
);

const PhoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 35 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.4822 10.6595C18.4822 10.2215 18.8755 9.86866 19.3572 9.86866C21.9542 9.86866 24.0648 11.7735 24.0648 14.1164C24.0648 14.5545 23.6716 14.9073 23.1898 14.9073C22.7077 14.9073 22.3148 14.5545 22.3148 14.1164C22.3148 12.6451 20.9907 11.4504 19.3622 11.4504C18.8754 11.4504 18.4822 11.0931 18.4822 10.6595ZM18.7396 7.92988C18.9035 8.07882 19.1279 8.15087 19.3526 8.15539C22.9931 8.15539 25.9553 10.8298 25.9553 14.1122C25.9553 14.5503 26.3485 14.9031 26.8303 14.9031C27.3124 14.9031 27.7053 14.5503 27.7053 14.1122C27.7053 9.95808 23.957 6.57775 19.3526 6.57775C18.8704 6.57775 18.4776 6.93055 18.4776 7.36864C18.4822 7.5809 18.5757 7.78094 18.7396 7.92988ZM19.3668 4.86839C25.0102 4.86839 29.6005 9.01409 29.6005 14.1117C29.6005 14.5498 29.9937 14.9026 30.4755 14.9026C30.9576 14.9026 31.3505 14.5498 31.3505 14.1117C31.3505 8.14616 25.9738 3.29034 19.3665 3.2862C18.8844 3.2862 18.4915 3.639 18.4915 4.07709C18.4915 4.51486 18.8847 4.86839 19.3668 4.86839ZM19.3572 0C18.8751 0 18.4822 0.352796 18.4822 0.790887C18.4822 1.22898 18.8755 1.58177 19.3572 1.58177C27.0173 1.58177 33.2499 7.20264 33.2499 14.116C33.2499 14.5541 33.6432 14.9069 34.125 14.9069C34.6071 14.9069 35 14.5541 35 14.116C35.005 6.33057 27.9862 0 19.3572 0ZM32.4599 24.1422L25.3989 21.5276C24.8514 21.2598 24.2149 21.3447 23.7751 21.7486L22.7738 22.6671C22.2544 23.1391 21.2624 23.6153 19.5123 23.1943C15.7079 22.28 10.4951 17.7007 9.54996 14.448C9.10551 12.9131 9.66694 12.0117 10.2191 11.5271L11.2534 10.5747C11.6932 10.175 11.7775 9.59675 11.4781 9.11631L8.55366 2.9595C8.42744 2.58538 8.1558 2.32595 7.74868 2.17702C7.34157 2.03681 6.92984 2.06653 6.56931 2.25779L2.40468 4.40917C0.392631 5.22978 -0.328081 6.52242 0.135131 8.47406C1.60923 14.3927 4.67413 19.3542 9.50768 23.6409C14.8563 28.3775 20.3266 30.9456 27.257 31.9745C27.4159 31.9916 27.566 32 27.7157 32C29.0167 32 30.0367 31.3112 30.8229 29.9123L33.2609 25.9113C33.4714 25.5711 33.4903 25.2012 33.3264 24.8568C33.1667 24.4914 32.8716 24.2485 32.4599 24.1422Z"
      fill="currentColor"
    />
  </svg>
);

const CollapseIcon = ({ className = "w-8 h-7" }: { className?: string }) => (
  <div className="relative">
    <svg
      className="w-8 h-7"
      viewBox="0 0 30 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="15" cy="14" rx="15" ry="14" fill="#A09393" />
    </svg>
    <svg
      className="absolute top-1.5 left-2 w-3 h-5 rotate-90"
      viewBox="0 0 19 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 9.8181L2.11094 12L9.49964 4.36321L16.8891 12L19 9.8181L9.49993 0L0 9.8181Z"
        fill="black"
      />
    </svg>
  </div>
);

const CallDriverIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.06773 9.82539C2.06773 5.60689 5.21815 2.2429 9.10665 2.2429C9.69728 2.2429 10.1404 1.76236 10.1404 1.12145C10.1402 0.480723 9.69727 0 9.10665 0C4.08575 0 0 4.43212 0 9.82559C0 10.4663 0.442965 10.947 1.03377 10.947C1.62459 10.947 2.06754 10.4663 2.06754 9.82559L2.06773 9.82539Z"
      fill="black"
    />
    <path
      d="M9.10661 5.07257C6.6454 5.07257 4.67639 7.20853 4.67639 9.87853C4.67639 10.5193 5.11936 11 5.71016 11C6.3008 11 6.74393 10.5194 6.74393 9.87853C6.74393 8.49019 7.82681 7.31527 9.10679 7.31527C9.69743 7.31527 10.1406 6.83473 10.1406 6.19382C10.1402 5.55309 9.69724 5.07257 9.10661 5.07257Z"
      fill="black"
    />
  </svg>
);

export default function Tracking() {
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);
  const [userCoords, setUserCoords] = useState({ latitude: 18.5204, longitude: 73.8567 }); // default Pune
  const [userAddress, setUserAddress] = useState("");
  const [ambulances, setAmbulances] = useState([]);
  const [policeMap, setPoliceMap] = useState({});
  const [fireTrucks, setFireTrucks] = useState([]);
  const [policeStatus, setPoliceStatus] = useState("");
  const [fireTruckStatus, setFireTruckStatus] = useState("");
  const [ambulanceStatus, setAmbulanceStatus] = useState("");
  const [notes, setNotes] = useState("");

  // Hardcoded hospital location
  const hospitalCoords = { latitude: 18.5310, longitude: 73.8446 };

  // Helper to calculate distance between two lat/lng points (Haversine formula)
  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const lastBooking = JSON.parse(localStorage.getItem('lastBooking') || '{}');
    if (lastBooking.userLocation) setUserCoords(lastBooking.userLocation);
    if (lastBooking.userAddress) setUserAddress(lastBooking.userAddress);
    if (lastBooking.bookingResponse) {
      setAmbulances(lastBooking.bookingResponse.assignedAmbulances || []);
      setPoliceMap(lastBooking.bookingResponse.assignedPoliceMap || {});
      setFireTrucks(lastBooking.bookingResponse.assignedFireTrucks || []);
      setPoliceStatus(lastBooking.bookingResponse.policeStatus || "");
      setFireTruckStatus(lastBooking.bookingResponse.fireTruckStatus || "");
      setAmbulanceStatus(lastBooking.bookingResponse.ambulanceStatus || "");
      setNotes(lastBooking.bookingResponse.notes || "");
    } else if (lastBooking.ambulances) {
      setAmbulances(lastBooking.ambulances);
    }
  }, []);

  

  return (
    <div className="w-full h-screen bg-white font-cantata">
      
      {/* Map Fullscreen */}
      <div className="fixed inset-0 z-0">
        <LiveMap
          patientCoords={userCoords}
          ambulanceCoords={ambulances.length > 0 && ambulances[0].latitude && ambulances[0].longitude ? { latitude: ambulances[0].latitude, longitude: ambulances[0].longitude } : undefined}
          fireTruckCoords={fireTrucks.length > 0 && fireTrucks[0].latitude && fireTrucks[0].longitude ? { latitude: fireTrucks[0].latitude, longitude: fireTrucks[0].longitude } : undefined}
        />
        {/* Ambulance icons on map */}
        <div className="absolute top-4 right-4 sm:top-12 sm:right-16 z-10">
          <svg width="19" height="13" viewBox="0 0 19 13" fill="none">
            <path
              d="M18.1195 7.55766L17.1258 7.02365C16.4864 6.67922 15.9753 6.20314 15.6495 5.64617C14.2125 3.19121 11.3942 1.66701 8.29366 1.66701C3.72004 1.66701 0 4.98561 0 9.06552C0.00149652 9.95599 0.812777 10.6797 1.8111 10.6797H2.15336C2.36751 11.7492 3.41553 12.563 4.67459 12.563C5.93377 12.563 6.98182 11.7492 7.19583 10.6797H10.5978C10.8119 11.7492 11.8599 12.563 13.119 12.563C14.3782 12.563 15.4262 11.7492 15.6402 10.6797H17.1799C18.1842 10.6797 19 9.95062 19 9.05602V8.94842C19.0002 8.38212 18.6624 7.84944 18.1194 7.55747L18.1195 7.55766Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="absolute top-16 left-4 sm:top-24 sm:left-16 z-10">
          <svg width="19" height="13" viewBox="0 0 19 13" fill="none">
            <path
              d="M18.1195 7.55767L17.1258 7.02367C16.4864 6.67924 15.9753 6.20316 15.6495 5.64618C14.2125 3.19122 11.3942 1.66702 8.29366 1.66702C3.72004 1.66702 0 4.98562 0 9.06554C0.00149652 9.956 0.812777 10.6797 1.8111 10.6797H2.15336C2.36751 11.7492 3.41553 12.563 4.67459 12.563C5.93377 12.563 6.98182 11.7492 7.19583 10.6797H10.5978C10.8119 11.7492 11.8599 12.563 13.119 12.563C14.3782 12.563 15.4262 11.7492 15.6402 10.6797H17.1799C18.1842 10.6797 19 9.95064 19 9.05604V8.94844C19.0002 8.38213 18.6624 7.84946 18.1194 7.55749L18.1195 7.55767Z"
              fill="black"
            />
          </svg>
        </div>
      </div>

      {/* Info Gray Panel Overlay */}
      <div className="relative z-10 flex flex-col justify-end w-full h-full pointer-events-none">
        <div className={`w-full bg-gray-100 rounded-t-3xl overflow-y-auto max-h-[65vh] sm:max-h-[420px] transition-all duration-500 relative shadow-lg mx-auto px-1 sm:px-4 pb-2 pt-1 pointer-events-auto ${isInfoCollapsed ? 'h-8 min-h-0 max-h-8 bg-gray-200' : ''}`}
          style={isInfoCollapsed ? { minHeight: '0px', maxHeight: '32px', padding: 0 } : { minHeight: '260px' }}>
          {/* Collapse/Expand Button for Info Panels */}
          <button
            onClick={() => setIsInfoCollapsed(v => !v)}
            className={`z-20 mb-1 w-10 h-6 flex items-center justify-center bg-gray-300 rounded-t-full shadow mx-auto mt-2 sticky top-0 left-0 right-0 ${isInfoCollapsed ? 'bg-gray-200' : 'bg-gray-100'}`}
            style={isInfoCollapsed ? { marginBottom: 0, marginTop: 0 } : {}}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isInfoCollapsed ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
            <div className="p-2 sm:p-4 pb-0">
              {/* 1. Location & Hospital */}
              <div className="bg-yellow-100 rounded-xl p-3 sm:p-4 mb-3">
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 mb-4 relative">
                  {/* User Location */}
                  <div className="flex flex-col items-center mb-2 sm:mb-0">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    {/* Dashed line */}
                    <div className="w-px h-8 border-l-2 border-dashed border-gray-400 my-1"></div>
                    {/* Hospital Location Icon */}
                    <LocationIcon className="w-5 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="text-black text-xs font-normal mb-1">
                      Your location:
                    </div>
                    <div className="text-black text-xs font-normal mb-2 break-words">
                      {userAddress || "-"}
                    </div>
                    {/* Gray line below address */}
                    <div className="w-full h-px bg-gray-300 mb-2"></div>
                    <div className="text-black text-xs font-normal mb-1">
                      Ambulance details:
                    </div>
                    <div className="text-black text-xs font-normal mb-2 flex items-center gap-2">
                      {ambulances.length > 0 ? (
                        <>
                          <b>Driver:</b> {ambulances[0].driverName || "-"}<br />
                          <b>Reg:</b> {ambulances[0].regNumber || "-"}
                          {ambulances[0].driverPhone && (
                            <a
                              href={`tel:${ambulances[0].driverPhone}`}
                              className="ml-2 inline-flex items-center px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                              title="Call Ambulance Driver"
                            >
                              <PhoneIcon className="w-4 h-4 mr-1" />
                              Call
                            </a>
                          )}
                        </>
                      ) : "No ambulance assigned."}
                    </div>
                    {/* Gray line below ambulance distance */}
                    <div className="w-full h-px bg-gray-300"></div>
                  </div>
                </div>
                {/* Distance and Time */}
                <div className="bg-orange-200 text-center py-2 rounded">
                  {(() => {
                    let distance = null, estTime = null;
                    if (ambulances.length > 0 && ambulances[0].latitude && ambulances[0].longitude) {
                      distance = getDistanceKm(
                        ambulances[0].latitude,
                        ambulances[0].longitude,
                        userCoords.latitude,
                        userCoords.longitude
                      );
                      estTime = Math.round(distance * 10);
                    }
                    return (
                      <span className="text-black text-xs font-normal">
                        Total Distance: {distance !== null ? distance.toFixed(2) : "-"} kms | Est. Time: {estTime !== null ? estTime : "-"} mins
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* 3. Police Details */}
              <div className="bg-yellow-200 rounded-xl p-3 sm:p-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-black text-sm font-normal mb-3">
                    Police details:
                  </h3>
                  {Object.keys(policeMap).length === 0 ? (
                    <div className="text-black text-xs font-normal mb-4">No police assigned.</div>
                  ) : (Object.entries(policeMap) as [string, number][]).map(([station, count]) => (
                    <div key={station} className="text-black text-xs font-normal mb-2">
                      <b>Station:</b> {station} <b>Officers:</b> {count}
                    </div>
                  ))}
                </div>
                {Object.keys(policeMap).length > 0 && (
                  <div className="bg-orange-400 text-center py-2 rounded mt-2">
                    <span className="text-black text-xs font-normal">
                      Police Status: {policeStatus || "-"}
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Fire Brigade Details */}
              <div className="bg-yellow-200 rounded-xl p-3 sm:p-4 mb-3">
                <div className="flex-1">
                  <h3 className="text-black text-sm font-normal mb-3">
                    Fire Brigade details:
                  </h3>
                  {fireTrucks.length === 0 ? (
                    <div className="text-black text-xs font-normal mb-4">No fire truck assigned.</div>
                  ) : fireTrucks.map((truck, idx) => (
                    <div key={truck.id || idx} className="text-black text-xs font-normal mb-2 flex items-center gap-2">
                      <b>Truck id:</b> {truck.regNumber || truck.id}<br />
                      <b>Status:</b> {truck.status}<br />
                      {truck.driverPhoneNumber && (
                        <a
                          href={`tel:${truck.driverPhoneNumber}`}
                          className="ml-2 inline-flex items-center px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                          title="Call Fire Truck Driver"
                        >
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          Call
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                {fireTrucks.length > 0 && fireTrucks[0].latitude && fireTrucks[0].longitude && (
                  <div className="bg-orange-400 text-center py-2 rounded mt-2">
                    {(() => {
                      let distance = getDistanceKm(
                        fireTrucks[0].latitude,
                        fireTrucks[0].longitude,
                        userCoords.latitude,
                        userCoords.longitude
                      );
                      let estTime = Math.round(distance * 10);
                      return (
                        <span className="text-black text-xs font-normal">
                          Total Distance: {distance.toFixed(2)} kms | Est. Time: {estTime} mins
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Thin gray ribbon when collapsed */}
          {isInfoCollapsed && (
            <div className="absolute left-0 right-0 bottom-0 h-2 bg-gray-300 rounded-b-3xl mx-2" style={{ zIndex: 1 }} />
          )}
        </div>
      </div>
    </div>
  );
}
