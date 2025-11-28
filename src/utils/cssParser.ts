import { GradientType, ColorStopType } from '../types';

interface ParsedGradient {
  type: GradientType;
  angle: number;
  colorStops: ColorStopType[];
}

export function parseGradientCSS(css: string): ParsedGradient | null {
  css = css.trim();

  // Remove vendor prefixes
  css = css.replace(/-webkit-|-moz-|-o-|-ms-/g, '');

  let type: GradientType = 'linear';

  if (css.includes('repeating-linear-gradient')) {
    type = 'linear';
  } else if (css.includes('linear-gradient')) {
    type = 'linear';
  } else if (css.includes('repeating-radial-gradient')) {
    type = 'radial';
  } else if (css.includes('radial-gradient')) {
    type = 'radial';
  } else if (css.includes('conic-gradient')) {
    type = 'conic';
  } else {
    return null;
  }

  // Extract content between parentheses
  const match = css.match(/gradient\((.*)\)/);
  if (!match) return null;

  const content = match[1];
  const parts = content.split(/,(?![^(]*\))/); // Split by comma not inside parentheses

  let angle = 90;
  let colorStops: ColorStopType[] = [];
  let startIndex = 0;

  // Parse angle/direction for linear gradients
  if (type === 'linear' && parts.length > 0) {
    const firstPart = parts[0].trim();
    
    // Check for angle
    if (firstPart.includes('deg')) {
      const angleMatch = firstPart.match(/(\d+)deg/);
      if (angleMatch) {
        angle = parseInt(angleMatch[1]);
        startIndex = 1;
      }
    } else if (firstPart.startsWith('to ')) {
      // Convert direction to angle
      const direction = firstPart.replace('to ', '');
      const directionMap: Record<string, number> = {
        'top': 0,
        'right': 90,
        'bottom': 180,
        'left': 270,
        'top right': 45,
        'right top': 45,
        'bottom right': 135,
        'right bottom': 135,
        'bottom left': 225,
        'left bottom': 225,
        'top left': 315,
        'left top': 315,
      };
      angle = directionMap[direction] || 90;
      startIndex = 1;
    }
  }

  // Parse color stops
  for (let i = startIndex; i < parts.length; i++) {
    const part = parts[i].trim();
    
    // Match color and position
    const colorMatch = part.match(/(#[0-9a-f]{6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|[a-z]+)\s*(\d+)?(%|px)?/i);
    
    if (colorMatch) {
      const color = colorMatch[1];
      const position = colorMatch[2] ? parseInt(colorMatch[2]) : (i - startIndex) * (100 / (parts.length - startIndex - 1));
      
      // Convert to hex if needed (simplified - just store as is for now)
      colorStops.push({
        color: color.startsWith('#') ? color.toUpperCase() : color,
        position: Math.round(position),
        opacity: 100,
      });
    }
  }

  if (colorStops.length < 2) return null;

  return { type, angle, colorStops };
}
