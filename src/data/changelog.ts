export interface ChangelogEntry {
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Mar 17, 2026",
    changes: [
      "Added Skill Icons, VS Code, Tabler, and Material Design icon sets",
      "Randomize now picks from all icon sets randomly",
      "Added global icon search across all sets",
      "Added icon rotation control",
      "Added mobile view with top",
      "Added copy PNG to clipboard shortcut",
    ],
  },
  {
    date: "Mar 16, 2026",
    changes: [
      "Improved SVG fetch caching and performance",
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
