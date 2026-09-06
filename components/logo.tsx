import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-icon.png"
      alt=""
      width={size}
      height={size}
      priority
      className={cn("rounded-md", className)}
    />
  );
}
