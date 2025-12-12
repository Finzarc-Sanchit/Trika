import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#1c1917] text-stone-50 hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/20 hover:scale-105",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 hover:scale-105",
        outline:
          "border border-stone-300 bg-white hover:bg-stone-50 hover:text-stone-900 hover:shadow-md hover:border-stone-400 hover:scale-105",
        secondary:
          "bg-stone-100 text-stone-900 hover:bg-stone-200 hover:shadow-md hover:scale-105",
        ghost: "hover:bg-stone-100 hover:text-stone-900 hover:scale-105",
        link: "text-[#1c1917] underline-offset-4 hover:underline transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

