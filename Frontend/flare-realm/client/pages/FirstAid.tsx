import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeartbeat, FaFire, FaCar, FaHome, FaExclamationTriangle } from 'react-icons/fa';

const firstAidCategories = [
  {
    title: "Medical Emergencies",
    icon: <FaHeartbeat className="w-8 h-8" />,
    color: "bg-red-500",
    tips: [
      {
        title: "Heart Attack",
        steps: [
          "Call emergency services immediately (911)",
          "Have the person sit down and rest",
          "Loosen tight clothing",
          "If prescribed, help them take nitroglycerin",
          "Monitor breathing and consciousness"
        ]
      },
      {
        title: "Choking",
        steps: [
          "Ask 'Are you choking?' - if they can speak, encourage coughing",
          "If they cannot speak, perform the Heimlich maneuver",
          "Stand behind the person, wrap arms around their waist",
          "Make a fist and place it above the navel",
          "Give quick, upward thrusts until object is expelled"
        ]
      },
      {
        title: "Severe Bleeding",
        steps: [
          "Apply direct pressure with clean cloth or bandage",
          "Elevate the injured area above the heart if possible",
          "Keep pressure for at least 10-15 minutes",
          "Do not remove soaked bandages - add more on top",
          "Call emergency services for severe bleeding"
        ]
      }
    ]
  },
  {
    title: "Fire Emergencies",
    icon: <FaFire className="w-8 h-8" />,
    color: "bg-orange-500",
    tips: [
      {
        title: "House Fire",
        steps: [
          "Get out immediately - don't try to save belongings",
          "Stay low to avoid smoke inhalation",
          "Feel doors before opening - if hot, find another exit",
          "Call 911 from outside the building",
          "Never use elevators during a fire"
        ]
      },
      {
        title: "Burns",
        steps: [
          "Cool the burn with cool (not cold) water for 10-20 minutes",
          "Remove jewelry or tight items before swelling",
          "Cover with sterile gauze or clean cloth",
          "Do not apply ice, butter, or ointments",
          "Seek medical attention for severe burns"
        ]
      }
    ]
  },
  {
    title: "Traffic Accidents",
    icon: <FaCar className="w-8 h-8" />,
    color: "bg-blue-500",
    tips: [
      {
        title: "Vehicle Accident",
        steps: [
          "Ensure your safety first - move to a safe location",
          "Call emergency services immediately",
          "Check for injuries but don't move seriously injured people",
          "Turn off vehicle engines if safe to do so",
          "Exchange information with other drivers"
        ]
      },
      {
        title: "Pedestrian Hit",
        steps: [
          "Call emergency services immediately",
          "Do not move the injured person unless in immediate danger",
          "Control any bleeding with direct pressure",
          "Keep the person warm and comfortable",
          "Stay with them until help arrives"
        ]
      }
    ]
  },
  {
    title: "Home Emergencies",
    icon: <FaHome className="w-8 h-8" />,
    color: "bg-green-500",
    tips: [
      {
        title: "Poisoning",
        steps: [
          "Call poison control center immediately",
          "Do not induce vomiting unless directed by professionals",
          "Save the container or substance for identification",
          "Monitor breathing and consciousness",
          "Follow medical professional instructions"
        ]
      },
      {
        title: "Electric Shock",
        steps: [
          "Do not touch the person if they're still in contact with electricity",
          "Turn off the power source if possible",
          "Use a non-conductive object to move them away",
          "Call emergency services immediately",
          "Check for breathing and pulse"
        ]
      }
    ]
  }
];

const emergencyNumbers = [
  { name: "Emergency Services", number: "911", description: "For all life-threatening emergencies" },
  { name: "Poison Control", number: "1-800-222-1222", description: "For poisoning emergencies" },
  { name: "Local Hospital", number: "(555) 123-4567", description: "Your nearest emergency room" },
  { name: "Fire Department", number: "(555) 987-6543", description: "For fire emergencies" }
];

export default function FirstAid() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/index')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">First Aid Guide</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Numbers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contact Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyNumbers.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
                <a 
                  href={`tel:${contact.number}`}
                  className="text-blue-600 font-mono text-lg hover:text-blue-800 transition-colors"
                >
                  {contact.number}
                </a>
                <p className="text-sm text-gray-600 mt-2">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* First Aid Categories */}
        <div className="space-y-8">
          {firstAidCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className={`${category.color} text-white p-6`}>
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {category.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{tip.title}</h3>
                      <ol className="space-y-3">
                        {tip.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• Always call emergency services (911) for life-threatening situations</li>
            <li>• These tips are for immediate first aid only and do not replace professional medical care</li>
            <li>• Stay calm and assess the situation before taking action</li>
            <li>• Your safety comes first - don't put yourself in danger to help others</li>
            <li>• Keep a first aid kit readily available in your home and vehicle</li>
          </ul>
        </div>
      </main>
    </div>
  );
} 