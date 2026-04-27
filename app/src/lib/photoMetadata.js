export const PHOTO_TAGS = ['Street', 'Portrait', 'Landscape', 'Architecture', 'Night', 'Golden Hour', 'Nature', 'Water'];
export const CAMERA_OPTIONS = ['XT-30 ii', 'X100VI', 'X-H2s'];

export function normalizeCamera(camera) {
  if (!camera) return '';
  // Exact match first
  if (CAMERA_OPTIONS.includes(camera)) return camera;
  // Fuzzy match: strip hyphens/spaces/case and compare
  const slug = (s) => s.toLowerCase().replace(/[-\s]/g, '');
  const match = CAMERA_OPTIONS.find((opt) => slug(opt) === slug(camera));
  return match || camera;
}
