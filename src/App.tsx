import { useState, useCallback, useEffect } from 'react';
import { Copy, RotateCcw, Check, ChevronDown, Sparkles, Palette, Download } from 'lucide-react';
import { GradientPreview } from './components/GradientPreview';
import { ColorStop } from './components/ColorStop';
import { GradientControls } from './components/GradientControls';
import { CodeOutput } from './components/CodeOutput';
import { PresetGradients } from './components/PresetGradients';
import { RgbEffect } from './components/RgbEffect';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShareButton } from './components/ShareButton';
import { GradientHistory } from './components/GradientHistory';
import { type GradientType, type ColorStopType, type OutputFormat, type GradientState } from './types';
import { useGradientHistory } from './hooks/useGradientHistory';
import { decodeGradientFromUrl } from './utils/urlSync';
import { generateReactCode, generateSwiftCode, generateKotlinCode, generateFlutterCode, generateCssVars } from './utils/codeGenerators';

function App() {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStopType[]>([
    { color: '#FF416C', position: 0, opacity: 100 },
    { color: '#FF4B2B', position: 100, opacity: 100 }
  ]);
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('css');
  const [isRgbMode, setIsRgbMode] = useState(false);
  const [rgbSpeed, setRgbSpeed] = useState(3);
  
  const { history, addToHistory, clearHistory } = useGradientHistory();

  // Load gradient from URL on mount
  useEffect(() => {
    const urlState = decodeGradientFromUrl();
    if (urlState) {
      if (urlState.gradientType) setGradientType(urlState.gradientType);
      if (urlState.angle) setAngle(urlState.angle);
      if (urlState.colorStops) setColorStops(urlState.colorStops);
      if (urlState.outputFormat) setOutputFormat(urlState.outputFormat);
      if (urlState.isRgbMode !== undefined) setIsRgbMode(urlState.isRgbMode);
      if (urlState.rgbSpeed) setRgbSpeed(urlState.rgbSpeed);
    }
  }, []);

  // Save to history when gradient changes
  useEffect(() => {
    const timer = setTimeout(() => {
      addToHistory({ 
        gradientType, 
        angle, 
        colorStops, 
        outputFormat, 
        isRgbMode, 
        rgbSpeed,
        isRepeating: false,
        patternType: null,
        layers: [],
        codeOptions: {
          includeVendorPrefixes: false,
          minified: false,
          includeFallback: true,
          colorFormat: 'hex',
          className: 'gradient',
          variableName: 'gradient'
        }
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [gradientType, angle, colorStops, outputFormat, isRgbMode, rgbSpeed]);

  const currentState: GradientState = {
    gradientType, 
    angle, 
    colorStops, 
    outputFormat, 
    isRgbMode, 
    rgbSpeed,
    isRepeating: false,
    patternType: null,
    layers: [],
    codeOptions: {
      includeVendorPrefixes: false,
      minified: false,
      includeFallback: true,
      colorFormat: 'hex',
      className: 'gradient',
      variableName: 'gradient'
    }
  };

  const generateGradientCode = useCallback(() => {
    const stopsString = colorStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');
    
    let code = '';
    if (isRgbMode) {
      const baseGradient = gradientType === 'linear' 
        ? `linear-gradient(${angle}deg, ${stopsString})`
        : gradientType === 'radial'
        ? `radial-gradient(circle, ${stopsString})`
        : `conic-gradient(from ${angle}deg, ${stopsString})`;
      
      code = `@keyframes rgb-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.gradient {
  background: ${baseGradient};
  animation: rgb-shift ${rgbSpeed}s linear infinite;
}`;
    } else {
      switch (outputFormat) {
        case 'css':
          const gradientString = gradientType === 'linear'
            ? `linear-gradient(${angle}deg, ${stopsString})`
            : gradientType === 'radial'
            ? `radial-gradient(circle, ${stopsString})`
            : `conic-gradient(from ${angle}deg, ${stopsString})`;
          code = `background: ${gradientString};`;
          break;
        case 'tailwind':
          code = `<div class="bg-gradient-to-r from-[${colorStops[0].color}] to-[${colorStops[colorStops.length - 1].color}]"></div>`;
          break;
        case 'scss':
          const scssGradient = gradientType === 'linear'
            ? `linear-gradient(${angle}deg, ${stopsString})`
            : gradientType === 'radial'
            ? `radial-gradient(circle, ${stopsString})`
            : `conic-gradient(from ${angle}deg, ${stopsString})`;
          code = `$gradient: ${scssGradient};\n\n.element {\n  background: $gradient;\n}`;
          break;
        case 'react':
          code = generateReactCode(gradientType, angle, colorStops);
          break;
        case 'swift':
          code = generateSwiftCode(gradientType, angle, colorStops);
          break;
        case 'kotlin':
          code = generateKotlinCode(gradientType, angle, colorStops);
          break;
        case 'flutter':
          code = generateFlutterCode(gradientType, angle, colorStops);
          break;
        case 'css-vars':
          code = generateCssVars(gradientType, angle, colorStops);
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
      { color: '#FF416C', position: 0, opacity: 100 },
      { color: '#FF4B2B', position: 100, opacity: 100 }
    ]);
    setAngle(90);
    setGradientType('linear');
    setIsRgbMode(false);
    setRgbSpeed(3);
  };

  const handleExport = () => {
    const canvas = document.querySelector('.gradient-preview canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = 'gradient.png';
      link.href = dataUrl;
      link.click();
    }
  };

  const handleRandomize = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    const numStops = Math.floor(Math.random() * 3) + 2; // 2-4 stops
    const stops = Array.from({ length: numStops }, (_, i) => ({
      color: randomColor(),
      position: Math.round((i / (numStops - 1)) * 100),
      opacity: 100
    }));
    setColorStops(stops);
    setAngle(Math.floor(Math.random() * 360));
    setGradientType(['linear', 'radial', 'conic'][Math.floor(Math.random() * 3)] as GradientType);
  };

  const loadGradientState = (state: GradientState) => {
    setGradientType(state.gradientType);
    setAngle(state.angle);
    setColorStops(state.colorStops);
    setOutputFormat(state.outputFormat);
    setIsRgbMode(state.isRgbMode);
    setRgbSpeed(state.rgbSpeed);
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
                  onClick={() => setColorStops([...colorStops, { color: '#000000', position: 50, opacity: 100 }])}
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
              <div className="mt-4 flex flex-wrap justify-end gap-3">
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
                <ShareButton gradientState={currentState} />
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

            <GradientHistory 
              history={history}
              onSelect={loadGradientState}
              onClear={clearHistory}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;