export default function Button({ children, type = "button", className = "", onClick, disabled = false, variant = "default" }) {
    const baseStyles = "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

    // Using specific hex colors instead of Tailwind color classes
    const variantStyles = {
        default: "bg-[#F26A2A] text-white", // Blue: #2563eb (blue-600)
        outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-[#3b82f6]",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        destructive: "bg-[#dc2626] text-white hover:bg-[#b91c1c] focus:ring-[#ef4444]", // Red: #dc2626 (red-600)
        success: "bg-[#16a34a] text-white hover:bg-[#15803d] focus:ring-[#22c55e]" // Green: #16a34a (green-600)
    }

    return (
        <button
            type={type}
            className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
