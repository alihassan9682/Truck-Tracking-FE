export default function Select({ id, name, value, onChange, children, className = "" }) {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] ${className}`}
        >
            {children}
        </select>
    )
}
