import { GradientType, ColorStopType } from '../types';

export function generateReactCode(
  gradientType: GradientType,
  angle: number,
  colorStops: ColorStopType[]
): string {
  const stopsString = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  const gradient = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${stopsString})`
    : gradientType === 'radial'
    ? `radial-gradient(circle, ${stopsString})`
    : `conic-gradient(from ${angle}deg, ${stopsString})`;

  return `const gradientStyle = {
  background: '${gradient}'
};

<div style={gradientStyle}>
  {/* Your content */}
</div>`;
}

export function generateSwiftCode(
  gradientType: GradientType,
  _angle: number,
  colorStops: ColorStopType[]
): string {
  const colors = colorStops.map(stop => {
    const hex = stop.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return `UIColor(red: ${r.toFixed(2)}, green: ${g.toFixed(2)}, blue: ${b.toFixed(2)}, alpha: 1.0).cgColor`;
  });

  const locations = colorStops.map(stop => (stop.position / 100).toFixed(2));

  return `let gradient = CAGradientLayer()
gradient.colors = [
  ${colors.join(',\n  ')}
]
gradient.locations = [${locations.join(', ')}]
${gradientType === 'linear' ? `gradient.startPoint = CGPoint(x: 0.5, y: 0)
gradient.endPoint = CGPoint(x: 0.5, y: 1)` : ''}
gradient.frame = view.bounds
view.layer.insertSublayer(gradient, at: 0)`;
}

export function generateKotlinCode(
  gradientType: GradientType,
  _angle: number,
  colorStops: ColorStopType[]
): string {
  const colors = colorStops.map(stop => 
    `Color.parseColor("${stop.color}")`
  ).join(', ');

  return `val gradientDrawable = GradientDrawable(
    GradientDrawable.Orientation.${gradientType === 'linear' ? 'TOP_BOTTOM' : 'TL_BR'},
    intArrayOf(${colors})
)
${gradientType === 'radial' ? 'gradientDrawable.gradientType = GradientDrawable.RADIAL_GRADIENT' : ''}
view.background = gradientDrawable`;
}

export function generateFlutterCode(
  gradientType: GradientType,
  _angle: number,
  colorStops: ColorStopType[]
): string {
  const colors = colorStops.map(stop => {
    const hex = stop.color.replace('#', '');
    return `Color(0xFF${hex})`;
  }).join(', ');

  const stops = colorStops.map(stop => (stop.position / 100).toFixed(2)).join(', ');

  if (gradientType === 'linear') {
    return `Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [${colors}],
      stops: [${stops}],
    ),
  ),
)`;
  } else if (gradientType === 'radial') {
    return `Container(
  decoration: BoxDecoration(
    gradient: RadialGradient(
      colors: [${colors}],
      stops: [${stops}],
    ),
  ),
)`;
  } else {
    return `Container(
  decoration: BoxDecoration(
    gradient: SweepGradient(
      colors: [${colors}],
      stops: [${stops}],
    ),
  ),
)`;
  }
}

export function generateCssVars(
  gradientType: GradientType,
  angle: number,
  colorStops: ColorStopType[]
): string {
  const stopsString = colorStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  const gradient = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${stopsString})`
    : gradientType === 'radial'
    ? `radial-gradient(circle, ${stopsString})`
    : `conic-gradient(from ${angle}deg, ${stopsString})`;

  return `:root {
  --gradient-primary: ${gradient};
}

.element {
  background: var(--gradient-primary);
}`;
}