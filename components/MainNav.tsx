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
      href: `/${param.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${param.storeId}/categories`,
    },
    {
      href: `/${param.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${param.storeId}/sizes`,
    },
    {
      href: `/${param.storeId}/kitchens`,
      label: "Kitchens",
      active: pathname === `/${param.storeId}/kitchens`,
    },
    {
      href: `/${param.storeId}/cuisines`,
      label: "Cuisine",
      active: pathname === `/${param.storeId}/cuisines`,
    },
    {
      href: `/${param.storeId}/products`,
      label: "Product",
      active: pathname === `/${param.storeId}/products`,
    },
    {
      href: `/${param.storeId}/orders`,
      label: "Order",
      active: pathname === `/${param.storeId}/orders`,
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
