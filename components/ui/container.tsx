import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clean?: boolean;
  size?: "narrow" | "default" | "wide" | "full";
}

export function Container({
  children,
  className,
  clean = false,
  size = "default",
  ...props
}: ContainerProps) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl 2xl:max-w-[1440px]",
    wide: "max-w-[1600px]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        !clean && "px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
