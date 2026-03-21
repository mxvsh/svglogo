export interface LogoFont {
  family: string;
  weight: number;
  category: "sans" | "serif" | "display" | "mono";
  premium?: boolean;
}

export const LOGO_FONTS: LogoFont[] = [
  // Free fonts (10)
  { family: "Inter", weight: 700, category: "sans" },
  { family: "Poppins", weight: 700, category: "sans" },
  { family: "Montserrat", weight: 800, category: "sans" },
  { family: "Space Grotesk", weight: 700, category: "sans" },
  { family: "DM Sans", weight: 700, category: "sans" },
  { family: "Playfair Display", weight: 700, category: "serif" },
  { family: "Bebas Neue", weight: 400, category: "display" },
  { family: "Righteous", weight: 400, category: "display" },
  { family: "Comfortaa", weight: 700, category: "display" },
  { family: "JetBrains Mono", weight: 700, category: "mono" },

  // Premium fonts (20)
  { family: "Raleway", weight: 700, category: "sans", premium: true },
  { family: "Outfit", weight: 700, category: "sans", premium: true },
  { family: "Sora", weight: 700, category: "sans", premium: true },
  { family: "Plus Jakarta Sans", weight: 700, category: "sans", premium: true },
  { family: "Manrope", weight: 700, category: "sans", premium: true },
  { family: "Urbanist", weight: 700, category: "sans", premium: true },
  { family: "Bricolage Grotesque", weight: 700, category: "sans", premium: true },
  { family: "Instrument Sans", weight: 700, category: "sans", premium: true },
  { family: "Lora", weight: 700, category: "serif", premium: true },
  { family: "Merriweather", weight: 700, category: "serif", premium: true },
  { family: "Fraunces", weight: 700, category: "serif", premium: true },
  { family: "Crimson Pro", weight: 700, category: "serif", premium: true },
  { family: "Cormorant Garamond", weight: 700, category: "serif", premium: true },
  { family: "Libre Baskerville", weight: 700, category: "serif", premium: true },
  { family: "Pacifico", weight: 400, category: "display", premium: true },
  { family: "Fredoka", weight: 600, category: "display", premium: true },
  { family: "Archivo Black", weight: 400, category: "display", premium: true },
  { family: "Unbounded", weight: 700, category: "display", premium: true },
  { family: "Fira Code", weight: 700, category: "mono", premium: true },
  { family: "Space Mono", weight: 700, category: "mono", premium: true },
];

export const FREE_FONTS = LOGO_FONTS.filter((f) => !f.premium);
export const PREMIUM_FONTS = LOGO_FONTS.filter((f) => f.premium);

export function getFontGoogleUrl(family: string, weight: number): string {
  const encoded = family.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weight}&display=swap`;
}

export function getFontByFamily(family: string): LogoFont | undefined {
  return LOGO_FONTS.find((f) => f.family === family);
}
