import React, { useEffect, useRef, useState } from 'react';

const BounceCard = ({ 
  children, 
  delay = 0, 
  className = '',
  style = {},
  threshold = 0.2,
  animationKey = 0,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Reset animation when key changes
    setIsVisible(false);
    
    // Clean up previous observer
    if (observerRef.current && cardRef.current) {
      observerRef.current.unobserve(cardRef.current);
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay to ensure reset completed
            setTimeout(() => {
              setIsVisible(true);
            }, 10);
          }
        });
      },
      { threshold }
    );

    if (cardRef.current) {
      observerRef.current.observe(cardRef.current);
    }

    return () => {
      if (observerRef.current && cardRef.current) {
        observerRef.current.unobserve(cardRef.current);
      }
    };
  }, [threshold, animationKey]);

  return (
    <>
      <div
        ref={cardRef}
        className={className}
        style={{
          ...style,
          animation: isVisible ? `bounceIn 0.6s ease-out ${delay}s both` : 'none',
          opacity: isVisible ? 1 : 0
        }}
        {...props}
      >
        {children}
      </div>

      {/* Inline styles for the animation */}
      <style>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
          }
          70% {
            transform: scale(0.95) translateY(5px);
          }
          85% {
            transform: scale(1.02) translateY(-3px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default BounceCard;
