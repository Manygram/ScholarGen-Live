// ScholarGen Live — shared design tokens for the Tutor experience.
// Centralising these keeps every tutor screen visually consistent with the
// student side (dark-green gradient header, green accents, soft white cards).

export const colors = {
  // Brand greens
  brandDeep: '#10240C', // gradient start (almost-black green)
  brandDeep2: '#1A3312', // gradient end
  brand: '#34931A', // primary action / accent green
  brandBright: '#52BE23', // progress + highlights
  brandSoft: '#EDF4E9', // soft green button bg
  brandSoftAlt: '#F5F9F5', // soft green icon bg

  // Surfaces
  bg: '#FCFDFC', // app background
  card: '#FFFFFF',
  cardBorder: '#F0F4F0',

  // Text
  ink: '#1A1A1A', // primary text
  inkSoft: '#8B9A8B', // secondary / muted text
  inkOnDark: '#FFFFFF',
  inkOnDarkSoft: '#AABBA0', // muted text on the dark header
  inkOnDarkSoft2: '#DDF0D6',

  // Glass (used over the dark header)
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassBtn: 'rgba(255, 255, 255, 0.08)',

  // Semantic
  success: '#2D8C1A',
  warning: '#E68A00',
  warningSoft: '#FFF4E5',
  danger: '#FF4D4D',
  info: '#1565C0',
};

// Reusable avatar palettes (subject-based), shared with the student side.
export const avatarPalette = [
  { bg: '#E8F5E9', fg: '#2E7D32' },
  { bg: '#FFF3E0', fg: '#E65100' },
  { bg: '#FFEBEE', fg: '#C62828' },
  { bg: '#E3F2FD', fg: '#1565C0' },
  { bg: '#F3E5F5', fg: '#6A1B9A' },
  { bg: '#E0F2F1', fg: '#00695C' },
];

export const spacing = {
  screen: 24,
  card: 20,
  gap: 16,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

// Pick a stable palette colour from a string (e.g. a name) so avatars are
// deterministic across renders.
export function paletteFor(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}

// Compact naira formatter — 576000 -> "₦576k", 489600 -> "₦489,600".
export function formatNaira(amount, { compact = false } = {}) {
  if (compact && amount >= 1000) {
    return `₦${Math.round(amount / 1000)}k`;
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}