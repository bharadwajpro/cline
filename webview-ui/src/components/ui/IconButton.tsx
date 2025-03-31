import React from "react"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode
    tooltip?: string
    size?: "sm" | "md" | "lg"
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, tooltip, size = "md", className = "", disabled, ...props }, ref) => {
        const sizeClasses = {
            sm: "p-1",
            md: "p-2",
            lg: "p-3",
        }

        return (
            <button
                ref={ref}
                className={`
                    inline-flex items-center justify-center rounded-lg
                    ${sizeClasses[size]}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                    focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600
                    ${className}
                `}
                disabled={disabled}
                title={tooltip}
                {...props}
            >
                {icon}
            </button>
        )
    }
)

IconButton.displayName = "IconButton" 