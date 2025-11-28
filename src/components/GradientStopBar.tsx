import { useRef, useState } from 'react';
import { type ColorStopType, type GradientType } from '../types';

interface GradientStopBarProps {
  colorStops: ColorStopType[];
  onChange: (stops: ColorStopType[]) => void;
  onSelectStop: (index: number) => void;
  selectedIndex: number;
  gradientType: GradientType;
  angle: number;
}

export function GradientStopBar({ 
  colorStops, 
  onChange, 
  onSelectStop,
  selectedIndex,
  gradientType
}: GradientStopBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const generateGradientStyle = () => {
    const stops = colorStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    return gradientType === 'linear'
      ? `linear-gradient(90deg, ${stops})`
      : gradientType === 'radial'
      ? `radial-gradient(circle, ${stops})`
      : `conic-gradient(${stops})`;
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex !== null) return;
    
    const bar = barRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    
    // Find color at this position by interpolation
    const beforeStop = [...colorStops].reverse().find(s => s.position <= position);
    
    const newColor = beforeStop?.color || '#000000';

    const newStop: ColorStopType = {
      color: newColor,
      position: Math.max(0, Math.min(100, position)),
      opacity: 100,
    };

    const newStops = [...colorStops, newStop].sort((a, b) => a.position - b.position);
    onChange(newStops);
    onSelectStop(newStops.indexOf(newStop));
  };

  const handleStopMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingIndex(index);
    onSelectStop(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex === null) return;

    const bar = barRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const position = Math.round(((e.clientX - rect.left) / rect.width) * 100);

    const newStops = [...colorStops];
    newStops[draggingIndex] = {
      ...newStops[draggingIndex],
      position: Math.max(0, Math.min(100, position)),
    };

    onChange(newStops);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Gradient Stops</span>
        <span className="text-xs">Click bar to add stop</span>
      </div>
      
      <div
        ref={barRef}
        className="relative h-12 rounded-lg border-2 border-border cursor-crosshair"
        style={{ background: generateGradientStyle() }}
        onClick={handleBarClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {colorStops.map((stop, index) => (
          <div
            key={index}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing ${
              selectedIndex === index ? 'z-10' : 'z-0'
            }`}
            style={{ left: `${stop.position}%` }}
            onMouseDown={(e) => handleStopMouseDown(index, e)}
          >
            <div
              className={`w-6 h-6 rounded-full border-3 transition-all ${
                selectedIndex === index 
                  ? 'border-primary scale-125 shadow-lg' 
                  : 'border-white shadow-md'
              }`}
              style={{ backgroundColor: stop.color }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              {stop.position}%
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Drag stops to reposition • Double-click stop to edit color
      </div>
    </div>
  );
}
