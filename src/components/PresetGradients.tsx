import { type ColorStopType } from '../types';

interface PresetGradientsProps {
  setColorStops: (stops: ColorStopType[]) => void;
}

const presets = [
  { name: 'Sunset', stops: [{ color: '#FF416C', position: 0, opacity: 100 }, { color: '#FF4B2B', position: 100, opacity: 100 }] },
  { name: 'Ocean', stops: [{ color: '#2193b0', position: 0, opacity: 100 }, { color: '#6dd5ed', position: 100, opacity: 100 }] },
  { name: 'Purple Love', stops: [{ color: '#cc2b5e', position: 0, opacity: 100 }, { color: '#753a88', position: 100, opacity: 100 }] },
  { name: 'Forest', stops: [{ color: '#134E5E', position: 0, opacity: 100 }, { color: '#71B280', position: 100, opacity: 100 }] },
  { name: 'Fire', stops: [{ color: '#f12711', position: 0, opacity: 100 }, { color: '#f5af19', position: 100, opacity: 100 }] },
  { name: 'Cool Blues', stops: [{ color: '#2193b0', position: 0, opacity: 100 }, { color: '#6dd5ed', position: 100, opacity: 100 }] },
  { name: 'Peachy', stops: [{ color: '#ED4264', position: 0, opacity: 100 }, { color: '#FFEDBC', position: 100, opacity: 100 }] },
  { name: 'Bloody Mary', stops: [{ color: '#FF512F', position: 0, opacity: 100 }, { color: '#DD2476', position: 100, opacity: 100 }] },
  { name: 'Aubergine', stops: [{ color: '#AA076B', position: 0, opacity: 100 }, { color: '#61045F', position: 100, opacity: 100 }] },
  { name: 'Aqua Marine', stops: [{ color: '#1A2980', position: 0, opacity: 100 }, { color: '#26D0CE', position: 100, opacity: 100 }] },
  { name: 'Neon Life', stops: [{ color: '#B3FFAB', position: 0, opacity: 100 }, { color: '#12FFF7', position: 100, opacity: 100 }] },
  { name: 'Man of Steel', stops: [{ color: '#780206', position: 0, opacity: 100 }, { color: '#061161', position: 100, opacity: 100 }] },
  { name: 'Emerald Water', stops: [{ color: '#348F50', position: 0, opacity: 100 }, { color: '#56B4D3', position: 100, opacity: 100 }] },
  { name: 'Intuitive Purple', stops: [{ color: '#DA22FF', position: 0, opacity: 100 }, { color: '#9733EE', position: 100, opacity: 100 }] },
  { name: 'Green Beach', stops: [{ color: '#02AAB0', position: 0, opacity: 100 }, { color: '#00CDAC', position: 100, opacity: 100 }] },
  { name: 'Sunny Days', stops: [{ color: '#EDE574', position: 0, opacity: 100 }, { color: '#E1F5C4', position: 100, opacity: 100 }] }
];

export function PresetGradients({ setColorStops }: PresetGradientsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
      {presets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => setColorStops(preset.stops)}
          className="h-16 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 relative group"
          style={{
            background: `linear-gradient(90deg, ${preset.stops.map(stop => 
              `${stop.color} ${stop.position}%`).join(', ')})`
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg transition-opacity text-white text-xs font-medium px-2 text-center">
            {preset.name}
          </span>
        </button>
      ))}
    </div>
  );
}