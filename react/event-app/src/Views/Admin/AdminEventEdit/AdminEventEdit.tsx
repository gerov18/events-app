import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCategoriesQuery } from '../../../api/events/eventApi';
import {
  useGetAdminEventByIdQuery,
  useUpdateAdminEventMutation,
  useDeleteAdminEventMutation,
} from '../../../api/admin/adminEventsApi';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { CreateEventInput, eventSchema } from '../../../api/events/eventSchema';
import Modal from '../../../Components/Modal/Modal';

export const AdminEventEdit: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const eventId = Number(paramId);
  const navigate = useNavigate();

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
    refetch: refetchEvent,
  } = useGetAdminEventByIdQuery(eventId, { skip: isNaN(eventId) });

  const {
    data: categories,
    isLoading: isCatLoading,
    isError: isCatError,
  } = useGetCategoriesQuery();

  const [
    updateAdminEvent,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateAdminEventMutation();
  const [deleteAdminEvent, { isLoading: isDeleting }] =
    useDeleteAdminEventMutation();

  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      categoryId: 0,
      date: '',
      capacity: 1,
      price: 0,
    },
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        categoryId: event.categoryId,
        date: event.date.split('T')[0],
        capacity: event.capacity,
        price: event.price,
      });
    }
  }, [event, reset]);

  useEffect(() => {
    if (!isEventLoading && isEventError) {
      navigate('/admin/events', { replace: true });
    }
  }, [isEventLoading, isEventError, navigate]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setModalOpen(true);
    }
  }, [isUpdateSuccess]);

  const onSubmit = async (data: CreateEventInput) => {
    try {
      await updateAdminEvent({ id: eventId, ...data }).unwrap();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAdminEvent(eventId).unwrap();
      navigate('/admin/events');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (isEventLoading || isCatLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-gray-500 text-lg'>Loading…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-red-500 text-lg'>Event not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4'>
        <div className='max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 space-y-6'>
          <h2 className='text-2xl font-extrabold text-gray-900 text-center'>
            Edit Event
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'>
            <FormInput
              label='Title'
              register={register('title')}
              error={errors.title?.message}
            />
            <FormInput
              label='Description'
              register={register('description')}
              error={errors.description?.message}
            />
            <FormInput
              label='Location'
              register={register('location')}
              error={errors.location?.message}
            />
            <div>
              <label className='block mb-1 font-medium'>Category</label>
              <select
                {...register('categoryId', { valueAsNumber: true })}
                className={`w-full border rounded-lg px-4 py-2 focus:ring-indigo-300 focus:outline-none transition ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}>
                <option
                  value={0}
                  disabled>
                  Select a category
                </option>
                {categories?.map(c => (
                  <option
                    key={c.id}
                    value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className='mt-1 text-red-600 text-sm'>
                  {errors.categoryId.message}
                </p>
              )}
            </div>
            <FormInput
              label='Date'
              type='date'
              register={register('date')}
              error={errors.date?.message}
            />
            <FormInput
              label='Capacity'
              type='number'
              register={register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
            />
            <FormInput
              label='Price (EUR)'
              type='number'
              register={register('price', { valueAsNumber: true })}
              error={errors.price?.message}
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
              onClick={() => setModalOpen(true)}
              disabled={isDeleting}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition ${
                isDeleting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}>
              {isDeleting ? 'Deleting…' : 'Delete Event'}
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        title={isUpdateSuccess ? 'Event Updated' : 'Confirm Delete'}
        onClose={() => {
          setModalOpen(false);
          if (isUpdateSuccess) {
            refetchEvent();
            navigate(`/admin/events`);
          }
        }}
        onConfirm={isUpdateSuccess ? undefined : handleConfirmDelete}
        confirmText={isUpdateSuccess ? undefined : 'Delete'}
        cancelText={isUpdateSuccess ? 'Close' : 'Cancel'}>
        {isUpdateSuccess ? (
          <p className='text-gray-700'>
            The event has been successfully updated.
          </p>
        ) : (
          <p className='text-gray-700'>
            Are you sure you want to permanently delete this event? This action
            cannot be undone.
          </p>
        )}
      </Modal>
    </>
  );
};

export default AdminEventEdit;
