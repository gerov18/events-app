import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  useCreateEventMutation,
  useGetCategoriesQuery,
  useUploadEventImagesMutation,
} from '../../../api/events/eventApi';
import { CreateEventInput, eventSchema } from '../../../api/events/eventSchema';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { ImagesUpload } from '../../../Components/ImagesUpload/ImagesUpload';

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: isCatLoading } = useGetCategoriesQuery();
  const [createEvent, { isLoading: isCreating, isSuccess, error }] =
    useCreateEventMutation();
  const [uploadImages] = useUploadEventImagesMutation();

  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
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
  const onSubmit = async (data: CreateEventInput) => {
    const event = await createEvent(data).unwrap();
    if (files.length) {
      await uploadImages({ eventId: event.id, files }).unwrap();
    }
    navigate(`/events/${event.id}`);
  };

  if (isCatLoading) return <p>Loading categories…</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-xl mx-auto space-y-4 p-4'>
      <h2 className='text-2xl font-semibold'>Create New Event</h2>

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

      {/* <input
        type='file'
        accept='image/*'
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload}>Upload photos</button> /*}
      
      {/* <ImagesUpload eventId={eve} /> */}
      <input
        type='file'
        multiple
        onChange={e => setFiles(Array.from(e.target.files || []))}
      />
      <button
        type='submit'
        disabled={isCreating}
        className='btn bg-green-600 text-white w-full py-2'>
        {isCreating ? 'Creating…' : 'Create Event'}
      </button>

      {error && <p className='text-red-500'>Failed to create event</p>}
    </form>
  );
};
