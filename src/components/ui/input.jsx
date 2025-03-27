export default function Input({ id, name, placeholder, value, onChange, className = "", type = "text" }) {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] ${className}`}
        />
    )
}
