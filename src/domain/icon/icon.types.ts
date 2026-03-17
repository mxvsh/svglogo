export const ICON_SETS = [
  { id: "lucide", label: "Lucide" },
  { id: "tabler", label: "Tabler" },
  { id: "hugeicons", label: "Hugeicons" },
  { id: "heroicons", label: "Heroicons" },
  { id: "ph", label: "Phosphor" },
  { id: "ri", label: "Remix Icons" },
  { id: "ion", label: "Ionicons" },
  { id: "skill-icons", label: "Skill Icons" },
  { id: "vscode-icons", label: "VS Code" },
  { id: "material-symbols", label: "Material Design" },
] as const;

export type IconSvgCache = {
  iconSvgContent: string;
  borderSvgContent: string;
  iconSvgUri: string;
  borderSvgUri: string;
};
