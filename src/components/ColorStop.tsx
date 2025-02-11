import React from 'react';
import { X } from 'lucide-react';
import { type ColorStopType } from '../types';

interface ColorStopProps {
  stop: ColorStopType;
  onChange: (stop: ColorStopType) => void;
  onRemove: () => void;
}

export function ColorStop({ stop, onChange, onRemove }: ColorStopProps) {
  return (
    <div className="flex items-center space-x-4">
      <input
        type="color"
        value={stop.color}
        onChange={(e) => onChange({ ...stop, color: e.target.value })}
        className="w-12 h-12 rounded cursor-pointer"
      />
      <input
        type="range"
        min="0"
        max="100"
        value={stop.position}
        onChange={(e) => onChange({ ...stop, position: parseInt(e.target.value) })}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <input
        type="number"
        min="0"
        max="100"
        value={stop.position}
        onChange={(e) => onChange({ ...stop, position: parseInt(e.target.value) })}
        className="w-16 px-2 py-1 text-sm border rounded"
      />
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}