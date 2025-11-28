import { Clock, Trash2 } from 'lucide-react';
import { GradientState } from '../types';

interface GradientHistoryProps {
  history: GradientState[];
  onSelect: (state: GradientState) => void;
  onClear: () => void;
}

export function GradientHistory({ history, onSelect, onClear }: GradientHistoryProps) {
  if (history.length === 0) return null;

  const getGradientStyle = (state: GradientState) => {
    const stopsString = state.colorStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    return state.gradientType === 'linear'
      ? `linear-gradient(${state.angle}deg, ${stopsString})`
      : state.gradientType === 'radial'
      ? `radial-gradient(circle, ${stopsString})`
      : `conic-gradient(from ${state.angle}deg, ${stopsString})`;
  };

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Gradients
        </h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-red-600 flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </button>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {history.map((state, index) => (
          <button
            key={index}
            onClick={() => onSelect(state)}
            className="h-16 rounded-lg shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-indigo-500"
            style={{ background: getGradientStyle(state) }}
          >
            <span className="sr-only">Load gradient {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}