import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Buttons';
import reactLogo from '../assets/react-logo.png'; // Ensure this path is correct for your logo
import { motion, useMotionValue, useSpring } from 'framer-motion';
import bgVideo from '../assets/page1.mp4'; // Ensure this path is correct for your video file

export default function Landing() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState('');
  const [vehicleType, setVehicleType] = useState('ambulance');

  // --- Custom iOS-style pointer logic ---
  // Adjusted for better performance and smaller size
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const [pointerVariant, setPointerVariant] = useState('default'); // 'default' | 'button'

  // Responsive pointer size (made smaller)
  const pointerSize = pointerVariant === 'button' ? 40 : 28;
  const pointerBorderRadius = pointerVariant === 'button' ? '1rem' : '50%';
  const pointerBg = pointerVariant === 'button' ? 'bg-blue-500/70' : 'bg-white/70';

  // Smooth spring animation (adjusted for less lag)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const pointerXSpring = useSpring(pointerX, springConfig);
  const pointerYSpring = useSpring(pointerY, springConfig);

  useEffect(() => {
    const move = (e) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [pointerX, pointerY]);

  // --- End custom pointer logic ---

  // Button hover handlers for pointer morph
  const handlePointerEnter = () => setPointerVariant('button');
  const handlePointerLeave = () => setPointerVariant('default');

  const handleNavigation = () => {
    if (requestId.trim()) {
      navigate(`/navigation/${vehicleType}/${requestId}`);
    } else {
      console.log('Please enter a valid request ID');
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

  const reactPhrases = [
    "REACT",
    "Rapid Emergency Action & Coordination Tool"
  ];
 

  function useTypewriter(phrases, typingSpeed = 70, deletingSpeed = 40, pause = 1000) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[index];
            if (isDeleting) {
                if (displayed.length > 0) {
                    setDisplayed(currentPhrase.substring(0, displayed.length - 1));
                } else {
                    setIsDeleting(false);
                    setIndex((prev) => (prev + 1) % phrases.length);
                }
            } else {
                if (displayed.length < currentPhrase.length) {
                    setDisplayed(currentPhrase.substring(0, displayed.length + 1));
                } else {
                    timeoutRef.current = setTimeout(() => setIsDeleting(true), pause);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        
        return () => clearTimeout(typingTimeout);
    }, [displayed, isDeleting, index, phrases, typingSpeed, deletingSpeed, pause]);


    return { text: displayed };
  }

  const mainTypewriter = useTypewriter(reactPhrases, 100, 70, 1000);


  

  return (
    <div className="flex flex-col font-inter relative overflow-hidden min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@100..900&display=swap');
          .smooch-sans{
            font-family: "Smooch Sans", sans-serif;
            font-optical-sizing: auto;
            font-weight: 600;
            font-style: normal;
          }
        `}
      </style>

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Custom Pointer */}
      <motion.div
        className={`fixed z-[9999] pointer-events-none ${pointerBg} shadow-lg`}
        style={{
          left: 0,
          top: 0,
          width: pointerSize,
          height: pointerSize,
          borderRadius: pointerBorderRadius,
          x: pointerXSpring,
          y: pointerYSpring,
          translateX: '-50%',
          translateY: '-50%',
          transition: 'border-radius 0.2s, background 0.2s',
        }}
        animate={{ scale: pointerVariant === 'button' ? 1.5 : 1 }}
      />

      {/* Fixed Navbar */}
     <nav className="fixed w-full z-100  py-2 px-2 sm:px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
      <div className="flex items-center mb-2 sm:mb-0">
        <img
          src={reactLogo}
          alt="REACT Logo"
          className="h-20 w-20  object-contain"
          style={{ filter: 'drop-shadow(0 0 2px #7d2ae8)' }}
        />
        
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button onClick={() => navigate('/login')}>Emergency Request</Button>
      </div>
    </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-2 sm:px-4 md:px-8 pt-24">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="w-full flex flex-col items-center justify-center py-10 sm:py-16 select-none">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-2 text-white smooch-sans">
              {mainTypewriter.text}
              <span className="inline-block w-4 text-blue-400 animate-pulse">|</span>
            </h1>
          </div>
          <motion.p
            className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harnessing cutting-edge technology to provide immediate, reliable, and integrated emergency response services.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button onClick={() => navigate('/login')}>Request Emergency Now</Button>
            <Button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>Learn More</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 sm:py-20 z-10 px-2 sm:px-4 md:px-8 bg-gray-100/90 backdrop-blur-sm text-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            About Our Integrated Emergency System
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our mission is to provide immediate, reliable, and professional emergency response services. We integrate ambulance, fire, and police services into one seamless platform, ensuring the fastest possible response times when lives are at stake.
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-10 sm:py-20 z-10 px-2 sm:px-4 md:px-8 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Core Services
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive emergency solutions engineered for speed, reliability, and professional care.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md transition-all duration-300 border border-gray-200 hover:shadow-lg hover:border-blue-500"
                onMouseEnter={handlePointerEnter}
                onMouseLeave={handlePointerLeave}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 text-blue-500">{service.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-20 z-10 px-2 sm:px-4 md:px-8 bg-gray-100/90 backdrop-blur-sm text-gray-800">
        <div className="max-w-7xl mx-auto text-center">
            <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                Our Process
            </motion.h2>
            <motion.p
                className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Simple, fast, and reliable emergency response in just three steps.
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
                {howItWorks.map((step, index) => (
                    <motion.div
                        key={index}
                        className="text-center rounded-xl p-6 sm:p-8 shadow-md border border-gray-200 bg-white"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6 shadow-md">
                            {step.step}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 z-10 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">REACT</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Professional emergency response services available 24/7 for your safety and peace of mind.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-2 sm:mb-4">Services</h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                        <li>Ambulance Services</li>
                        <li>Fire Emergency</li>
                        <li>Police Support</li>
                        <li>Real-time Tracking</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-2 sm:mb-4">Contact</h4>
                    <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                        <li>Emergency: 911</li>
                        <li>Support: (555) 123-4567</li>
                        <li>Email: support@react.com</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-white mb-2 sm:mb-4">Quick Links</h4>
                    <ul className="space-y-1 sm:space-y-2">
                        <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-blue-400 text-sm sm:text-base">Login</button></li>
                        <li><button onClick={() => navigate('/register')} className="text-gray-400 hover:text-blue-400 text-sm sm:text-base">Register</button></li>
                        <li><button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-blue-400 text-sm sm:text-base">Services</button></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-500 text-xs sm:text-sm">
                <p>&copy; 2024 REACT. All rights reserved. Engineering safety, protecting futures.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}