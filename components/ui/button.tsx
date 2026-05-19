import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all disabled:opacity-50", {
  variants: {
    variant: { default: "bg-primary text-white hover:shadow-[0_0_24px_rgba(138,92,246,0.6)]", ghost: "hover:bg-white/10" },
    size: { default: "h-10 px-4", lg: "h-12 px-6 text-base" }
  },
  defaultVariants: { variant: "default", size: "default" }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
