import { type GradientType, type OutputFormat } from '../types';

interface GradientControlsProps {
  gradientType: GradientType;
  setGradientType: (type: GradientType) => void;
  angle: number;
  setAngle: (angle: number) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
}

export function GradientControls({
  gradientType,
  setGradientType,
  angle,
  setAngle,
  outputFormat,
  setOutputFormat,
}: GradientControlsProps) {
  return (
    <div className="flex flex-wrap gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gradient Type
        </label>
        <select
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value as GradientType)}
          className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
          <option value="conic">Conic</option>
        </select>
      </div>

      {(gradientType === 'linear' || gradientType === 'conic') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {gradientType === 'conic' ? 'Start Angle' : 'Angle'} ({angle}°)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-16 px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Output Format
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
          className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="css">CSS</option>
          <option value="tailwind">Tailwind CSS</option>
          <option value="scss">SCSS</option>
          <option value="css-vars">CSS Variables</option>
          <option value="react">React JSX</option>
          <option value="swift">Swift (iOS)</option>
          <option value="kotlin">Kotlin (Android)</option>
          <option value="flutter">Flutter</option>
        </select>
      </div>
    </div>
  );
}