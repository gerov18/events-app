import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { Modal } from '../../../Components/Modal/Modal';
import { z } from 'zod';
import {
  useGetOrganiserByIdQuery,
  useUpdateOrganiserMutation,
} from '../../../api/admin/adminOrganisersApi';

const adminEditOrganiserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  description: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional(),
});

export type AdminEditOrganiserInput = z.infer<typeof adminEditOrganiserSchema>;

export const AdminOrganiserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organiserId = Number(id);
  const navigate = useNavigate();

  const {
    data: fetchedOrganiser,
    isLoading: isFetching,
    isError: isFetchError,
  } = useGetOrganiserByIdQuery(organiserId);

  const [updateOrganiser, { isLoading: isUpdating, isSuccess }] =
    useUpdateOrganiserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminEditOrganiserInput>({
    resolver: zodResolver(adminEditOrganiserSchema),
    defaultValues: {
      name: '',
      email: '',
      description: '',
      phone: '',
      website: '',
    },
  });

  useEffect(() => {
    if (fetchedOrganiser) {
      reset({
        name: fetchedOrganiser.name,
        email: fetchedOrganiser.email,
        description: fetchedOrganiser.description ?? '',
        phone: fetchedOrganiser.phone ?? '',
        website: fetchedOrganiser.website ?? '',
      });
    }
  }, [fetchedOrganiser, reset]);

  useEffect(() => {
    if (!isFetching && isFetchError) {
      navigate('/admin/organisers', { replace: true });
    }
  }, [isFetching, isFetchError, navigate]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(true);
    }
  }, [isSuccess]);

  const onSubmit = (data: AdminEditOrganiserInput) => {
    updateOrganiser({ id: organiserId, data });
  };

  if (isFetching) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <p className='text-gray-500 text-lg'>Loading organiser data…</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4'>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-2xl font-extrabold text-gray-900 mb-6 text-center'>
            Edit Organiser (ID: {organiserId})
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'>
            <FormInput
              label='Name'
              register={register('name')}
              error={errors.name?.message}
              placeholder='Organiser Name'
            />
            <FormInput
              label='Email'
              type='email'
              register={register('email')}
              error={errors.email?.message}
              placeholder='contact@organiser.com'
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
              placeholder='https://organiser.com'
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
              onClick={() => navigate('/admin/organisers')}
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
        title='Organiser Updated'
        onClose={() => {
          setIsModalOpen(false);
          navigate('/admin/organisers');
        }}
        cancelText='Close'>
        <p className='text-gray-700'>
          The organiser profile has been successfully updated.
        </p>
      </Modal>
    </>
  );
};

export default AdminOrganiserEdit;
