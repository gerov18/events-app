import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const [uploadImages, { isLoading: isUploading }] =
    useUploadEventImagesMutation();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const onSubmit = async (data: CreateEventInput) => {
    try {
      const newEvent = await createEvent(data).unwrap();

      if (files.length > 0) {
        await uploadImages({ eventId: newEvent.id, files }).unwrap();
      }

      navigate(`/events/${newEvent.id}`);
    } catch (e) {
      console.error('Failed to create event:', e);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  if (isCatLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500'>Loading categories…</p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 mb-16 p-6 bg-white rounded-2xl shadow-lg'>
      <h2 className='text-3xl font-extrabold text-gray-800 mb-6 text-center'>
        Create New Event
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'>
        <FormInput
          label='Title'
          register={register('title')}
          error={errors.title?.message}
        />

        {/* Description */}
        <FormInput
          label='Description'
          register={register('description')}
          error={errors.description?.message}
        />

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Location
          </label>
          <AddressAutocomplete
            value={locationValue}
            onChange={val =>
              setValue('location', val, { shouldValidate: true })
            }
            placeholder='Enter full address'
            error={errors.location?.message}
          />
          {errors.location && (
            <p className='mt-1 text-red-600 text-sm'>
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Category
          </label>
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

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
        </div>

        {/* Price */}
        <FormInput
          label='Price (USD)'
          type='number'
          register={register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Add Photos
          </label>
          <input
            type='file'
            multiple
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
          />
          <button
            type='button'
            onClick={handleUploadClick}
            disabled={isUploading}
            className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
              isUploading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}>
            {isUploading ? 'Uploading…' : 'Choose Photos'}
          </button>
        </div>

        {previews.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              Selected Photos
            </h3>
            <div className='grid grid-cols-3 gap-4'>
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className='overflow-hidden rounded-lg shadow-sm relative'>
                  <img
                    src={src}
                    alt={`Selected ${idx}`}
                    className='w-full h-32 object-cover transition-transform hover:scale-105'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      setFiles(prev => prev.filter((_, i) => i !== idx))
                    }
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition'>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type='submit'
          disabled={isCreating}
          className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
            isCreating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
          {isCreating ? 'Creating…' : 'Create Event'}
        </button>

        {error && (
          <p className='text-center text-red-600 mt-2'>
            Failed to create event. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateEvent;
