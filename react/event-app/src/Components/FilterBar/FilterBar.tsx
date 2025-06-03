// src/Components/FilterBar/FilterBar.tsx

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../api/events/eventApi';
import { FormInput } from '../FormInput/FormInput';

type FilterValues = {
  keyword: string;
  city: string;
  categoryId: number | '';
  dateFrom: string;
  dateTo: string;
};

type FilterProps = {
  onCloseClick: () => void;
};

export const FilterBar = ({ onCloseClick }: FilterProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: categories } = useGetCategoriesQuery();

  const keywordParam = searchParams.get('keyword') || '';
  const cityParam = searchParams.get('city') || '';
  const categoryParam = searchParams.get('categoryId') || '';
  const dateFromParam = searchParams.get('dateFrom') || '';
  const dateToParam = searchParams.get('dateTo') || '';

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FilterValues>({
    defaultValues: {
      keyword: keywordParam,
      city: cityParam,
      categoryId:
        categoryParam !== '' && !isNaN(Number(categoryParam))
          ? Number(categoryParam)
          : '',
      dateFrom: dateFromParam,
      dateTo: dateToParam,
    },
  });

  useEffect(() => {
    reset({
      keyword: keywordParam,
      city: cityParam,
      categoryId:
        categoryParam !== '' && !isNaN(Number(categoryParam))
          ? Number(categoryParam)
          : '',
      dateFrom: dateFromParam,
      dateTo: dateToParam,
    });
  }, [
    keywordParam,
    cityParam,
    categoryParam,
    dateFromParam,
    dateToParam,
    reset,
  ]);

  const onSubmit = (data: FilterValues) => {
    const params = new URLSearchParams();

    if (data.keyword.trim() !== '') {
      params.append('keyword', data.keyword.trim());
    }
    if (data.city.trim() !== '') {
      params.append('city', data.city.trim());
    }
    if (data.categoryId !== '') {
      params.append('categoryId', String(data.categoryId));
    }
    if (data.dateFrom !== '') {
      params.append('dateFrom', data.dateFrom);
    }
    if (data.dateTo !== '') {
      params.append('dateTo', data.dateTo);
    }

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6 mb-8'>
      <div className='flex justify-end'>
        <button
          onClick={onCloseClick}
          className='cursor-pointer text-gray-500 hover:text-gray-700 transition-transform transform  text-2xl'>
          &#x2715;
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <FormInput
          label='Keyword'
          type='text'
          register={register('keyword')}
          error={errors.keyword?.message}
          placeholder='e.g. Concert'
        />

        <FormInput
          label='City'
          type='text'
          register={register('city')}
          error={errors.city?.message}
          placeholder='e.g. Plovdiv'
        />

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-1'>
            Category
          </label>
          <Controller
            name='categoryId'
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`block w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition duration-150 ease-in-out ${
                  errors.categoryId
                    ? 'border-red-500 ring-red-200'
                    : 'border-gray-300'
                }`}>
                <option value=''>All categories</option>
                {categories?.map(cat => (
                  <option
                    key={cat.id}
                    value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <FormInput
          label='Date From'
          type='date'
          register={register('dateFrom')}
          error={errors.dateFrom?.message}
        />

        <FormInput
          label='Date To'
          type='date'
          register={register('dateTo')}
          error={errors.dateTo?.message}
        />

        <div className='sm:col-span-2 md:col-span-3 lg:col-span-5 flex justify-end mt-2'>
          <button
            type='submit'
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};
