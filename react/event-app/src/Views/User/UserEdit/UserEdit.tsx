import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../../../api/me/meApi';
import { useUpdateUserMutation } from '../../../api/auth/authApi';
import {
  UpdateUserInput,
  updateUserSchema,
} from '../../../api/auth/authSchema';
import { setCredentials } from '../../../api/auth/authSlice';
import { useNavigate } from 'react-router';
import Modal from '../../../Components/Modal/Modal';

export const UserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user, isLoading: isGetMeLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating, isSuccess }] =
    useUpdateUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues:
      user && user.type === 'user' ? { ...user.data, password: '' } : {},
  });

  useEffect(() => {
    if (user && user.type === 'user') {
      reset({ ...user.data, password: '' });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isSuccess && user && user.type === 'user') {
      dispatch(
        setCredentials({
          userType: 'user',
          user: user.data,
          token: '',
          initialized: true,
        })
      );
      setIsModalOpen(true);
    }
  }, [isSuccess, user, dispatch]);

  const onSubmit = (data: UpdateUserInput) => {
    updateUser(data);
  };

  useEffect(() => {
    if (!isGetMeLoading && !user) {
      navigate('/login');
    }
    if (!isGetMeLoading && user && user.type === 'organiser') {
      navigate('/');
    }
  }, [user, isGetMeLoading, navigate]);

  if (isGetMeLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100'>
        <p className='text-gray-500 text-lg'>Loading user data…</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4'>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-2xl font-extrabold text-gray-900 mb-6 text-center'>
            Edit Your Profile
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'>
            <FormInput
              label='Email'
              register={register('email')}
              error={errors.email?.message}
              placeholder='you@example.com'
            />
            <FormInput
              label='Username'
              register={register('username')}
              error={errors.username?.message}
              placeholder='your_username'
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
            <FormInput
              label='Password'
              type='password'
              register={register('password')}
              error={errors.password?.message}
              placeholder='••••••••'
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
          </form>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title='Profile Updated'
        onClose={() => {
          setIsModalOpen(false);
          navigate('/user/me');
        }}
        cancelText='Close'>
        <p className='text-gray-700'>
          Your profile has been successfully updated.
        </p>
      </Modal>
    </>
  );
};

export default UserEdit;
