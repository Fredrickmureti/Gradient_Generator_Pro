import { useRef, useState, useEffect } from 'react';

interface AnglePickerProps {
  angle: number;
  onChange: (angle: number) => void;
  gradientType: 'linear' | 'radial' | 'conic';
}

export function AnglePicker({ angle, onChange, gradientType }: AnglePickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    drawDial();
  }, [angle]);

  const drawDial = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw degree markers
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
      const rad = (deg - 90) * Math.PI / 180;
      const x = centerX + Math.cos(rad) * (radius + 20);
      const y = centerY + Math.sin(rad) * (radius + 20);
      ctx.fillText(deg + '°', x, y);
    });

    // Draw angle indicator
    const rad = (angle - 90) * Math.PI / 180;
    const endX = centerX + Math.cos(rad) * radius;
    const endY = centerY + Math.sin(rad) * radius;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.fill();

    // Draw end dot
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.fill();
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    updateAngle(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateAngle(e);
  };

  const updateAngle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    let newAngle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (newAngle < 0) newAngle += 360;

    onChange(Math.round(newAngle));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  if (gradientType === 'radial') {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="cursor-pointer"
      />
      <div className="text-sm text-muted-foreground">
        {angle}° ({gradientType === 'linear' ? 'Linear' : 'Conic'} Gradient)
      </div>
    </div>
  );
}
