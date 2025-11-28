import { ColorStopType } from '../types';

export function generateStripesPattern(
  colorStops: ColorStopType[],
  angle: number,
  stripeWidth: number = 20
): string {
  const stops = colorStops
    .flatMap((stop, idx) => {
      const nextStop = colorStops[idx + 1];
      if (!nextStop) return [];
      
      return [
        `${stop.color} ${stop.position}%`,
        `${stop.color} ${stop.position + stripeWidth}%`,
        `${nextStop.color} ${stop.position + stripeWidth}%`,
        `${nextStop.color} ${nextStop.position}%`,
      ];
    })
    .join(', ');

  return `repeating-linear-gradient(${angle}deg, ${stops})`;
}

export function generateCheckerboardPattern(
  color1: string,
  color2: string,
  size: number = 20
): string {
  return `
    repeating-conic-gradient(
      ${color1} 0% 25%,
      ${color2} 0% 50%
    ) 0 0 / ${size}px ${size}px,
    repeating-conic-gradient(
      ${color2} 0% 25%,
      ${color1} 0% 50%
    ) ${size / 2}px ${size / 2}px / ${size}px ${size}px
  `.trim();
}

export function generateDotsPattern(
  dotColor: string,
  bgColor: string,
  dotSize: number = 10
): string {
  return `
    radial-gradient(circle at center, ${dotColor} ${dotSize}%, ${bgColor} ${dotSize}%)
  `.trim();
}

export function generateWavesPattern(
  colorStops: ColorStopType[],
  angle: number
): string {
  const stops = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  return `linear-gradient(${angle}deg, ${stops})`;
}

export function generateMeshGradient(layers: Array<{ color: string; x: number; y: number; size: number }>): string {
  const gradients = layers.map(
    layer => `radial-gradient(circle at ${layer.x}% ${layer.y}%, ${layer.color}, transparent ${layer.size}%)`
  );

  return gradients.join(', ');
}
