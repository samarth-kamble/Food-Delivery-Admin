"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { act } from "react";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const param = useParams();
  const routes = [
    {
      href: `/${param.storeId}`,
      label: "Overview",
      active: pathname === `/${param.storeId}`,
    },
    {
      href: `/${param.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${param.storeId}/billboards`,
    },
    {
      href: `/${param.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${param.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 pl-6")}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition hover:text-primary",
            route.active ? "text-black" : " text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
