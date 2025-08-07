import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Button from '../buttons/Buttons';
import reactLogo from '../assets/react-logo.png';
import bgVideo from '../assets/page1.mp4';
import gridBg from '../assets/gridBg.jpg';
import bgImage from '../assets/bgImage.jpg';
import { REACT_PHRASES } from '../constants/landingContent';
import { RevealLinks }  from '../components/common/FlipTagLine.jsx';
import AnimatedNumber from '../components/common/AnimatedNumber.jsx';
import EmergencyBookingFlow from '../components/common/EmergencyBookingFlow.jsx';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  Ambulance, 
  Flame, 
  Shield, 
  TrendingUp,
  Phone,
  ArrowRight
} from 'lucide-react';

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
            setTimeout(() => setIsDeleting(true), pause);
          }
        }
      };
      const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
      return () => clearTimeout(typingTimeout);
    }, [displayed, isDeleting, index]);

    return { text: displayed };
  }

  const mainTypewriter = useTypewriter(REACT_PHRASES, 100, 70, 1000);

  // Vital stats state
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError('');
      try {
        const res = await fetch('http://localhost:8080/api/dashboard/stats');
        if (!res.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setStatsError(err.message || 'Error fetching stats');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      className="flex flex-col font-inter relative overflow-hidden min-h-screen"
      style={{
        background: '#4b6cb7',
        background: '-webkit-linear-gradient(to bottom, #4b6cb7, #182848)',
        background: 'linear-gradient(to bottom, #4b6cb7, #182848)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 pointer-events-none"></div>
      
      {/* Global Grid Background Pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        {/* Additional larger grid for depth */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)
          `,
          backgroundSize: '240px 240px'
        }}></div>
        {/* Extra large grid for structure */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 3px, transparent 3px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 3px, transparent 3px)
          `,
          backgroundSize: '480px 480px'
        }}></div>
      </div>
      {/* SEO */}
      <Helmet>
        <title>REACT - Emergency Response Platform</title>
        <meta name="description" content="REACT is an integrated emergency response system for ambulance, fire, and police dispatch." />
        <meta name="theme-color" content="#1E3A8A" />
      </Helmet>

      {/* Video Section */}
      <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden">
        <video
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        {/* Header/Nav */}
        <nav className="absolute top-0 left-0 w-full z-50 py-2 px-4 flex justify-between items-center bg-transparent">
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
        {/* Custom Cursor */}
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
        {/* Hero Section (centered over video) */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pt-32 w-full">
          <h1 className="text-4xl sm:text-6xl text-cyan-300 font-black" style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 20px rgba(34,211,238,0.3), 0 0 40px rgba(34,211,238,0.2)',
            filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.4))',
            letterSpacing: '0.02em'
          }}>
            {mainTypewriter.text}
            <span className="inline-block w-4 text-cyan-400 animate-pulse">|</span>
          </h1>
          <p className="text-cyan-100 mt-6 max-w-xl text-lg font-medium" style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            letterSpacing: '0.01em'
          }}>
            Harnessing cutting-edge technology to provide immediate, reliable, and integrated emergency response services.
          </p>
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => navigate('/login')}
              style={{
                padding: '12px 20px',
                fontSize: '15px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#ffffff',
                border: '2px solid #ef4444',
                boxShadow: '0 8px 25px -3px rgba(239,68,68,0.4), 0 4px 12px -2px rgba(239,68,68,0.2)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Request Emergency Now
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full flex items-center justify-center z-10 py-16">
        <RevealLinks />
      </section>

      {/* Emergency Booking Flow Section */}
      <EmergencyBookingFlow />

      {/* Vital Stats Section */}
      <section className="w-full flex flex-col items-center justify-center z-10 py-16 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.02em',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            Live Emergency Response Data
          </h2>
          <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Updates</span>
          </div>
        </div>
        {loadingStats ? (
          <p className="text-white text-lg font-medium">Loading stats...</p>
        ) : statsError ? (
          <p className="text-red-300 text-lg font-medium">{statsError}</p>
        ) : stats ? (
          <>
            {/* Stats Grid with Hero Stat Integrated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {/* Hero Stat - Average Completion Time (spans 2 columns on large screens) */}
              <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-6 h-6 text-blue-300" />
                    <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Average Response Time</span>
                  </div>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <AnimatedNumber 
                    value={stats.average_completion_time_minutes || 0} 
                    duration={2000}
                    className="text-6xl md:text-7xl"
                  />
                  <span className="text-xl md:text-2xl font-bold text-white/80">minutes</span>
                </div>
                <p className="text-base md:text-lg text-white/80 text-center max-w-md">
                  From emergency call to completion
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <Phone className="w-8 h-8 text-blue-300 mb-3" />
                <AnimatedNumber 
                  value={stats.total_bookings} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Total Emergency Bookings</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <Users className="w-8 h-8 text-blue-300 mb-3" />
                <AnimatedNumber 
                  value={stats.total_users} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Registered Users</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
                <AnimatedNumber 
                  value={stats.completed_bookings} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Completed Emergencies</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <Ambulance className="w-8 h-8 text-red-400 mb-3" />
                <AnimatedNumber 
                  value={stats.total_ambulances} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Ambulances Available</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <Flame className="w-8 h-8 text-orange-400 mb-3" />
                <AnimatedNumber 
                  value={stats.total_fire_trucks} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Fire Trucks Available</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <Shield className="w-8 h-8 text-blue-400 mb-3" />
                <AnimatedNumber 
                  value={stats.total_police_officers} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Police Officers</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                <TrendingUp className="w-8 h-8 text-green-300 mb-3" />
                <AnimatedNumber 
                  value={stats.booking_completion_rate || 0} 
                  duration={1500}
                  className="mb-2"
                />
                <span className="text-lg text-white/90 font-medium">Completion Rate</span>
              </div>
            </div>
          </>
        ) : null}
      </section>

      {/* Problem vs Solution Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
          {/* Additional larger grid for depth */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 2px, transparent 2px)
            `,
            backgroundSize: '200px 200px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(239,68,68,0.2)',
              filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.4))',
            }}>
              The Harsh Reality vs Our Solution
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We've identified the critical pain points in emergency response and built solutions that save lives.
            </p>
          </div>

          {/* Problem vs Solution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-300/20 rounded-2xl p-8 h-full relative overflow-hidden">
                {/* Table-like background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>
                {/* Problem Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-red-500/30 border border-red-300/50 flex items-center justify-center">
                    <span className="text-2xl">❌</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-300">The Harsh Reality</h3>
                </div>

                {/* Problem Points */}
                <div className="space-y-6 relative z-10">
                  {/* Table Header */}
                  <div className="flex items-center gap-4 pb-2 border-b border-red-300/20 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-300/30 flex items-center justify-center">
                      <span className="text-red-300 text-xs font-bold">#</span>
                    </div>
                    <span className="text-red-300/80 text-sm font-semibold uppercase tracking-wider">Pain Point</span>
                    <span className="text-red-300/60 text-xs">Status</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group cursor-pointer"
                    onMouseEnter={() => document.getElementById('solution-1')?.classList.add('highlight')}
                    onMouseLeave={() => document.getElementById('solution-1')?.classList.remove('highlight')}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-300 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-red-200 font-semibold text-lg">Dialing helplines. Waiting on hold. Wasting precious minutes.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-16 h-1 bg-red-300/30 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-red-300"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <span className="text-red-300/60 text-sm">Loading...</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group cursor-pointer"
                    onMouseEnter={() => document.getElementById('solution-2')?.classList.add('highlight')}
                    onMouseLeave={() => document.getElementById('solution-2')?.classList.remove('highlight')}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-300 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-red-200 font-semibold text-lg">No idea where your emergency vehicle is — lost in traffic, maybe?</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 border border-red-300/50 rounded-full relative">
                          <div className="absolute inset-1 bg-red-300/30 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-red-300/60 text-sm">Location unknown</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group cursor-pointer"
                    onMouseEnter={() => document.getElementById('solution-3')?.classList.add('highlight')}
                    onMouseLeave={() => document.getElementById('solution-3')?.classList.remove('highlight')}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-300 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-red-200 font-semibold text-lg">Victims being asked the same questions over and over.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-2 h-2 bg-red-300/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                          ))}
                        </div>
                        <span className="text-red-300/60 text-sm">Repeating info...</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group cursor-pointer"
                    onMouseEnter={() => document.getElementById('solution-4')?.classList.add('highlight')}
                    onMouseLeave={() => document.getElementById('solution-4')?.classList.remove('highlight')}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-300 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-red-200 font-semibold text-lg">Delays that could cost lives.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <motion.div 
                          className="w-6 h-6 border-2 border-red-300/50 rounded-full flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                        </motion.div>
                        <span className="text-red-300/60 text-sm">Time ticking...</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty Table Rows Background */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-8 h-6 border border-red-300/30 rounded-sm"></div>
                    ))}
                  </div>
                </div>
                
                {/* Heartbeat Animation */}
                <div className="mt-8 flex justify-center">
                  <motion.div 
                    className="w-16 h-8 relative"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-full h-full bg-red-300/20 rounded-full border border-red-300/30"></div>
                    <motion.div 
                      className="absolute inset-2 bg-red-300/40 rounded-full"
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-green-500/10 backdrop-blur-sm border border-green-300/20 rounded-2xl p-8 h-full relative overflow-hidden">
                {/* Table-like background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>
                {/* Solution Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-green-500/30 border border-green-300/50 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-300">How We Fix This — Instantly</h3>
                </div>

                {/* Solution Points */}
                <div className="space-y-6 relative z-10">
                  {/* Table Header */}
                  <div className="flex items-center gap-4 pb-2 border-b border-green-300/20 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-300/30 flex items-center justify-center">
                      <span className="text-green-300 text-xs font-bold">#</span>
                    </div>
                    <span className="text-green-300/80 text-sm font-semibold uppercase tracking-wider">Solution</span>
                    <span className="text-green-300/60 text-xs">Status</span>
                  </div>
                  <motion.div
                    id="solution-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/30 border border-green-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-300 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-green-200 font-semibold text-lg">Book an Ambulance/Fire Truck in 3 taps — No Calls, No Hassles.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((i) => (
                            <motion.div 
                              key={i}
                              className="w-3 h-3 bg-green-300 rounded-full"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.5 + (i * 0.1) }}
                              viewport={{ once: true }}
                            />
                          ))}
                        </div>
                        <span className="text-green-300/60 text-sm">3 taps done!</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    id="solution-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/30 border border-green-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-300 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-green-200 font-semibold text-lg">Live track your emergency vehicle in real-time.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 border border-green-300/50 rounded-full relative">
                          <motion.div 
                            className="absolute inset-1 bg-green-300 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                        <span className="text-green-300/60 text-sm">Live tracking active</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    id="solution-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/30 border border-green-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-300 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-green-200 font-semibold text-lg">All your details are auto-shared with emergency teams — No Repeats.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-3 h-3 bg-green-300 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-green-300 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-green-300 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
                          />
                        </div>
                        <span className="text-green-300/60 text-sm">Data synced</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    id="solution-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/30 border border-green-300/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-300 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-green-200 font-semibold text-lg">AI-based fastest dispatch — Because every second counts.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <motion.div 
                          className="w-6 h-6 border-2 border-green-300/50 rounded-full flex items-center justify-center"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
                        </motion.div>
                        <span className="text-green-300/60 text-sm">AI optimizing...</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Empty Table Rows Background */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-8 h-6 border border-green-300/30 rounded-sm"></div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile UI Mockup */}
                <div className="mt-8 flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-20 bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-2xl border border-green-300/30 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                        <div className="w-8 h-1 bg-green-300/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                      </div>
                      <motion.div 
                        className="w-6 h-6 bg-green-300 rounded-full mx-auto"
                        animate={{ x: [-10, 10, -10] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3), 0 0 15px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3)",
                  "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.5)",
                  "0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3), 0 0 15px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(59,130,246,0.6))",
                background: "linear-gradient(45deg, #ffffff, #3b82f6, #ffffff)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Let's not wait for emergencies to escalate.
            </motion.h3>
            <motion.p 
              className="text-xl text-white/80 mb-8 font-semibold"
              animate={{ 
                textShadow: [
                  "0 0 8px rgba(34,197,94,0.6), 0 0 16px rgba(34,197,94,0.4)",
                  "0 0 12px rgba(34,197,94,0.8), 0 0 24px rgba(34,197,94,0.6)",
                  "0 0 8px rgba(34,197,94,0.6), 0 0 16px rgba(34,197,94,0.4)"
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{
                filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))",
                background: "linear-gradient(45deg, #22c55e, #ffffff, #22c55e)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Act Fast. Save Lives. Book Now.
            </motion.p>
            <Button onClick={() => navigate('/login')} className="text-lg px-8 py-4">
              Emergency Booking CTA
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
              filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
            }}>
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Verified emergency responses that demonstrate the power of coordinated emergency services.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🏥🚒</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Riya J., Pune</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/60 text-sm">(5.0 / 5)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                "Our neighbor's gas cylinder caught fire, and in the chaos, an elderly woman suffered burns. We used the platform to book both an ambulance and fire truck in one go. Firefighters reached within 7 minutes and the ambulance was right behind. Both teams were fully coordinated — there was no delay or confusion. This app saved her life."
              </p>
              <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                Verified Booking • Emergency Response ID #AF-10543
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🚔🏥</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Kunal D., Pune</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/60 text-sm">(4.9 / 5)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                "There was a hit-and-run accident outside our office. I booked a police patrol and an ambulance simultaneously through the app. The police arrived first to secure the area, while the ambulance followed in less than 8 minutes. The live updates and coordination between both teams were seamless."
              </p>
              <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                Verified Booking • Emergency Response ID #PA-22178
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🚒🚔</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Anjali P., Pune</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/60 text-sm">(5.0 / 5)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                "During a small electrical fire at our shop, we faced a crowd control issue as well. We booked both fire services and a police unit through the app. Both teams arrived quickly, fully informed about the situation. The coordination between them ensured the fire was controlled and the area was secured without panic."
              </p>
              <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                Verified Booking • Emergency Response ID #FP-33456
              </div>
            </motion.div>

            {/* Testimonial 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🚒🚔🏥</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Prashant V., Pune</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/60 text-sm">(5.0 / 5)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                "We experienced a fire breakout in our apartment parking area, causing injuries and public chaos. Using the app, I booked Fire, Police, and Ambulance in one go. The real-time tracking and synced arrival made the entire emergency response look military-grade. This level of coordination is simply not possible through phone calls."
              </p>
              <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                Verified Booking • Emergency Response ID #FPA-78901
              </div>
            </motion.div>

            {/* Testimonial 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🏥</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sneha L., Pune</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-white/60 text-sm">(4.8 / 5)</span>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                "For my mother's sudden chest pain, I used the app to book an ambulance. The ETA was 5 minutes, and the driver had all the hospital preferences pre-loaded. The simplicity and speed during such moments is invaluable."
              </p>
              <div className="text-xs text-white/50 border-t border-white/10 pt-3">
                Verified Booking • Emergency Response ID #A-56432
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">100% Verified Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Real Emergency Response IDs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Average Rating: 4.9/5</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Safety & Reliability Assurance Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(34,197,94,0.2)',
              filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.4))',
            }}>
              We ensure your safety with...
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive safety measures and real-time monitoring for every emergency response.
            </p>
          </div>

          {/* Safety Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Verified Drivers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-300/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Verified Drivers</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                All emergency vehicle drivers are thoroughly vetted, licensed, and continuously monitored for safety compliance.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Background Verified</span>
              </div>
            </motion.div>

            {/* Live Monitoring */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-500/20 border border-blue-300/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Live Monitoring</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Real-time GPS tracking and live monitoring of all emergency vehicles ensures optimal response times and safety.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">24/7 Tracking</span>
              </div>
            </motion.div>

            {/* Medical Station Coordination */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-500/20 border border-purple-300/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-time Medical Station Coordination</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Seamless coordination with hospitals and medical facilities ensures immediate care upon arrival.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Hospital Ready</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="w-full py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
              filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
            }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Everything you need to know about our emergency response services.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-6">
            {/* FAQ 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    How fast can I get a service?
                  </h3>
                  <motion.div
                    className="w-6 h-6 text-white/60 group-hover:text-blue-300 transition-colors"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 border border-blue-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-300 text-xl">⏱️</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-300 font-semibold text-base mb-3">Within 5 to 10 minutes in most areas.</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Our smart dispatch system locates the nearest available emergency units in real-time and ensures the fastest possible response. No call-center delays. No waiting on hold.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* FAQ 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    Is this available 24x7?
                  </h3>
                  <motion.div
                    className="w-6 h-6 text-white/60 group-hover:text-purple-300 transition-colors"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 border border-purple-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-300 text-xl">🌙</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-purple-300 font-semibold text-base mb-3">Absolutely, 24x7x365.</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Emergencies don't look at the clock — neither do we. Whether it's 2 AM or a busy afternoon, our services are live round-the-clock, always ready to respond.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* FAQ 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors">
                    Can I contact the driver?
                  </h3>
                  <motion.div
                    className="w-6 h-6 text-white/60 group-hover:text-green-300 transition-colors"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 border border-green-300/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-300 text-xl">📞</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-green-300 font-semibold text-base mb-3">Yes, directly from the app.</p>
                        <p className="text-white/80 text-sm leading-relaxed">
                          Once your booking is confirmed, you'll get instant access to contact your assigned driver via call or chat. You'll also see their live location and ETA updates in real-time.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-4 relative overflow-hidden border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={reactLogo}
                  alt="REACT Logo"
                  className="h-12 w-12"
                  style={{ filter: 'drop-shadow(0 0 2px #7d2ae8)' }}
                />
                <h3 className="text-2xl font-bold text-white">REACT</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-md">
                Revolutionizing emergency response through technology. We connect you with the fastest, most reliable emergency services when every second counts.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">24/7 Emergency Response</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Services</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Support</a></li>
              </ul>
            </div>

            {/* Emergency Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Emergency Services</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">🚑</span>
                  <span className="text-white/60 text-sm">Ambulance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-400">🚒</span>
                  <span className="text-white/60 text-sm">Fire Services</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">🚔</span>
                  <span className="text-white/60 text-sm">Police</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 REACT Emergency Response. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Emergency: 112</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
