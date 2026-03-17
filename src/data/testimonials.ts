export interface Testimonial {
  quote: string;
  author: string;
  source: "reddit" | "x";
  url?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I can't tell you how many times I've spent way too much time in Figma just to make a simple placeholder logo.",
    author: "u/char0dey",
    source: "reddit",
    url: "https://reddit.com/user/char0dey",
  },
  {
    quote: "This is great! I'm working on a few MVPs and I'll likely use it.",
    author: "u/DanielNavarra",
    source: "reddit",
    url: "https://reddit.com/user/DanielNavarra",
  },
  {
    quote: "Great job! I like it. Much better than messing with Canva.",
    author: "u/Developer_Memento",
    source: "reddit",
    url: "https://reddit.com/user/Developer_Memento",
  },
];
