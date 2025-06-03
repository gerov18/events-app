import { UseFormRegisterReturn } from 'react-hook-form';

type FormInputProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  error?: string;
  onFocus?: () => void;
  placeholder?: string;
};

export const FormInput = ({
  label,
  type = 'text',
  register,
  required = false,
  error,
  onFocus,
  placeholder = '',
}: FormInputProps) => {
  return (
    <div className='mb-6'>
      <label className='block text-sm font-semibold text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>

      {error && <p className='text-red-600 text-xs italic mb-1'>{error}</p>}

      <input
        type={type}
        {...register}
        required={required}
        placeholder={placeholder}
        onFocus={onFocus}
        className={`
          block w-full 
          px-4 py-2 
          border 
          rounded-lg 
          bg-white 
          placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 
          transition 
          duration-150 
          ease-in-out
          ${error ? 'border-red-500 ring-red-200' : 'border-gray-300'}
        `}
      />
    </div>
  );
};
