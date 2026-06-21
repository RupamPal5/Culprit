import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent",
      ghost: "hover:bg-accent",
    };
    const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-6 text-lg" };
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
  }
);
Button.displayName = "Button";
export { Button };
