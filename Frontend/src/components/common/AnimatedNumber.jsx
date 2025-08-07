import React, { useState, useEffect, useRef } from 'react';

const AnimatedNumber = ({ 
  value, 
  diff = null, 
  duration = 1000, 
  className = "",
  showDiff = false 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  const animateNumber = () => {
    if (hasAnimated) return; // Prevent multiple animations
    
    setIsAnimating(true);
    setHasAnimated(true);
    const startValue = 0; // Always start from 0
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(Math.round(currentValue * 100) / 100);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, duration]);

  // Reset animation state when value changes (for new data)
  useEffect(() => {
    setHasAnimated(false);
    setDisplayValue(0);
  }, [value]);

  const formatNumber = (num) => {
    let formatted;
    if (num >= 1000000) {
      formatted = (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      formatted = (num / 1000).toFixed(1) + 'K';
    } else {
      formatted = num.toLocaleString();
    }
    return formatted + '+';
  };

  const getDiffColor = (diff) => {
    if (!diff) return 'text-white/90';
    return diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-white/90';
  };

  const getDiffIcon = (diff) => {
    if (!diff) return null;
    if (diff > 0) return '↗';
    if (diff < 0) return '↘';
    return '→';
  };

  return (
    <div ref={elementRef} className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <span 
          className={`text-5xl font-black text-white transition-all duration-300 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
            filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
          }}
        >
          {formatNumber(displayValue)}
        </span>
        {showDiff && diff !== null && (
          <div className={`absolute -top-2 -right-8 flex items-center text-sm font-bold ${getDiffColor(diff)}`}>
            <span className="mr-1">{getDiffIcon(diff)}</span>
            <span>{Math.abs(diff * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedNumber; 