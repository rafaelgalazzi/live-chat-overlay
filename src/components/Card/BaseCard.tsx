export interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hasHover?: boolean;
  hoverWithGlow?: boolean;
  showRibbon?: boolean;
  rouded?: boolean;
  ribbonSrc?: string; // caminho do PNG transparente
  ribbonSize?: number; // px
}

export function BaseCard({
  children,
  className,
  onClick,
  hoverWithGlow = false,
  rouded = true,
}: BaseCardProps) {
  const interactive = !!onClick;

  return (
    <div
      onClick={onClick}
      className={[
        rouded ? "rounded-xl" : "",
        "relative w-full p-4 sm:p-6",
        "bg-[rgb(var(--card-bg-rgb)/0.72)] backdrop-blur-md",
        "text-textPrimary border border-[rgb(var(--card-stroke-rgb)/0.08)]",
        "shadow-[0_8px_24px_rgba(2,6,23,0.35)]",
        hoverWithGlow
          ? "hover:shadow-glow"
          : "hover:shadow-[0_12px_32px_rgba(2,6,23,0.45)]",
        "transition-all duration-200",
        interactive ? "cursor-pointer hover:-translate-y-[2px]" : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
