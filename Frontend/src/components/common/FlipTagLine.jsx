import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.055;
const POP_SCALE = 1.0;
const FLIP_INTERVAL = 4000;  

export const RevealLinks = () => {
  const taglineParts = [
    {
      text: 'Every Help Request is Heard.',
      emphasize: ['Help', 'Request']
    },
    {
      text: 'Every Responder is Tracked.',
      emphasize: ['Responder']
    }
  ];

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, FLIP_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid place-content-center gap-6 px-8 py-24">
      {taglineParts.map((line, index) => (
        <FlipLink key={index} text={line.text} emphasize={line.emphasize} animateFlip={isFlipped} />
      ))}
    </section>
  );
};

const FlipLink = ({ text, emphasize = [], animateFlip }) => {
  const words = text.split(" ");

  return (
    <motion.a
      animate={animateFlip ? "flipped" : "initial"}
      href="#"
      className="relative block overflow-hidden text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
      style={{
        lineHeight: 1.2,
        minHeight: '1.25em',
        color: '#fff', // main text is white
        textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
        filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
        fontFamily: 'Inter, system-ui, sans-serif',
        letterSpacing: '0.02em',
      }}
    >
      <div className="inline">
        {words.map((word, wordIdx) => {
          const cleanWord = word.replace('.', '');
          const isEmphasized = emphasize.includes(cleanWord);
          const isPopWord = cleanWord === 'Responder';

          return (
            <span
              key={`word-top-${wordIdx}`}
              className={`inline font-bold`}
              style={{
                color: isEmphasized ? '#60a5fa' : '#fff', // blue-400 for emphasized, white for normal
                fontWeight: isEmphasized ? 900 : 700,
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
                filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              {word.split("").map((l, i) => (
                <motion.span
                  variants={{
                    initial: { y: 0, scale: 1 },
                    flipped: { y: "-100%", scale: isPopWord ? POP_SCALE : 1 },
                  }}
                  transition={{
                    duration: DURATION,
                    ease: "easeInOut",
                    delay: STAGGER * (i + wordIdx * 10),
                  }}
                  className="inline-block"
                  key={`char-top-${wordIdx}-${i}`}
                >
                  {l === ' ' ? '\u00A0' : l}
                </motion.span>
              ))}
              <motion.span className="inline-block">{'\u00A0'}</motion.span>
            </span>
          );
        })}
      </div>

      <div className="absolute inset-0">
        {words.map((word, wordIdx) => {
          const cleanWord = word.replace('.', '');
          const isEmphasized = emphasize.includes(cleanWord);
          const isPopWord = cleanWord === 'Responder';

          return (
            <span
              key={`word-bottom-${wordIdx}`}
              className={`inline font-bold`}
              style={{
                color: isEmphasized ? '#60a5fa' : '#fff',
                fontWeight: isEmphasized ? 900 : 700,
                textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)',
                filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              {word.split("").map((l, i) => (
                <motion.span
                  variants={{
                    initial: { y: "100%", scale: 1 },
                    flipped: { y: 0, scale: isPopWord ? POP_SCALE : 1 },
                  }}
                  transition={{
                    duration: DURATION,
                    ease: "easeInOut",
                    delay: STAGGER * (i + wordIdx * 10),
                  }}
                  className="inline-block"
                  key={`char-bottom-${wordIdx}-${i}`}
                >
                  {l === ' ' ? '\u00A0' : l}
                </motion.span>
              ))}
              <motion.span className="inline-block">{'\u00A0'}</motion.span>
            </span>
          );
        })}
      </div>
    </motion.a>
  );
};
