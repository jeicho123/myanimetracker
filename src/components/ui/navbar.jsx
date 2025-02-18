import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "All Anime" },
  { href: "/popular", label: "Popular Anime" },
  { href: "/watched", label: "Watched" },
  { href: "/watching", label: "Currently Watching" },
];

export function Navbar() {
  return (
    <nav className="flex space-x-4 mb-4">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
