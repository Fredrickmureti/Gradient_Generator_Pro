import { useEffect, useRef } from 'react';
import { type GradientType, type ColorStopType } from '../types';

interface GradientPreviewProps {
  gradientType: GradientType;
  angle: number;
  colorStops: ColorStopType[];
  isRgbMode: boolean;
  rgbSpeed: number;
}

export function GradientPreview({ 
  gradientType, 
  angle, 
  colorStops,
  isRgbMode,
  rgbSpeed
}: GradientPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    // Create gradient
    let gradient;
    if (gradientType === 'linear') {
      const angleRad = (angle - 90) * Math.PI / 180;
      const x1 = canvas.width / 2 - Math.cos(angleRad) * canvas.width;
      const y1 = canvas.height / 2 - Math.sin(angleRad) * canvas.height;
      const x2 = canvas.width / 2 + Math.cos(angleRad) * canvas.width;
      const y2 = canvas.height / 2 + Math.sin(angleRad) * canvas.height;
      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else if (gradientType === 'radial') {
      gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
    } else {
      gradient = ctx.createConicGradient(angle * Math.PI / 180, canvas.width / 2, canvas.height / 2);
    }

    // Add color stops
    colorStops.forEach(stop => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });

    // Fill canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [gradientType, angle, colorStops]);

  const stopsString = colorStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
  
  const gradientStyle = {
    background: gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${stopsString})`
      : gradientType === 'radial'
      ? `radial-gradient(circle, ${stopsString})`
      : `conic-gradient(from ${angle}deg, ${stopsString})`,
    animation: isRgbMode ? `rgb-shift ${rgbSpeed}s linear infinite` : 'none'
  };

  return (
    <div className="relative w-full h-64">
      <div 
        className="absolute inset-0 rounded-lg shadow-inner"
        style={gradientStyle}
      />
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}