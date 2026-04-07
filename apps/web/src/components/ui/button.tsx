import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,43,85,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-white/10 shadow-[0_4px_24px_rgba(255,43,85,0.35)] hover:brightness-110 hover:shadow-[0_8px_36px_rgba(255,43,85,0.45)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[rgba(255,43,85,0.28)] bg-[#111111]/60 backdrop-blur-sm hover:bg-[#161616] hover:border-[rgba(255,43,85,0.45)] hover:shadow-[0_0_28px_rgba(255,43,85,0.15)]",
        secondary:
          "bg-[hsl(var(--muted))] text-secondary-foreground border border-[rgba(255,43,85,0.1)] hover:border-[rgba(255,43,85,0.25)] hover:bg-[hsl(var(--muted))]/90",
        ghost: "hover:bg-[rgba(255,43,85,0.08)] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tip: "bg-[rgba(255,43,85,0.12)] text-[hsl(var(--accent-glow))] border border-[rgba(255,43,85,0.28)] hover:bg-[rgba(255,43,85,0.2)] hover:shadow-[0_0_20px_rgba(255,43,85,0.2)] font-semibold",
        wallet:
          "bg-[#111111] border border-[rgba(255,43,85,0.15)] hover:border-[rgba(255,43,85,0.4)] text-foreground hover:shadow-lux",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-14 rounded-2xl px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
