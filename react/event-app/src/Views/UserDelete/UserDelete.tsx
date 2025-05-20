import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDeleteUserMutation } from '../../api/auth/authApi';
import { deleteSchema, DeleteInput } from '../../api/auth/authSchema';
import { useNavigate } from 'react-router-dom';

export const UserDeleteForm = () => {
  const [deleteUser, { isLoading, error }] = useDeleteUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteInput>({
    resolver: zodResolver(deleteSchema),
  });

  const onSubmit = async (data: DeleteInput) => {
    try {
      await deleteUser(data).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 max-w-md mx-auto'>
      <h2 className='text-xl font-semibold'>Delete Account</h2>
      <input
        {...register('email')}
        placeholder='Email'
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type='password'
        {...register('password')}
        placeholder='Password'
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button
        type='submit'
        disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete Account'}
      </button>

      {error && <p className='text-red-500'>Delete failed</p>}
    </form>
  );
};
