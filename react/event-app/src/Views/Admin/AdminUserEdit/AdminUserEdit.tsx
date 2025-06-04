import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { Modal } from '../../../Components/Modal/Modal';
import { z } from 'zod';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../../api/admin/userApi';

const adminEditUserSchema = z.object({
  email: z.string().email('Must be a valid email'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export type AdminEditUserInput = z.infer<typeof adminEditUserSchema>;

export const AdminUserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const {
    data: fetchedUser,
    isLoading: isFetching,
    isError: isFetchError,
  } = useGetUserByIdQuery(userId);

  const [updateUser, { isLoading: isUpdating, isSuccess }] =
    useUpdateUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminEditUserInput>({
    resolver: zodResolver(adminEditUserSchema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    if (fetchedUser) {
      reset({
        email: fetchedUser.email,
        username: fetchedUser.username,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
      });
    }
  }, [fetchedUser, reset]);

  useEffect(() => {
    if (!isFetching && isFetchError) {
      navigate('/admin/users', { replace: true });
    }
  }, [isFetching, isFetchError, navigate]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(true);
    }
  }, [isSuccess]);

  const onSubmit = (data: AdminEditUserInput) => {
    updateUser({ id: userId, data });
  };

  if (isFetching) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <p className='text-gray-500 text-lg'>Loading user data…</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4'>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-2xl font-extrabold text-gray-900 mb-6 text-center'>
            Edit User (ID: {userId})
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'>
            <FormInput
              label='Email'
              register={register('email')}
              error={errors.email?.message}
              placeholder='user@example.com'
            />
            <FormInput
              label='Username'
              register={register('username')}
              error={errors.username?.message}
              placeholder='username'
            />
            <FormInput
              label='First Name'
              register={register('firstName')}
              error={errors.firstName?.message}
              placeholder='First Name'
            />
            <FormInput
              label='Last Name'
              register={register('lastName')}
              error={errors.lastName?.message}
              placeholder='Last Name'
            />

            <button
              type='submit'
              disabled={isUpdating}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
                isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}>
              {isUpdating ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/admin/users')}
              disabled={isUpdating}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
                isUpdating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}>
              Cancel
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title='User Updated'
        onClose={() => {
          setIsModalOpen(false);
          navigate('/admin/users');
        }}
        cancelText='Close'>
        <p className='text-gray-700'>
          The user profile has been successfully updated.
        </p>
      </Modal>
    </>
  );
};

export default AdminUserEdit;
