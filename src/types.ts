export type GradientType = 'linear' | 'radial';
export type OutputFormat = 'css' | 'tailwind' | 'scss';

export interface ColorStopType {
  color: string;
  position: number;
}