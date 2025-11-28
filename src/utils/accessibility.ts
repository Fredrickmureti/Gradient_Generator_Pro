import { hexToRgb } from './colorUtils';

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG(ratio: number, level: 'AA' | 'AAA', size: 'normal' | 'large'): boolean {
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

export interface ContrastResult {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  meetsAALarge: boolean;
  meetsAAALarge: boolean;
}

export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    meetsAA: meetsWCAG(ratio, 'AA', 'normal'),
    meetsAAA: meetsWCAG(ratio, 'AAA', 'normal'),
    meetsAALarge: meetsWCAG(ratio, 'AA', 'large'),
    meetsAAALarge: meetsWCAG(ratio, 'AAA', 'large'),
  };
}
