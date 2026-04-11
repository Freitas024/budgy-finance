import { InputHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";

export interface InputSearchProps extends InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
    variant?: "default" | "outline";
}

export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
    ({ className = "", containerClassName = "", variant = "default", ...props }, ref) => {
        const variantClasses = variant === "outline"
            ? "rounded-xl border border-[#2D2A54] bg-transparent py-2.5 transition-all focus-within:border-brand hover:border-[#3d396a]"
            : "h-10 rounded-full bg-[#131033] transition-colors focus-within:ring-1 focus-within:ring-brand";

        return (
            <div className={`flex w-full max-w-[360px] items-center gap-3 px-4 ${variantClasses} ${containerClassName}`}>
                <Search className="h-4 w-4 text-text-secondary shrink-0" />
                <input
                    ref={ref}
                    className={`w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

InputSearch.displayName = "InputSearch";
