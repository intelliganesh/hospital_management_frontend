import React from 'react';

interface CheckboxProps {
//   label?: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  readonly?: boolean;
  required?: boolean;
  style?: React.CSSProperties;
  
}

const Checkbox: React.FC<CheckboxProps> = ({
//   label,
  checked,
  onChange,
  disabled = false,
  name,
  id,
  className = '',
  readonly = false,
  required = false,
  style,
}) => {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        // className={`form-checkbox h-4 w-4 bg-primary rounded-md ${className}`}
        className={`
          h-4 w-4 text-primary-600 bg-white dark:bg-slate-800
          border-2 border-slate-300 dark:border-slate-600 rounded
          checked:bg-primary-600 checked:border-primary-600
          dark:checked:bg-primary-500 dark:checked:border-primary-500
          transition-all duration-200 cursor-pointer
          ${className}
        `}
        style={style}
      />
      {/* {label && <span className="text-sm text-gray-800">{label}</span>} */}
    </label>
  );
};

export default Checkbox;
