import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useUpdateOrganiserMutation } from '../../../api/organiser/organiserApi';
import {
  UpdateOrganiserInput,
  updateOrganiserSchema,
} from '../../../api/organiser/organiserSchema';
import { setOrganiserData } from '../../../api/organiser/organiserSlice';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useGetMeQuery } from '../../../api/me/meApi';
import { useNavigate } from 'react-router';
import Modal from '../../../Components/Modal/Modal';

export const OrganiserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: organiser, isLoading: isGetMeLoading } = useGetMeQuery();
  const [updateMe, { isLoading: isUpdating, isSuccess }] =
    useUpdateOrganiserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultValues =
    organiser && organiser.type === 'organiser'
      ? {
          name: organiser.data.name,
          email: organiser.data.email,
          description:
            organiser.data.description === null
              ? undefined
              : organiser.data.description,
          phone:
            organiser.data.phone === null ? undefined : organiser.data.phone,
          website:
            organiser.data.website === null
              ? undefined
              : organiser.data.website,
          password: '',
        }
      : {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOrganiserInput>({
    resolver: zodResolver(updateOrganiserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (organiser && organiser.type === 'organiser') {
      reset(defaultValues);
    }
  }, [organiser, reset]);

  useEffect(() => {
    if (isSuccess && organiser && organiser.type === 'organiser') {
      dispatch(setOrganiserData(organiser.data));
      setIsModalOpen(true);
    }
  }, [isSuccess, organiser, dispatch]);

  const onSubmit = (data: UpdateOrganiserInput) => {
    updateMe(data);
  };

  useEffect(() => {
    if (!isGetMeLoading && !organiser) {
      navigate('/organiser/login');
    }
    if (!isGetMeLoading && organiser && organiser.type === 'user') {
      navigate('/');
    }
  }, [organiser, isGetMeLoading, navigate]);

  if (isGetMeLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100'>
        <p className='text-gray-500 text-lg'>Loading organiser data…</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4'>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-2xl font-extrabold text-gray-900 mb-6 text-center'>
            Edit Organisations Profile
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'>
            <FormInput
              label='Name'
              register={register('name')}
              error={errors.name?.message}
              placeholder='Organisation Name'
            />
            <FormInput
              label='Email'
              type='email'
              register={register('email')}
              error={errors.email?.message}
              placeholder='contact@example.com'
            />
            <FormInput
              label='Description'
              register={register('description')}
              error={errors.description?.message}
              placeholder='Brief description'
            />
            <FormInput
              label='Phone'
              register={register('phone')}
              error={errors.phone?.message}
              placeholder='+1234567890'
            />
            <FormInput
              label='Website'
              register={register('website')}
              error={errors.website?.message}
              placeholder='https://'
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
          navigate('/organiser/me');
        }}
        cancelText='Close'>
        <p className='text-gray-700'>
          Your organiser profile has been successfully updated.
        </p>
      </Modal>
    </>
  );
};

export default OrganiserEdit;
