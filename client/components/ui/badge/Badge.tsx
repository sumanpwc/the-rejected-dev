// client/components/ui/badge.tsx

import React, { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "outline" | "green" | "red" | "blue";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const baseClasses =
    "inline-block rounded-full px-3 py-1 text-xs font-semibold select-none";

  const variantClasses = {
    default: "bg-blue-600 text-white",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent",
    green: "bg-green-600 text-white",
    red: "bg-red-600 text-white",
    blue: "bg-blue-600 text-white",
  };

  return (
    <span className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
}
