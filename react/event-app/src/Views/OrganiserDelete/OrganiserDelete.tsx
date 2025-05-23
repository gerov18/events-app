// src/pages/OrganiserDeleteForm.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useDeleteOrganiserMutation } from '../../api/organiser/organiserApi';
import { FormInput } from '../../Components/FormInput/FormInput';
import { clearOrganiserState } from '../../api/organiser/organiserSlice';
import {
  OrganiserDeleteInput,
  deleteOrganiserSchema,
} from '../../api/organiser/organiserSchema';
import { useGetMeQuery } from '../../api/me/meApi';

export const OrganiserDelete = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: organiser, isLoading: isGetMeLoading } = useGetMeQuery();
  const [deleteOrganiser, { isLoading, isSuccess, error }] =
    useDeleteOrganiserMutation();

  useEffect(() => {
    if (!isGetMeLoading && !organiser) {
      navigate('/organiser/login');
    }
    if (!isGetMeLoading && organiser && organiser.type === 'user') {
      navigate('/organiser/');
    }
  }, [organiser, isGetMeLoading, navigate]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearOrganiserState());
      navigate('/');
    }
  }, [isSuccess, dispatch, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganiserDeleteInput>({
    resolver: zodResolver(deleteOrganiserSchema),
  });

  const onSubmit = async (data: OrganiserDeleteInput) => {
    try {
      if (organiser) {
        await deleteOrganiser(data).unwrap();
      }
    } catch (err) {
      console.error('Organiser delete failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-md mx-auto mt-8'>
      <h2 className='text-2xl font-semibold'>Delete Organiser Account</h2>

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
