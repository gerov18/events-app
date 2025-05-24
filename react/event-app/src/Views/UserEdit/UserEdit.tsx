import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../Components/FormInput/FormInput';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../../api/me/meApi';
import { useUpdateUserMutation } from '../../api/auth/authApi';
import { UpdateUserInput, updateUserSchema } from '../../api/auth/authSchema';
import { setCredentials } from '../../api/auth/authSlice';
import { useNavigate } from 'react-router';

export const UserEdit = () => {
  const dispatch = useDispatch();
  const { data: user, isLoading: isGetMeLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating, isSuccess }] =
    useUpdateUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user && user.type === 'user' ? user.data : {},
  });

  useEffect(() => {
    if (user && user.type === 'user') reset(user.data);
  }, [user, reset]);

  useEffect(() => {
    if (isSuccess && user && user.type === 'user') {
      dispatch(setCredentials({ user: user.data, token: '' }));
      alert('Profile updated');
    }
  }, [isSuccess, user]);

  const onSubmit = (data: UpdateUserInput) => {
    updateUser(data);
  };

  useEffect(() => {
    if (!isGetMeLoading && !user) {
      navigate('/organiser/login');
    }
    if (!isGetMeLoading && user && user.type === 'organiser') {
      navigate('/');
    }
  }, [user, isGetMeLoading, navigate]);

  if (isGetMeLoading) return <p>Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-md mx-auto space-y-4'>
      <FormInput
        label='Email'
        register={register('email')}
        error={errors.email?.message}
      />
      <FormInput
        label='Username'
        register={register('username')}
        error={errors.username?.message}
      />
      <FormInput
        label='First Name'
        register={register('firstName')}
        error={errors.firstName?.message}
      />
      <FormInput
        label='Last Name'
        register={register('lastName')}
        error={errors.lastName?.message}
      />
      <FormInput
        label='Password'
        type='password'
        register={register('password')}
        error={errors.password?.message}
      />
      <button
        disabled={isUpdating}
        className='btn bg-blue-500'>
        {isUpdating ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};
