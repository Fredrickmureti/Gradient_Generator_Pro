interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

export async function extractColorsFromImage(file: File, numColors: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Scale down for performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Sample pixels (every 10th pixel for performance)
      const sampledColors: RGB[] = [];
      for (let i = 0; i < pixels.length; i += 40) {
        sampledColors.push({
          r: pixels[i],
          g: pixels[i + 1],
          b: pixels[i + 2],
        });
      }

      // K-means clustering (simplified)
      const clusters: RGB[] = [];
      
      // Initialize with random colors
      for (let i = 0; i < numColors; i++) {
        clusters.push(sampledColors[Math.floor(Math.random() * sampledColors.length)]);
      }

      // Iterate to find centroids
      for (let iter = 0; iter < 10; iter++) {
        const assignments: RGB[][] = Array(numColors).fill(null).map(() => []);

        // Assign pixels to nearest cluster
        sampledColors.forEach(color => {
          let minDist = Infinity;
          let bestCluster = 0;

          clusters.forEach((cluster, idx) => {
            const dist = colorDistance(color, cluster);
            if (dist < minDist) {
              minDist = dist;
              bestCluster = idx;
            }
          });

          assignments[bestCluster].push(color);
        });

      // Update cluster centers
      clusters.forEach((_, idx) => {
        if (assignments[idx].length > 0) {
          const sum = assignments[idx].reduce(
            (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
            { r: 0, g: 0, b: 0 }
          );
          clusters[idx] = {
            r: Math.round(sum.r / assignments[idx].length),
            g: Math.round(sum.g / assignments[idx].length),
            b: Math.round(sum.b / assignments[idx].length),
          };
        }
      });
      }

      // Convert to hex
      const hexColors = clusters.map(c => rgbToHex(c.r, c.g, c.b));
      resolve(hexColors);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
}
