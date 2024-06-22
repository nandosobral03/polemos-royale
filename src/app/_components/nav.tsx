"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import { routes } from "@/lib/nav";
import React from "react";
import { cn } from "@/lib/utils";

export default function Nav() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-b-accent p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/">
            <Image
              src="/logo.svg"
              className="h-10 w-auto"
              alt="Logo"
              width={40}
              height={40}
            />
          </a>

          <NavigationMenu>
            <NavigationMenuList>
              {routes.map((route) => (
                <>
                  {route.children ? (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        {route.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="flex flex-col gap-1 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <ListItem
                            key={route.path}
                            title={route.name}
                            href={route.path}
                          >
                            {route.description}
                          </ListItem>
                          {route.children.map((child) => (
                            <ListItem
                              key={child.path}
                              title={child.name}
                              href={child.path}
                            >
                              {child.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem>
                      <Link href={route.path} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {route.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )}
                </>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
