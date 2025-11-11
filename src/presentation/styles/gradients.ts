// Centralized Tailwind gradient & backdrop utility classes to reduce duplication
// Add more as needed when new patterns emerge.

export const GRADIENT_APP_BG = 'bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63]';
export const GRADIENT_HEADER_TEXT =
  'bg-gradient-to-r from-[#443c70] to-[#a76050] bg-clip-text text-transparent';
export const GRADIENT_HOMEPAGE_TEXT =
  'bg-gradient-to-r from-[#443c70] via-[#a76050] to-[#f1ba63] bg-clip-text text-transparent';
export const GRADIENT_COIN_BADGE = 'bg-gradient-to-r from-[#f1ba63] to-[#fbf39b]';
export const GRADIENT_PRIMARY_BUTTON =
  'bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500';
export const GRADIENT_SUCCESS_BUTTON = 'bg-gradient-to-r from-green-500 to-emerald-600';
export const GRADIENT_WARNING_BUTTON = 'bg-gradient-to-r from-[#f1ba63] to-[#fbf39b]';
export const GRADIENT_LOGO_TEXT =
  'bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent';
export const GRADIENT_BRAND_BUTTON = 'bg-gradient-to-r from-[#443c70] to-[#a76050]';

export const BACKDROP_PANEL =
  'backdrop-blur-sm bg-white/80 rounded-2xl p-6 mb-8 shadow-xl border border-white/20';
export const BACKDROP_CARD_MODAL_HEADER =
  'bg-gradient-to-br from-[#443c70] via-[#a76050] to-[#f1ba63] p-6 rounded-t-2xl';
export const BACKDROP_EMPTY_STATE =
  'backdrop-blur-sm bg-white/90 rounded-3xl p-12 shadow-2xl border border-white/30';
export const BADGE_BLUR_WHITE =
  'px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/30';

// Helper to merge classes safely (simple version to avoid extra deps)
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
