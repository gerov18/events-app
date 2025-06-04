import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetCategoriesQuery,
  useGetEventByIdQuery,
  useGetEventImagesQuery,
  useUpdateEventMutation,
  useUploadEventImagesMutation,
  useDeleteEventImageMutation,
} from '../../../api/events/eventApi';
import { CreateEventInput, eventSchema } from '../../../api/events/eventSchema';
import { FormInput } from '../../../Components/FormInput/FormInput';
import { AddressAutocomplete } from '../../../Components/AddressAutocomplete/AddressAutocomplete';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import { Image } from '../../../types/Image';

export const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const { data: categories, isLoading: isCatLoading } = useGetCategoriesQuery();
  const { data: event, isLoading: isEventLoading } =
    useGetEventByIdQuery(eventId);
  const { data: images, isLoading: loadingImages } =
    useGetEventImagesQuery(eventId);

  const [updateEvent, { isLoading: isUpdating, error }] =
    useUpdateEventMutation();
  const [uploadImages, { isLoading: isUploading }] =
    useUploadEventImagesMutation();
  const [deleteEventImage] = useDeleteEventImageMutation();

  const { user, userType } = useSelector((state: RootState) => state.auth);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (event) {
      reset(event);
    }
  }, [event, reset]);

  useEffect(() => {
    if (images) {
      setExistingImages(images);
    }
  }, [images]);

  useEffect(() => {
    if (!isCatLoading && !isEventLoading) {
      if (!event) {
        navigate('/404', { replace: true });
        return;
      }
      if (!(userType === 'organiser' && user?.id === event.createdBy)) {
        navigate('/404', { replace: true });
      }
    }
  }, [isCatLoading, isEventLoading, event, user, userType, navigate]);

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
      await updateEvent({ id: eventId, data }).unwrap();
      if (files.length > 0) {
        await uploadImages({ eventId, files }).unwrap();
      }
      navigate(`/events/${eventId}`);
    } catch (e) {
      console.error('Edit failed:', e);
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

  const deleteExistingPhoto = async (imageId: number) => {
    try {
      await deleteEventImage({ eventId, imageId }).unwrap();
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (e) {
      console.error('Failed to delete image:', e);
    }
  };

  if (isCatLoading || isEventLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500'>Loading…</p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 mb-16 p-6 bg-white rounded-2xl shadow-lg'>
      <h2 className='text-3xl font-extrabold text-gray-800 mb-6 text-center'>
        Edit Event
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6'>
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

        <FormInput
          label='Price (EUR)'
          type='number'
          register={register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Add New Photos
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

        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>
            Existing Photos
          </h3>
          {loadingImages ? (
            <p className='text-gray-500'>Loading photos…</p>
          ) : existingImages.length > 0 ? (
            <div className='grid grid-cols-3 gap-4'>
              {existingImages.map(img => (
                <div
                  key={img.id}
                  className='overflow-hidden rounded-lg shadow-sm relative'>
                  <img
                    src={img.url}
                    alt={`Event ${event?.id} photo ${img.id}`}
                    className='w-full h-32 object-cover transition-transform hover:scale-105'
                  />
                  <button
                    type='button'
                    onClick={() => deleteExistingPhoto(img.id)}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition'>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No existing photos uploaded.</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isUpdating}
          className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition ${
            isUpdating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
          {isUpdating ? 'Saving…' : 'Save Changes'}
        </button>

        {error && (
          <p className='text-center text-red-600 mt-2'>
            Failed to update event. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default EditEvent;
