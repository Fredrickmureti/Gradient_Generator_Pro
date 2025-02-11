import React from 'react';
import { type ColorStopType } from '../types';

interface PresetGradientsProps {
  setColorStops: (stops: ColorStopType[]) => void;
}

const presets = [
  {
    name: 'Sunset',
    stops: [
      { color: '#FF416C', position: 0 },
      { color: '#FF4B2B', position: 100 }
    ]
  },
  {
    name: 'Ocean',
    stops: [
      { color: '#2193b0', position: 0 },
      { color: '#6dd5ed', position: 100 }
    ]
  },
  {
    name: 'Purple Love',
    stops: [
      { color: '#cc2b5e', position: 0 },
      { color: '#753a88', position: 100 }
    ]
  },
  {
    name: 'Forest',
    stops: [
      { color: '#134E5E', position: 0 },
      { color: '#71B280', position: 100 }
    ]
  }
];

export function PresetGradients({ setColorStops }: PresetGradientsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => setColorStops(preset.stops)}
          className="h-20 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          style={{
            background: `linear-gradient(90deg, ${preset.stops.map(stop => 
              `${stop.color} ${stop.position}%`).join(', ')})`
          }}
        >
          <span className="sr-only">{preset.name}</span>
        </button>
      ))}
    </div>
  );
}