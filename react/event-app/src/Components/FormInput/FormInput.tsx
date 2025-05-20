import { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type FormInputProps = {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  error?: string;
};

export const FormInput = ({
  label,
  type = 'text',
  register,
  required = false,
  error,
}: FormInputProps) => {
  return (
    <div className='mb-4'>
      <label className='block font-medium mb-1'>{label}</label>
      {error && <p className='text-red-500 text-sm mb-1'>{error}</p>}
      <input
        type={type}
        {...register}
        required={required}
        className={`border px-3 py-2 w-full rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
  );
};
