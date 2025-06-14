import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            {
              "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
              "border border-gray-200 bg-white hover:bg-gray-100": variant === "outline",
              "hover:bg-gray-100": variant === "ghost",
              "h-10 px-4 py-2": size === "default",
              "h-9 px-3": size === "sm",
              "h-11 px-8": size === "lg",
            },
            className
          )
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };