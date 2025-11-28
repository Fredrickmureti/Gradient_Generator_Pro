import { GradientState } from '../types';

export function encodeGradientToUrl(state: GradientState): string {
  const params = new URLSearchParams();
  params.set('type', state.gradientType);
  params.set('angle', state.angle.toString());
  params.set('stops', JSON.stringify(state.colorStops));
  params.set('format', state.outputFormat);
  if (state.isRgbMode) {
    params.set('rgb', 'true');
    params.set('speed', state.rgbSpeed.toString());
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function decodeGradientFromUrl(): Partial<GradientState> | null {
  const params = new URLSearchParams(window.location.search);
  
  if (!params.has('type')) return null;

  try {
    return {
      gradientType: params.get('type') as any,
      angle: parseInt(params.get('angle') || '90'),
      colorStops: JSON.parse(params.get('stops') || '[]'),
      outputFormat: params.get('format') as any,
      isRgbMode: params.get('rgb') === 'true',
      rgbSpeed: parseInt(params.get('speed') || '3'),
    };
  } catch {
    return null;
  }
}