export interface ChangelogEntry {
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
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
