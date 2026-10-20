export const NAV = [
  { href: "/", label: "Discover", match: (p: string) => p === "/" || p.startsWith("/discover") },
  { href: "/courses", label: "Courses", match: (p: string) => p.startsWith("/courses") },
  { href: "/professors", label: "Professors", match: (p: string) => p.startsWith("/professors") },
  { href: "/app", label: "Write a review", match: (p: string) => p === "/app" },
];
