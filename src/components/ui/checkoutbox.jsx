export default function Checkbox({ id, name, checked, onChange, label, className = "" }) {
    return (
        <div className="flex items-center">
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={`h-4 w-4 text-[#2563eb] focus:ring-[#3b82f6] border-gray-300 rounded ${className}`}
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
                {label}
            </label>
        </div>
    )
}
