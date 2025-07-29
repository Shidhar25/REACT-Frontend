import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [vehicleType, setVehicleType] = useState('ambulance');

  const handleNavigation = () => {
    if (requestId.trim()) {
      navigate(`/navigation/${vehicleType}/${requestId}`);
    } else {
      alert('Please enter a valid request ID');
    }
  };

  const services = [
    {
      icon: '🚑',
      title: 'Ambulance Booking',
      description: 'Quick and reliable ambulance dispatch for medical emergencies with real-time tracking.'
    },
    {
      icon: '🚒',
      title: 'Fire Emergency Response',
      description: 'Rapid fire truck deployment with specialized equipment for fire and rescue operations.'
    },
    {
      icon: '👮',
      title: 'Police Support',
      description: 'Immediate police response for security and law enforcement emergencies.'
    },
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description: 'Live GPS tracking of emergency vehicles with estimated arrival times.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Request Help',
      description: 'Call emergency services or use our digital platform to request immediate assistance.'
    },
    {
      step: '2',
      title: 'We Dispatch',
      description: 'Our system automatically dispatches the nearest available emergency vehicle.'
    },
    {
      step: '3',
      title: 'Help Arrives',
      description: 'Emergency responders arrive at your location with professional medical care.'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Average response time under 5 minutes in urban areas'
    },
    {
      icon: '🛡️',
      title: 'Reliable Service',
      description: '24/7 availability with professional emergency responders'
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      description: 'Simple interface for quick emergency requests and tracking'
    },
    {
      icon: '🏥',
      title: 'Professional Care',
      description: 'Certified medical professionals and emergency personnel'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Emergency Response Coordinator',
      text: 'This system has revolutionized our emergency response capabilities. The real-time tracking feature is invaluable.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Emergency Medicine',
      text: 'The quick response times and professional service have significantly improved patient outcomes in critical situations.',
      rating: 5
    },
    {
      name: 'Officer David Rodriguez',
      role: 'Police Department',
      text: 'Seamless integration between different emergency services has made our job more efficient and effective.',
      rating: 5
    }
  ];

  // Add a React logo SVG as a component at the top
  const ReactLogo = () => (
    <svg width="64" height="64" viewBox="0 0 841.9 595.3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="420.9" cy="296.5" r="45.7" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="30" fill="none">
          <ellipse rx="218.7" ry="545.9" transform="rotate(60 420.9 296.5)"/>
          <ellipse rx="218.7" ry="545.9" transform="rotate(120 420.9 296.5)"/>
          <ellipse rx="218.7" ry="545.9" transform="rotate(180 420.9 296.5)"/>
        </g>
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-red-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Fast. Reliable. Life-saving
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-8">
              Emergency Services at Your Fingertips
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              When every second counts, our integrated emergency response system connects you with the fastest, most reliable emergency services available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Emergency Icons Animation */}
        <div className="absolute top-10 left-10 animate-bounce">
          <div className="text-4xl">🚑</div>
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <div className="text-4xl">🚒</div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-ping">
          <div className="text-3xl">👮</div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Our Emergency Services
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our mission is to provide immediate, reliable, and professional emergency response services to communities. 
              We integrate ambulance, fire, and police services into one seamless platform, ensuring the fastest possible 
              response times when lives are at stake. With real-time tracking, professional emergency personnel, and 
              24/7 availability, we're committed to saving lives and protecting communities.
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Emergency Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive emergency response solutions designed for speed, reliability, and professional care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and reliable emergency response in just three steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose Our Emergency Services
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We combine cutting-edge technology with professional emergency response to deliver unmatched service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition duration-300"
              >
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Emergency Professionals Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by emergency responders and healthcare professionals nationwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tracking Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Track Emergency Response
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor real-time location and estimated arrival time of emergency vehicles.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Request ID
                </label>
                <input
                  type="text"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="Enter request ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ambulance">Ambulance</option>
                  <option value="fire_truck">Fire Truck</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleNavigation}
              className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-red-700 transition duration-300 shadow-lg"
            >
              Track Emergency Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-red-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of communities that trust our emergency response system for their safety and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Access Emergency Services
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Emergency Services</h3>
              <p className="text-gray-400">
                Professional emergency response services available 24/7 for your safety and peace of mind.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ambulance Services</li>
                <li>Fire Emergency</li>
                <li>Police Support</li>
                <li>Real-time Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: 911</li>
                <li>Support: (555) 123-4567</li>
                <li>Email: support@emergency.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/login')} className="hover:text-white">Login</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-white">Register</button></li>
                <li><button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">Services</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Emergency Services. All rights reserved. Saving lives, protecting communities.</p>
          </div>
        </div>
      </footer>

      {/* Add React logo and text at the top */}
      <div className="flex flex-col items-center justify-center mt-8 mb-8">
        <ReactLogo />
        <span className="text-4xl font-bold text-blue-600 mt-2">REACT</span>
        <span className="text-lg text-gray-700 mt-1 tracking-wide">(Rapid Emergency Action & Coordination Tool)</span>
      </div>
    </div>
  );
} 