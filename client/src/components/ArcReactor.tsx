import React, { useEffect, useRef } from 'react';

const ArcReactor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const outerRadius = Math.min(centerX, centerY) * 0.8;
      const innerRadius = outerRadius * 0.4;

      // Draw static outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw static inner ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw rotating arcs
      const time = new Date().getTime() * 0.001;
      const numArcs = 6;
      const arcLength = Math.PI / 3;
      const rotationSpeed = 0.2;

      for (let i = 0; i < numArcs; i++) {
        const startAngle = (i * (Math.PI * 2 / numArcs)) + (time * rotationSpeed);
        const endAngle = startAngle + arcLength;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius * 0.7, startAngle, endAngle);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 + Math.sin(time * 2 + i) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw central core glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius * 1.2);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      <div className="absolute text-primary text-2xl font-bold neon-text">POWERING</div>
    </div>
  );
};

export default ArcReactor;
