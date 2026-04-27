function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export function getImageSize(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Could not read image dimensions.'));
    img.src = src;
  });
}

export function getAspectRatio(width, height) {
  if (!width || !height) return '4/3';
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}
