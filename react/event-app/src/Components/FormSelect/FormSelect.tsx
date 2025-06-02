import { UseFormRegisterReturn } from 'react-hook-form';

type Option = {
  value: string | number;
  label: string;
};

type FormSelectProps = {
  label: string;
  register: UseFormRegisterReturn;
  options: Option[];
  required?: boolean;
  error?: string;
  placeholder?: string;
};

export const FormSelect = ({
  label,
  register,
  options,
  required = false,
  error,
  placeholder = 'Select an option',
}: FormSelectProps) => {
  return (
    <div className='mb-6'>
      <label className='block text-sm font-semibold text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>

      {error && <p className='text-red-600 text-xs italic mb-1'>{error}</p>}

      <select
        {...register}
        required={required}
        className={`
          block w-full
          px-4 py-2
          border
          rounded-lg
          bg-white
          text-gray-900
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500
          transition duration-150 ease-in-out
          ${error ? 'border-red-500 ring-red-200' : 'border-gray-300'}
        `}>
        <option
          value=''
          disabled>
          {placeholder}
        </option>
        {options.map(opt => (
          <option
            key={opt.value}
            value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
