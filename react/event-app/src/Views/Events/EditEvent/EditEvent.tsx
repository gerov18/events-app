import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetCategoriesQuery,
  useGetEventByIdQuery,
  useGetEventImagesQuery,
  useUpdateEventMutation,
  useUploadEventImagesMutation,
} from '../../../api/events/eventApi';
import { CreateEventInput, eventSchema } from '../../../api/events/eventSchema';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';

export const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const { data: categories, isLoading: isCatLoading } = useGetCategoriesQuery();
  const { data: event, isLoading: isEventLoading } =
    useGetEventByIdQuery(eventId);
  const { data: images, isLoading: loadingImages } =
    useGetEventImagesQuery(eventId);

  const [updateEvent, { isLoading: isUpdating, isSuccess, error }] =
    useUpdateEventMutation();
  const [uploadImages, { isLoading: isUploading }] =
    useUploadEventImagesMutation();

  const { user, userType } = useSelector((state: RootState) => state.auth);

  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ?? {
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
    if (isCatLoading || isEventLoading) return;
    if (!event) {
      navigate('/404', { replace: true });
      return;
    }
    if (user && userType === 'organiser') {
      if (user.id !== event.createdBy) {
        navigate('/404', { replace: true });
        console.log('gosho');
      }
    } else {
      navigate('/404', { replace: true });
    }
  }, [isCatLoading, isEventLoading, event, user, userType]);

  useEffect(() => {
    if (event) {
      reset(event);
    }
  }, [event, reset]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/events');
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data: CreateEventInput) => {
    try {
      await updateEvent({ id: eventId, data }).unwrap();

      if (files.length > 0) {
        await uploadImages({ eventId, files }).unwrap();
      }
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  if (isCatLoading || isEventLoading) return <p>Loading…</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-xl mx-auto space-y-4 p-4'>
      <h2 className='text-2xl font-semibold'>Edit Event</h2>

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
          className={`border rounded px-3 py-2 w-full ${
            errors.categoryId ? 'border-red-500' : 'border-gray-300'
          }`}>
          <option
            value={0}
            disabled>
            Select category
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
          <p className='text-red-500'>{errors.categoryId.message}</p>
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
        label='Price'
        type='number'
        register={register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />

      <div>
        <label>Add new photos</label>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={e =>
            setFiles([...files, ...Array.from(e.target.files ?? [])])
          }
        />
      </div>

      <button disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload photos'}
      </button>

      <h3>Existing photos:</h3>
      <div className='grid grid-cols-3 gap-4'>
        {images?.map(img => (
          <img
            key={img.id}
            src={img.url}
            className='w-full h-32 object-cover rounded'
          />
        ))}
      </div>
      <button
        type='submit'
        disabled={isUpdating}
        className='btn bg-blue-600 text-white w-full py-2'>
        {isUpdating ? 'Saving…' : 'Save Changes'}
      </button>

      {error && <p className='text-red-500'>Failed to update event</p>}
    </form>
  );
};
