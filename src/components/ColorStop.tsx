import { X } from 'lucide-react';
import { type ColorStopType } from '../types';
import { useState } from 'react';
import { parseColorInput } from '../utils/colorUtils';

interface ColorStopProps {
  stop: ColorStopType;
  onChange: (stop: ColorStopType) => void;
  onRemove: () => void;
}

export function ColorStop({ stop, onChange, onRemove }: ColorStopProps) {
  const [colorInput, setColorInput] = useState(stop.color);

  const handleColorInputChange = (value: string) => {
    setColorInput(value);
    const parsed = parseColorInput(value);
    if (parsed) {
      onChange({ ...stop, color: parsed });
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
      <input
        type="color"
        value={stop.color}
        onChange={(e) => onChange({ ...stop, color: e.target.value })}
        className="w-14 h-14 rounded cursor-pointer border-2 border-border"
      />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => handleColorInputChange(e.target.value)}
            placeholder="Enter color"
            className="flex-1 px-3 py-1.5 text-sm border rounded bg-background"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground w-16">Position:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={stop.position}
            onChange={(e) => onChange({ ...stop, position: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={stop.position}
            onChange={(e) => onChange({ ...stop, position: parseInt(e.target.value) })}
            className="w-16 px-2 py-1 text-sm border rounded bg-background"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground w-16">Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={stop.opacity}
            onChange={(e) => onChange({ ...stop, opacity: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={stop.opacity}
            onChange={(e) => onChange({ ...stop, opacity: parseInt(e.target.value) })}
            className="w-16 px-2 py-1 text-sm border rounded bg-background"
          />
        </div>
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}