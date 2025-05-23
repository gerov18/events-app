import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteUserMutation, useGetMeQuery } from '../../api/auth/authApi';
import { deleteSchema, DeleteInput } from '../../api/auth/authSchema';
import { useNavigate } from 'react-router-dom';
import { clearUserState } from '../../api/auth/authSlice';
import { FormInput } from '../../Components/FormInput/FormInput';
import { useEffect } from 'react';

export const UserDelete = () => {
  const [deleteUser, { isLoading, error }] = useDeleteUserMutation();
  const { data: user, isLoading: isGetMeLoading } = useGetMeQuery();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteInput>({
    resolver: zodResolver(deleteSchema),
  });

  useEffect(() => {
    if (!isGetMeLoading && !user) {
      navigate('/login');
    }
  }, [user, isGetMeLoading, navigate]);

  const onSubmit = async (data: DeleteInput) => {
    try {
      if (user) {
        await deleteUser(data).unwrap();
        clearUserState();
        navigate('/');
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-md mx-auto mt-8'>
      <h2 className='text-2xl font-semibold'>Delete Your Account</h2>

      <FormInput
        label='Email'
        type='email'
        register={register('email')}
        error={errors.email?.message as string}
      />

      <FormInput
        label='Password'
        type='password'
        register={register('password')}
        error={errors.password?.message as string}
      />

      <button
        type='submit'
        disabled={isLoading}
        className='btn bg-red-500 text-white w-full'>
        {isLoading ? 'Deleting...' : 'Delete Account'}
      </button>

      {error && (
        <p className='text-red-500 text-center'>
          {(error as any).data?.message || 'Delete failed'}
        </p>
      )}
    </form>
  );
};
