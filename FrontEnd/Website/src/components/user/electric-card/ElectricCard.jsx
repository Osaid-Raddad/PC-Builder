import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import colors from '../../../config/colors';

const ElectricCard = ({ children, className = '', onClick }) => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    let animationFrameId;
    let offset = 0;

    const drawElectricBorder = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = colors.mainYellow;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.mainYellow;

      const segments = 100;
      const amplitude = 3;
      const frequency = 0.1;

      // Top border
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * canvas.width;
        const y = amplitude * Math.sin(frequency * i + offset);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Right border
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = canvas.width + amplitude * Math.sin(frequency * i + offset);
        const y = (i / segments) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Bottom border
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = canvas.width - (i / segments) * canvas.width;
        const y = canvas.height + amplitude * Math.sin(frequency * i + offset);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Left border
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const x = amplitude * Math.sin(frequency * i + offset);
        const y = canvas.height - (i / segments) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 0.03; // Changed from 0.1 to 0.03 for slower animation
      animationFrameId = requestAnimationFrame(drawElectricBorder);
    };

    drawElectricBorder();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onClick={onClick}
      style={{ padding: '4px' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

export default ElectricCard;
