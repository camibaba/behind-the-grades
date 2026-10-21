export const NAV = [
  { href: "/#schools", label: "Schools", match: (p: string) => p.startsWith("/schools") || p.startsWith("/courses") },
  { href: "/rankings", label: "Rankings", match: (p: string) => p.startsWith("/rankings") || p.startsWith("/professors") },
  { href: "/search", label: "Search", match: (p: string) => p.startsWith("/search") },
];
