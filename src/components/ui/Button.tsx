import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-brand text-white font-semibold
    hover:bg-brand-hover active:scale-[0.98]
    shadow-[0_0_20px_rgba(108,99,245,0.3)]
    hover:shadow-[0_0_30px_rgba(108,99,245,0.45)]
  `,
    outline: `
    bg-transparent border border-border-default text-text-primary font-medium
    hover:bg-bg-card hover:border-border-focus
  `,
    ghost: `
    bg-transparent text-text-secondary font-medium
    hover:bg-bg-card hover:text-text-primary
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-3.5 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            icon,
            iconPosition = "right",
            children,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex w-full cursor-pointer items-center justify-center gap-2
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                ) : (
                    <>
                        {icon && iconPosition === "left" && (
                            <span className="flex-shrink-0">{icon}</span>
                        )}
                        {children}
                        {icon && iconPosition === "right" && (
                            <span className="flex-shrink-0">{icon}</span>
                        )}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
