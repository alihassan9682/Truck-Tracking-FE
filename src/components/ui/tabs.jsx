

export function Tabs({ children, value, onValueChange, className = "" }) {
    return <div className={`w-full ${className}`}>{children}</div>
}

export function TabsList({ children, className = "" }) {
    return <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>{children}</div>
}

export function TabsTrigger({ children, value, onClick, disabled = false, className = "", active = false }) {
    const baseStyles = "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all focus:outline-none"
    const activeStyles = active ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

    return (
        <button
            disabled={disabled}
            onClick={() => onClick && onClick(value)}
            className={`${baseStyles} ${activeStyles} ${disabledStyles} ${className}`}
        >
            {children}
        </button>
    )
}

export function TabsContent({ children, value, activeValue, className = "" }) {
    if (value !== activeValue) return null

    return <div className={`mt-2 ${className}`}>{children}</div>
}

