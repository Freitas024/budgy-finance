import { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";

interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = "", checked, ...props }, ref) => {
        return (
            <label className="group inline-flex cursor-pointer items-center gap-2.5">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        checked={checked}
                        className="peer sr-only"
                        {...props}
                    />
                    <div
                        className={`
              flex h-4.5 w-4.5 items-center justify-center rounded
              border border-border-default bg-bg-base
              transition-all duration-200
              peer-checked:border-brand peer-checked:bg-brand
              peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30
              group-hover:border-border-focus
              ${className}
            `}
                    >
                        <Check
                            className="h-3 w-3 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
                            strokeWidth={3}
                        />
                    </div>
                </div>
                {label && (
                    <span className="text-sm text-text-secondary select-none">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";
