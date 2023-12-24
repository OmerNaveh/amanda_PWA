import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-custom text-primary-button-text text-center rounded-lg active:opacity-60 disabled:opacity-60",
        drink:
          "text-4xl h-16 bg-gradient-custom text-primary-button-text font-bold text-center rounded-lg tracking-[.2em] active:opacity-70 disabled:opacity-60",
        outline:
          "border border-primary bg-transparent text-primary rounded-lg active:opacity-60 disabled:opacity-60",
        underline:
          "text-primary bg-transparent underline active:opacity-70 disabled:opacity-60",
        login:
          "grid place-items-center border border-border bg-white text-secondary-text shadow-md rounded-xl active:opacity-70 disabled:opacity-60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:opacity-80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 w-full p-2",
        drink: "h-16 w-full p-2",
        login: "h-16 w-16 p-2 m-0",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
