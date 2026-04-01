export interface Announcement {
  id: string; // bump to show banner again after dismissal
  label: string; // text shown in the banner pill
  icon: string; // iconify icon
  heading: string;
  body: string[];
  cta?: { label: string; href: string; icon?: string };
}

export const ANNOUNCEMENT: Announcement = {
  id: "ai-search-v1",
  label: "Introducing AI Search ✦",
  icon: "lucide:sparkles",
  heading: "AI-powered icon search",
  body: [
    "Find icons by describing what you need — AI Search understands context, not just keywords.",
    "Enable AI mode in the icon picker or use category-based AI randomize. Sign in to try it.",
  ],
};
