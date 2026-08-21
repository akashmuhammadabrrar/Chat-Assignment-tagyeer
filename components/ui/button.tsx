import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#9A9C57] text-[#171914] hover:bg-[#888A4A] shadow-sm hover:shadow-md dark:bg-[#9A9C57] dark:hover:bg-[#888A4A] dark:text-[#171914]",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground dark:border-border dark:bg-card/50 dark:hover:bg-muted/60",
        secondary:
          "bg-[#FAFD8F] text-[#171914] hover:bg-[#EEF17F] border border-[#9A9C57]/30 dark:bg-[#FAFD8F] dark:hover:bg-[#EEF17F] dark:text-[#171914]",
        ghost:
          "hover:bg-muted hover:text-foreground dark:hover:bg-[#222417] dark:text-[#F5F5EF]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
        brandPrimary:
          "bg-[#9A9C57] text-[#171914] font-bold hover:bg-[#888A4A] shadow-md hover:shadow-lg dark:bg-[#9A9C57] dark:hover:bg-[#8b8d4b] dark:text-[#171914] active:scale-[0.98]",
        brandSecondary:
          "bg-[#FAFD8F] text-[#171914] font-bold border border-[#9A9C57]/40 hover:bg-[#EEF17F] shadow-sm dark:bg-[#FAFD8F] dark:text-[#171914] dark:hover:bg-[#EEF17F]",
      },
      size: {
        default: "h-9 px-4 py-2 gap-2",
        xs: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
        sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
        lg: "h-11 px-6 text-base gap-2.5 rounded-lg",
        xl: "h-12 px-7 text-base font-semibold gap-3 rounded-xl",
        icon: "size-9 rounded-lg",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

