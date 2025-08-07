import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Truck, 
  MessageCircle, 
  CheckCircle, 
  Star,
  ArrowRight,
  Clock,
  Users,
  Shield
} from 'lucide-react';

const EmergencyBookingFlow = () => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [activeFrame, setActiveFrame] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "start start"]
  });

  // Transform vertical scroll to horizontal scroll
  const horizontalScroll = useTransform(scrollYProgress, [0, 1], [0, -1000]);

  const frames = [
    {
      id: 1,
      title: "Instant Emergency Booking",
      description: "Facing an emergency? Book an Ambulance or Fire Truck in just 3 taps.",
      visual: "phone",
      icon: Phone,
      color: "from-blue-500 to-cyan-500",
      backendHighlight: null,
      cta: "Request Help Now"
    },
    {
      id: 2,
      title: "Real-time Dispatch System",
      description: "Our system instantly finds the nearest available unit — no waiting, no calls.",
      visual: "map",
      icon: MapPin,
      color: "from-green-500 to-emerald-500",
      backendHighlight: "Advanced algorithms ensure fastest dispatch, even during high-demand hours.",
      cta: null
    },
    {
      id: 3,
      title: "Live Tracking & Communication",
      description: "Track your emergency vehicle in real-time & stay connected with the driver.",
      visual: "tracking",
      icon: Truck,
      color: "from-purple-500 to-pink-500",
      backendHighlight: null,
      cta: null,
      timeline: ["Request", "Assigned", "En Route", "Arriving"]
    },
    {
      id: 4,
      title: "Seamless Arrival & Handover",
      description: "Driver arrives equipped with all details — no repeated questions, immediate action.",
      visual: "handover",
      icon: MessageCircle,
      color: "from-orange-500 to-red-500",
      backendHighlight: "Direct handoff to emergency services with full case context.",
      cta: null
    },
    {
      id: 5,
      title: "Completion & Feedback",
      description: "Your safety, our priority. Once completed, rate your experience.",
      visual: "feedback",
      icon: CheckCircle,
      color: "from-indigo-500 to-blue-500",
      backendHighlight: null,
      cta: "Help us serve you better"
    }
  ];

  // Update active frame based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const frameIndex = Math.floor(latest * frames.length);
      setActiveFrame(Math.min(frameIndex, frames.length - 1));
    });
    return unsubscribe;
  }, [scrollYProgress, frames.length]);

  const VisualComponent = ({ type, isActive }) => {
    const baseClasses = "w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-500";
    const activeClasses = isActive ? "scale-110 shadow-2xl" : "scale-100 shadow-lg";

    switch (type) {
      case "phone":
        return (
          <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-300/30`}>
            <div className="text-center">
              <Phone className="w-12 h-12 text-blue-300 mx-auto mb-2" />
              <div className="space-y-1">
                <div className="w-16 h-2 bg-blue-300/50 rounded mx-auto"></div>
                <div className="w-12 h-2 bg-blue-300/30 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        );
      case "map":
        return (
          <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-300/30`}>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-green-300 mx-auto mb-2" />
              <div className="relative">
                <div className="w-16 h-16 border-2 border-green-300/50 rounded-lg mx-auto"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      case "tracking":
        return (
          <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30`}>
            <div className="text-center">
              <Truck className="w-12 h-12 text-purple-300 mx-auto mb-2" />
              <div className="space-y-1">
                <div className="w-16 h-1 bg-purple-300/50 rounded-full mx-auto"></div>
                <div className="w-12 h-1 bg-purple-300/30 rounded-full mx-auto"></div>
                <div className="w-8 h-1 bg-purple-300/20 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        );
      case "handover":
        return (
          <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-300/30`}>
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-orange-300 mx-auto mb-2" />
              <div className="flex justify-center space-x-1">
                <div className="w-3 h-3 bg-orange-300/50 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-300/30 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-300/20 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case "feedback":
        return (
          <div className={`${baseClasses} ${activeClasses} bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-300/30`}>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-indigo-300 mx-auto mb-2" />
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-indigo-300/60" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const TimelineComponent = ({ steps, isActive }) => {
    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-300/50 flex items-center justify-center">
                <span className="text-xs text-purple-300 font-medium">{index + 1}</span>
              </div>
              <span className="text-xs text-purple-300 mt-1">{step}</span>
            </motion.div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-purple-300/50 mx-1" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Section Header */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
          filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
        }}>
          Emergency Booking Flow
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          From booking to rescue, everything is monitored, optimized, and transparent.
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto"
      >
        <motion.div 
          ref={scrollContainerRef}
          style={{ x: horizontalScroll }}
          className="flex space-x-8 pb-8"
        >
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-shrink-0 w-80"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full">
                {/* Frame Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${frame.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{frame.id}</span>
                  </div>
                  <frame.icon className="w-6 h-6 text-white/60" />
                </div>

                {/* Visual Component */}
                <div className="flex justify-center mb-6">
                  <VisualComponent type={frame.visual} isActive={activeFrame === index} />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-3">{frame.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">{frame.description}</p>

                  {/* Timeline for Frame 3 */}
                  {frame.timeline && (
                    <TimelineComponent steps={frame.timeline} isActive={activeFrame === index} />
                  )}

                  {/* Backend Highlight */}
                  {frame.backendHighlight && (
                    <div className="bg-blue-500/10 border border-blue-300/20 rounded-lg p-3 mb-4">
                      <p className="text-blue-300 text-xs font-medium">{frame.backendHighlight}</p>
                    </div>
                  )}

                  {/* CTA Button */}
                  {frame.cta && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r ${frame.color} text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25`}
                    >
                      {frame.cta}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-indigo-500/30 transform -translate-y-1/2 -z-10"></div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative z-10 text-center mt-8">
        <div className="flex items-center justify-center space-x-2 text-white/60">
          <span className="text-sm">Scroll to explore the emergency flow</span>
          <ArrowRight className="w-4 h-4 animate-pulse rotate-90" />
        </div>
      </div>
    </section>
  );
};

export default EmergencyBookingFlow;