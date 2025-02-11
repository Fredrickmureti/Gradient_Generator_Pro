import React, { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check, ChevronDown, Sparkles, Palette, Download } from 'lucide-react';
import { GradientPreview } from './components/GradientPreview';
import { ColorStop } from './components/ColorStop';
import { GradientControls } from './components/GradientControls';
import { CodeOutput } from './components/CodeOutput';
import { PresetGradients } from './components/PresetGradients';
import { RgbEffect } from './components/RgbEffect';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { type GradientType, type ColorStopType, type OutputFormat } from './types';

function App() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStopType[]>([
    { color: '#FF416C', position: 0 },
    { color: '#FF4B2B', position: 100 }
  ]);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('css');
  const [isRgbMode, setIsRgbMode] = useState(false);
  const [rgbSpeed, setRgbSpeed] = useState(3);

  const generateGradientCode = useCallback(() => {
    const stopsString = colorStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    let code = '';
    if (isRgbMode) {
      code = `@keyframes rgb-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.gradient {
  background: ${gradientType === 'linear' 
    ? `linear-gradient(${angle}deg, ${stopsString})`
    : `radial-gradient(circle, ${stopsString})`};
  animation: rgb-shift ${rgbSpeed}s linear infinite;
}`;
    } else {
      const gradientString = gradientType === 'linear'
        ? `linear-gradient(${angle}deg, ${stopsString})`
        : `radial-gradient(circle, ${stopsString})`;

      switch (outputFormat) {
        case 'css':
          code = `background: ${gradientString};`;
          break;
        case 'tailwind':
          code = `<div class="bg-gradient-to-r from-[${colorStops[0].color}] to-[${colorStops[colorStops.length - 1].color}]"></div>`;
          break;
        case 'scss':
          code = `$gradient: ${gradientString};\n\n.element {\n  background: $gradient;\n}`;
          break;
      }
    }
    return code;
  }, [colorStops, angle, gradientType, outputFormat, isRgbMode, rgbSpeed]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateGradientCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setColorStops([
      { color: '#FF416C', position: 0 },
      { color: '#FF4B2B', position: 100 }
    ]);
    setAngle(90);
    setGradientType('linear');
    setIsRgbMode(false);
    setRgbSpeed(3);
  };

  const handleExport = () => {
    const dataUrl = document.querySelector('.gradient-preview canvas')?.toDataURL();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'gradient.png';
      link.href = dataUrl;
      link.click();
    }
  };

  const handleRandomize = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColorStops([
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 }
    ]);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gradient Generator
            </h1>
            <p className="text-lg text-gray-600">
              Create beautiful gradients visually and get the code
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="gradient-preview">
              <GradientPreview
                gradientType={gradientType}
                angle={angle}
                colorStops={colorStops}
                isRgbMode={isRgbMode}
                rgbSpeed={rgbSpeed}
              />
            </div>

            <div className="mt-6">
              <GradientControls
                gradientType={gradientType}
                setGradientType={setGradientType}
                angle={angle}
                setAngle={setAngle}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">Color Stops</h3>
                  <button
                    onClick={handleRandomize}
                    className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Random
                  </button>
                </div>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <Palette className="w-4 h-4 mr-1" />
                  Presets <ChevronDown className="ml-1 w-4 h-4" />
                </button>
              </div>
              
              {showPresets && (
                <PresetGradients setColorStops={setColorStops} />
              )}

              <div className="space-y-4">
                {colorStops.map((stop, index) => (
                  <ColorStop
                    key={index}
                    stop={stop}
                    onChange={(newStop) => {
                      const newStops = [...colorStops];
                      newStops[index] = newStop;
                      setColorStops(newStops);
                    }}
                    onRemove={() => {
                      if (colorStops.length > 2) {
                        setColorStops(colorStops.filter((_, i) => i !== index));
                      }
                    }}
                  />
                ))}
              </div>

              {colorStops.length < 5 && (
                <button
                  onClick={() => setColorStops([...colorStops, { color: '#000000', position: 50 }])}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Add Color Stop
                </button>
              )}
            </div>

            <div className="mt-6">
              <RgbEffect
                isEnabled={isRgbMode}
                setIsEnabled={setIsRgbMode}
                speed={rgbSpeed}
                setSpeed={setRgbSpeed}
              />
            </div>

            <div className="mt-6">
              <CodeOutput code={generateGradientCode()} />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;