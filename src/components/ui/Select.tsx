// src/components/ui/Select.tsx
interface SelectProps {
  label?: string;  // Hacerlo opcional
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select = ({ 
  label,  // Ahora es opcional
  options, 
  value, 
  onChange, 
  className, 
  required, 
  disabled 
}: SelectProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (  // Solo mostrar label si existe
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;