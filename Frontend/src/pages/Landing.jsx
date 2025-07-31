import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Button from '../buttons/Buttons';
import reactLogo from '../assets/react-logo.png';
import bgVideo from '../assets/page1.mp4';
import { SERVICES, HOW_IT_WORKS, REACT_PHRASES } from '../constants/landingContent';

export default function Landing() {
  const navigate = useNavigate();

  // Pointer logic with mobile check
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const [pointerVariant, setPointerVariant] = useState('default');
  const [enablePointer, setEnablePointer] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setEnablePointer(false);
      return;
    }
    const move = (e) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const pointerSize = pointerVariant === 'button' ? 40 : 28;
  const pointerBorderRadius = pointerVariant === 'button' ? '1rem' : '50%';
  const pointerBg = pointerVariant === 'button' ? 'bg-blue-500/70' : 'bg-white/70';
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const pointerXSpring = useSpring(pointerX, springConfig);
  const pointerYSpring = useSpring(pointerY, springConfig);

  const handlePointerEnter = () => setPointerVariant('button');
  const handlePointerLeave = () => setPointerVariant('default');

  // Typewriter logic
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
    }, [displayed, isDeleting, index]);

    return { text: displayed };
  }

  const mainTypewriter = useTypewriter(REACT_PHRASES, 100, 70, 1000);

  return (
    <div className="flex flex-col font-inter relative overflow-hidden min-h-screen">

      {/* SEO + Accessibility */}
      <Helmet>
        <title>REACT - Emergency Response Platform</title>
        <meta name="description" content="REACT is an integrated emergency response system for ambulance, fire, and police dispatch." />
        <meta name="theme-color" content="#1E3A8A" />
      </Helmet>

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          role="presentation"
          className="w-full h-auto object-cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Custom Cursor (Desktop Only) */}
      {enablePointer && (
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
      )}

      {/* Header/Nav */}
      <nav className="fixed w-full z-50 py-2 px-4 flex justify-between items-center bg-transparent">
        <img
          src={reactLogo}
          alt="REACT Logo"
          className="h-16 w-16"
          style={{ filter: 'drop-shadow(0 0 2px #7d2ae8)' }}
        />
        <div className="flex space-x-4">
          <Button onClick={() => navigate('/login')} aria-label="Login">Login</Button>
          <Button onClick={() => navigate('/register')} aria-label="Register for emergency services">Register</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-32 min-h-[70vh] z-10">
        <h1 className="text-4xl sm:text-6xl text-white font-extrabold smooch-sans">
          {mainTypewriter.text}
          <span className="inline-block w-4 text-blue-400 animate-pulse">|</span>
        </h1>
        <p className="text-gray-200 mt-6 max-w-xl text-lg">
          Harnessing cutting-edge technology to provide immediate, reliable, and integrated emergency response services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button onClick={() => navigate('/login')}>Request Emergency Now</Button>
          <Button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>Learn More</Button>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white text-gray-800 z-10 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Core Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-lg shadow-md border hover:shadow-lg hover:border-blue-500 transition"
              onMouseEnter={handlePointerEnter}
              onMouseLeave={handlePointerLeave}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-20 text-gray-800 px-4 z-10">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow border text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-white bg-indigo-600 w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-4">
                {step.step}
              </div>
              <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 z-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-2">REACT</h4>
            <p className="text-sm">Emergency response system integrating ambulance, police, and fire support.</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-2">Services</h5>
            <ul className="space-y-1 text-sm">
              <li>Ambulance</li>
              <li>Fire</li>
              <li>Police</li>
              <li>Tracking</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-2">Contact</h5>
            <ul className="space-y-1 text-sm">
              <li>Emergency: 911</li>
              <li>Email: support@react.com</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-2">Quick Links</h5>
            <ul className="space-y-1 text-sm">
              <li><button onClick={() => navigate('/login')} className="hover:text-blue-400">Login</button></li>
              <li><button onClick={() => navigate('/register')} className="hover:text-blue-400">Register</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400">Services</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-6 text-gray-600">
          &copy; 2024 REACT. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
