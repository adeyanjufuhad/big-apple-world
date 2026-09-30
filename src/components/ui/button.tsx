import { cn } from "@/lib/utils";

// Button styles in the shape of shadcn/ui's button (as listed on 21st.dev),
// without the Radix Slot dependency — apply to <a>/<Link> via buttonClass().
const variants = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  ink: "bg-ink text-white hover:bg-navy",
  light: "bg-white text-ink hover:bg-sand",
  accent: "bg-apple text-white hover:bg-apple-deep",
  outline: "border border-line bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:bg-sand",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5a]",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
  icon: "size-10",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
