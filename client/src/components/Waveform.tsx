import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isActive?: boolean;
  isSpeaking?: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isActive = false, isSpeaking = false }) => {
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

      const centerY = canvas.height / 2;
      const barWidth = 3;
      const barGap = 2;
      const numBars = Math.floor(canvas.width / (barWidth + barGap));
      const time = new Date().getTime() * 0.001;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + barGap);
        
        // Generate dynamic height based on time and bar position
        let height = 0;
        if (isActive || isSpeaking) {
          const frequency = 0.5 + (i / numBars) * 2;
          const amplitude = isSpeaking ? 20 : 10;
          height = Math.abs(Math.sin(time * frequency + i * 0.1) * amplitude);
        }

        // Draw bar
        ctx.fillStyle = isSpeaking 
          ? 'rgba(0, 255, 255, 0.8)' 
          : 'rgba(0, 255, 255, 0.4)';
        ctx.fillRect(x, centerY - height / 2, barWidth, height);

        // Add glow effect
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking]);

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};

export default Waveform;
