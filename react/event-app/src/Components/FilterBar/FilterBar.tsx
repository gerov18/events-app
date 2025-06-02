import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../api/events/eventApi';

type FilterValues = {
  keyword: string;
  city: string;
  categoryId: number | '';
  dateFrom: string;
  dateTo: string;
};

const FilterBar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: categories } = useGetCategoriesQuery(undefined);

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Keyword</label>
          <input
            {...register('keyword')}
            type='text'
            className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-300 focus:outline-none ${
              errors.keyword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>City</label>
          <input
            {...register('city')}
            type='text'
            className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-300 focus:outline-none ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Category</label>
          <Controller
            name='categoryId'
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-300 focus:outline-none ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
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

        <div>
          <label className='block text-sm font-medium mb-1'>Date From</label>
          <input
            {...register('dateFrom')}
            type='date'
            className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-300 focus:outline-none ${
              errors.dateFrom ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Date To</label>
          <input
            {...register('dateTo')}
            type='date'
            className={`w-full border rounded-lg px-3 py-2 focus:ring-indigo-300 focus:outline-none ${
              errors.dateTo ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>

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

export default FilterBar;
