const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/';

export const IMAGE_PRESETS = {
  tinyThumb: { width: 180, height: 120 },
  thumb: { width: 300, height: 220 },
  adminThumb: { width: 400, height: 300 },
  card: { width: 800 },
  galleryCard: { width: 900 },
  lightbox: { width: 1600 },
};

function toTransformPart(key, value) {
  if (value === undefined || value === null || value === false) return null;
  if (value === true) return key;
  return `${key}_${value}`;
}

export function cloudinaryImage(url, options = {}) {
  if (!url || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) return url;

  const {
    width,
    height,
    crop = height ? 'fill' : 'limit',
    quality = 'auto',
    format = 'auto',
    gravity,
  } = options;

  const transform = [
    toTransformPart('f', format),
    toTransformPart('q', quality),
    toTransformPart('c', crop),
    toTransformPart('g', gravity),
    toTransformPart('w', width),
    toTransformPart('h', height),
  ].filter(Boolean).join(',');

  if (!transform) return url;

  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transform}/`);
}
