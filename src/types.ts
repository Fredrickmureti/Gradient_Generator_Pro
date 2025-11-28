export type GradientType = 'linear' | 'radial' | 'conic';
export type OutputFormat = 'css' | 'tailwind' | 'scss' | 'react' | 'swift' | 'kotlin' | 'flutter' | 'css-vars' | 'vue' | 'angular' | 'sass' | 'less' | 'svg' | 'json' | 'figma';
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'rgba';
export type PatternType = 'stripes' | 'checkerboard' | 'dots' | 'waves' | 'mesh';
export type PresetCategory = 'all' | 'warm' | 'cool' | 'neon' | 'pastel' | 'dark' | 'nature' | 'favorites';

export interface ColorStopType {
  color: string;
  position: number;
  opacity: number; // 0-100
}

export interface GradientLayer {
  id: string;
  gradientType: GradientType;
  angle: number;
  colorStops: ColorStopType[];
  opacity: number;
  visible: boolean;
  blendMode: string;
}

export interface CodeOptions {
  includeVendorPrefixes: boolean;
  minified: boolean;
  includeFallback: boolean;
  colorFormat: ColorFormat;
  className: string;
  variableName: string;
}

export interface GradientState {
  gradientType: GradientType;
  angle: number;
  colorStops: ColorStopType[];
  outputFormat: OutputFormat;
  isRgbMode: boolean;
  rgbSpeed: number;
  isRepeating: boolean;
  patternType: PatternType | null;
  layers: GradientLayer[];
  codeOptions: CodeOptions;
}