"use client";

import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function Nav() {
  const routes: { path: string; name: string; icon: string }[] = [
    { path: "/", name: "Home", icon: "home" },
    { path: "/about", name: "About", icon: "info" },
    { path: "/teams", name: "Teams", icon: "users" },
    { path: "/players", name: "Players", icon: "users" },
    { path: "/stats", name: "Stats", icon: "chart-bar" },
    { path: "/events", name: "Events", icon: "calendar" },
    { path: "/sponsors", name: "Sponsors", icon: "users" },
  ];
  return (
    <nav className="flex w-full items-center justify-between border-b border-b-accent p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/">
            <Image src="/logo.svg" className="h-10 w-auto" alt="Logo" />
          </a>
          <NavigationMenu className="flex items-center gap-2">
            {routes.map((route) => (
              <Link href={route.path} legacyBehavior passHref key={route.path}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {route.name}
                </NavigationMenuLink>
              </Link>
            ))}
          </NavigationMenu>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
