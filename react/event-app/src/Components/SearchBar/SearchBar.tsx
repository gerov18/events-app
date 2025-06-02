// src/Components/SearchBar/SearchBar.tsx

import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';
import { Category } from '../../types/Category';
import {
  useGetCategoriesQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';
import { FormInput } from '../FormInput/FormInput';
import { FormSelect } from '../FormSelect/FormSelect';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(...args), delay);
  };
}

interface MapboxFeature {
  place_name: string;
  text: string;
  center?: [number, number];
}

type FormValues = {
  keyword: string;
  city: string;
  categoryId: number | '';
  dateFrom: string;
  dateTo: string;
};

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      keyword: '',
      city: '',
      categoryId: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const keyword = watch('keyword');
  const cityInput = watch('city');
  const categoryId = watch('categoryId');
  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');

  const { data: categories } = useGetCategoriesQuery(undefined);

  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] =
    React.useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const fetchCitySuggestions = useMemo(() => {
    return debounce((query: string) => {
      if (!MAPBOX_TOKEN) return;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const encoded = encodeURIComponent(query);
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?` +
        `access_token=${MAPBOX_TOKEN}&types=place&limit=5&language=en`;

      fetch(url, { signal: controller.signal })
        .then(async res => {
          if (!res.ok) throw new Error(`Mapbox ${res.statusText}`);
          const data = (await res.json()) as { features: MapboxFeature[] };
          const cityNames = data.features.map(feat => feat.place_name);
          const unique = Array.from(new Set(cityNames)).filter(Boolean);
          setSuggestions(unique);
        })
        .catch(err => {
          if (err.name !== 'AbortError') console.error(err);
        });
    }, 300);
  }, [MAPBOX_TOKEN]);

  useEffect(() => {
    const q = cityInput.trim();
    if (q.length >= 2) {
      fetchCitySuggestions(q);
    } else {
      setSuggestions([]);
      abortControllerRef.current?.abort();
    }
  }, [cityInput, fetchCitySuggestions]);

  const hasFilter =
    keyword.trim() !== '' ||
    cityInput.trim() !== '' ||
    categoryId !== '' ||
    dateFrom !== '' ||
    dateTo !== '';

  const {
    data: events = [],
    isLoading,
    isError,
  } = useGetEventsQuery(
    {
      keyword: keyword.trim() || undefined,
      city: cityInput.trim() || undefined,
      categoryId: categoryId === '' ? undefined : Number(categoryId),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      take: 4,
    },
    { skip: !hasFilter }
  );

  const onSeeMore = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (cityInput.trim()) params.append('city', cityInput.trim());
    if (categoryId !== '') params.append('categoryId', String(categoryId));
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    navigate(`/search?${params.toString()}`);
  };

  const onReset = () => {
    reset();
    setSuggestions([]);
  };

  return (
    <div className='space-y-8 px-4 md:px-8 lg:px-16'>
      <div className='text-center mt-8'>
        <h2 className='text-4xl font-extrabold text-gray-900 mb-2 animate-fadeIn'>
          Discover Events Near You
        </h2>
        <p className='text-gray-500 animate-fadeIn'>
          Filter by keywords, location, category, or date to find your next
          adventure.
        </p>
      </div>

      <div className='bg-white shadow-lg rounded-xl p-6 transition-all hover:shadow-2xl'>
        <form
          onSubmit={e => e.preventDefault()}
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <FormInput
            label='Keyword'
            type='text'
            register={register('keyword')}
            error={errors.keyword?.message}
          />

          <div className='relative'>
            <label className='block text-sm font-medium mb-1'>City</label>
            <input
              {...register('city', {
                onBlur: () => setIsSuggestionsOpen(false),
              })}
              type='text'
              onFocus={() => setIsSuggestionsOpen(true)}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-indigo-300 focus:outline-none transition duration-200 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <ul
              className={`absolute z-20 w-full bg-white border border-gray-200 rounded-md mt-1 overflow-auto shadow-md transition-[max-height] duration-300 ease-in-out ${
                isSuggestionsOpen ? 'max-h-44' : 'max-h-0'
              }`}>
              {suggestions.map(name => (
                <li
                  key={name}
                  onClick={() => {
                    setValue('city', name, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setSuggestions([]);
                  }}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200'>
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <FormSelect
            label='Category'
            register={register('categoryId')}
            options={
              categories?.map(cat => ({
                value: cat.id,
                label: cat.name,
              })) || []
            }
            error={errors.categoryId?.message}
          />

          <div>
            <label className='block text-sm font-medium mb-1'>Date From</label>
            <input
              {...register('dateFrom')}
              type='date'
              className={`w-full border rounded-lg px-4 py-2 focus:ring-indigo-300 focus:outline-none transition duration-200 ${
                errors.dateFrom ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Date To</label>
            <input
              {...register('dateTo')}
              type='date'
              className={`w-full border rounded-lg px-4 py-2 focus:ring-indigo-300 focus:outline-none transition duration-200 ${
                errors.dateTo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        </form>

        <div className='mt-6 flex justify-end space-x-4'>
          <button
            onClick={onReset}
            className='cursor-pointer px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-transform transform hover:scale-105 active:scale-95'>
            Reset Filters
          </button>
        </div>

        <div
          className={`mt-6 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            hasFilter ? 'max-h-[2000px]' : 'max-h-0'
          }`}>
          {isLoading ? (
            <h5 className='text-center text-gray-500 mt-6 animate-pulse'>
              Loading events…
            </h5>
          ) : isError ? (
            <h5 className='text-center text-red-600 mt-6 animate-shake'>
              Error fetching events.
            </h5>
          ) : events.length === 0 ? (
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center animate-fadeIn'>
              <p className='text-yellow-700 font-semibold mb-2'>
                No events found
              </p>
              <p className='text-sm text-yellow-600'>
                Try broadening your search or adjusting filters.
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {events.map((ev: Event) => (
                  <div className='transform transition duration-300 hover:scale-105 hover:shadow-xl'>
                    <EventCard
                      key={ev.id}
                      event={ev}
                    />
                  </div>
                ))}
              </div>
              <div className='flex justify-end mt-6'>
                <button
                  onClick={onSeeMore}
                  className='cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95'>
                  See More Events
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
