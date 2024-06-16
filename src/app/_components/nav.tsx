"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Nav() {

    const routes: { path: string, name: string, icon: string }[] = [
        { path: "/", name: "Home", icon: "home" },
        { path: "/about", name: "About", icon: "info" },
        { path: "/teams", name: "Teams", icon: "users" },
        { path: "/stats", name: "Stats", icon: "chart-bar" },
    ]
    return (
        <nav className="w-full flex justify-between items-center p-4 border-b border-b-accent">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <a href="/">
                        <img src="/logo.svg" className="h-10 w-auto" alt="Logo" />
                    </a>
                    <NavigationMenu>
                        <NavigationMenuItem>
                            {
                                routes.map((route) => (
                                    <Link href={route.path} legacyBehavior passHref key={route.path}>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            {route.name}
                                        </NavigationMenuLink>
                                    </Link>
                                ))

                            }

                        </NavigationMenuItem>
                    </NavigationMenu>
                </div>
                <ThemeToggle />
            </div>
        </nav >
    )
}