import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary"
	size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "primary", size = "md", className = "", children, disabled, ...props }, ref) => {
		const variantClasses = {
			primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200",
			secondary:
				"bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-200",
		}

		const sizeClasses = {
			sm: "px-2 py-1 text-sm",
			md: "px-4 py-2",
			lg: "px-6 py-3 text-lg",
		}

		return (
			<button
				ref={ref}
				className={`
                    inline-flex items-center justify-center rounded-lg font-medium
                    ${variantClasses[variant]}
                    ${sizeClasses[size]}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transition-colors duration-200
                    ${className}
                `}
				disabled={disabled}
				{...props}>
				{children}
			</button>
		)
	},
)

Button.displayName = "Button"
