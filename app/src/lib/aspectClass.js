function classFromRatio(ratio) {
  if (ratio >= 1.2) return 'is-landscape';
  if (ratio <= 0.85) return 'is-portrait';
  return 'is-square';
}

export function getAspectClass(ar) {
  const [width, height] = String(ar || '4/3')
    .split('/')
    .map(Number);
  const ratio = width && height ? width / height : 4 / 3;

  return classFromRatio(ratio);
}

export function getAspectValue(ar) {
  const [width, height] = String(ar || '4/3')
    .split('/')
    .map(Number);

  return width && height ? `${width} / ${height}` : '4 / 3';
}

export function getAspectFromDimensions(width, height) {
  const ratio = width && height ? width / height : 4 / 3;

  return {
    className: classFromRatio(ratio),
    value: width && height ? `${width} / ${height}` : '4 / 3',
  };
}
