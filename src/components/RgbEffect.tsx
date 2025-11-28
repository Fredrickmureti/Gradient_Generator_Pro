import { ToggleLeft as Toggle } from 'lucide-react';

interface RgbEffectProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

export function RgbEffect({
  isEnabled,
  setIsEnabled,
  speed,
  setSpeed
}: RgbEffectProps) {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Toggle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-medium text-gray-700">RGB Effect</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>
      
      {isEnabled && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Animation Speed ({speed}s)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}