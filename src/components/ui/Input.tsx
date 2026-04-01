import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ icon, label, error, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="text-sm font-medium text-text-secondary"
                    >
                        {label}
                    </label>
                )}
                <div
                    className={`
            flex items-center gap-3 rounded-[var(--radius-input)]
            border border-border-subtle bg-bg-base
            px-4 py-3
            transition-all duration-200
            focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus/30
            hover:border-border-default
            ${error ? "border-danger" : ""}
          `}
                >
                    {icon && (
                        <span className="flex-shrink-0 text-text-muted">{icon}</span>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        className={`
              w-full bg-transparent text-sm text-text-primary
              placeholder:text-text-muted
              outline-none
              ${className}
            `}
                    />
                </div>
                {error && <span className="text-xs text-danger">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";