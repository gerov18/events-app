import React, { useState } from 'react';
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
import { AddressAutocomplete } from '../../../Components/AddressAutocomplete/AddressAutocomplete';

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: isCatLoading } = useGetCategoriesQuery();
  const [createEvent, { isLoading: isCreating, error }] =
    useCreateEventMutation();
  const [uploadImages] = useUploadEventImagesMutation();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const locationValue = watch('location');

  const onSubmit = async (data: CreateEventInput) => {
    const newEvent = await createEvent(data).unwrap();
    if (files.length > 0) {
      await uploadImages({ eventId: newEvent.id, files }).unwrap();
    }
    navigate(`/events/${newEvent.id}`);
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

      <div>
        <label className='block mb-1 font-medium'>Location</label>
        <AddressAutocomplete
          value={locationValue}
          onChange={val => setValue('location', val, { shouldValidate: true })}
          placeholder='Enter address'
          error={errors.location?.message}
        />
      </div>

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
          <p className='text-red-500 text-sm'>{errors.categoryId.message}</p>
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
        <label className='block mb-1 font-medium'>Upload Photos</label>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={e => setFiles(Array.from(e.target.files || []))}
        />
      </div>

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
