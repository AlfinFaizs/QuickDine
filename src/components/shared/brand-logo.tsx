import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  textClassName?: string;
}

const SIZE_MAP = {
  sm: { icon: 28, text: "text-lg", gap: "gap-2" },
  md: { icon: 34, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 46, text: "text-2xl", gap: "gap-3" },
  xl: { icon: 60, text: "text-3xl", gap: "gap-3.5" },
};

export function BrandLogo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
  textClassName = "",
}: BrandLogoProps) {
  const config = SIZE_MAP[size];

  const content = (
    <div className={`inline-flex items-center ${config.gap} group ${className}`}>
      <div className="relative shrink-0 transition-transform group-hover:scale-105">
        <Image
          src="/images/logo.png"
          alt="QuickDine Logo"
          width={config.icon}
          height={config.icon}
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <span
          className={`font-bold tracking-tight text-[#006948] ${config.text} ${textClassName}`}
        >
          QuickDine
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
