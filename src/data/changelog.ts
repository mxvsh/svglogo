export interface ChangelogEntry {
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Mar 31, 2026",
    changes: [
      "AI Search in icon picker",
      "AI category mode in Randomize",
    ],
  },
  {
    date: "Mar 29, 2026",
    changes: [
      "Sign up & sign in with email or OAuth",
      "Cloud sync — collections saved to your account",
      "Transparent background support",
      "Improved background gradients"
    ],
  },
  {
    date: "Mar 27, 2026",
    changes: [
      "Randomize uses curated icon sets",
      "Mobile: tap to randomize, long press for options"
    ],
  },
  {
    date: "Mar 21, 2026",
    changes: [
      "Added Infinite Mode",
      "Added Color Palette",
      "Added Preview option",
      "Added Icon Set option in Randomize"
    ],
  },
  {
    date: "Mar 20, 2026",
    changes: [
      "Added stats info button",
      "Improved mobile experience",
      "Text mode improvements"
    ],
  },
  {
    date: "Mar 19, 2026",
    changes: [
      "Added Text Mode",
      "Added offset controls (X/Y)",
      "ProductHunt Launch"
    ],
  },
  {
    date: "Mar 18, 2026",
    changes: [
      "Smarter randomize",
      "Added Icon color option in Randomize"
    ],
  },
  {
    date: "Mar 17, 2026",
    changes: [
      "Added Advanced Export option",
      "Multiple gradient stop",
      "Added Tabler and Material Design icon sets",
      "Added global icon search across all sets",
      "Added icon rotation control",
      "Added mobile view",
      "Added copy PNG to clipboard shortcut",
    ],
  },
  {
    date: "Mar 14, 2026",
    changes: [
      "Added logo sharing via share link",
      "Improved collections: time formatting, increased limit",
      "Redesigned color picker (inline)",
    ],
  },
  {
    date: "Mar 13, 2026",
    changes: [
      "Added collections feature (save, remove logos)",
      "Added SVG and PNG copy to clipboard",
    ],
  },
  {
    date: "Mar 12, 2026",
    changes: [
      "Added icon border outline",
      "Added copy/paste logo data",
      "Added randomize button with dice animation",
      "Added undo/redo",
    ],
  },
  {
    date: "Mar 11, 2026",
    changes: [
      "Initial release",
      "SVG, PNG, ICO export",
      "Icon picker with multiple sets",
      "Gradient and solid backgrounds",
    ],
  },
];
