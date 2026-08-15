import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#bccac0] bg-white px-4 py-2 text-sm text-[#131b2e] placeholder:text-[#6d7a72] transition-colors focus-visible:outline-none focus-visible:border-[#006948] focus-visible:ring-2 focus-visible:ring-[#006948]/20 disabled:cursor-not-allowed disabled:bg-[#f2f3ff] disabled:opacity-75",
            error && "border-[#ba1a1a] focus-visible:border-[#ba1a1a] focus-visible:ring-[#ba1a1a]/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="mt-1 text-xs text-[#ba1a1a]">{error}</p> : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
