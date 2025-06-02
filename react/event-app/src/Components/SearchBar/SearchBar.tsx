// src/Components/SearchBar/SearchBar.tsx

import React, { useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';
import { Category } from '../../types/Category';
import {
  useGetCategoriesQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';
import { FormInput } from '../FormInput/FormInput'; // your custom component

// Debounce helper: waits `delay` ms after last call
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(...args), delay);
  };
}

// Shape of a Mapbox Geocoding response feature (for cities)
interface MapboxFeature {
  place_name: string; // e.g. "Sofia, Bulgaria"
  text: string; // e.g. "Sofia"
  center?: [number, number];
}

type FormValues = {
  keyword: string;
  city: string; // raw user input / chosen suggestion
  categoryId: number | ''; // empty string means “all”
  dateFrom: string; // ISO "YYYY-MM-DD"
  dateTo: string; // ISO "YYYY-MM-DD"
  limit: number | ''; // empty string means undefined
};

const SearchBar: React.FC = () => {
  // ─── 1) Initialize React Hook Form ─────────────────────────────────────────────────────
  const {
    register,
    control,
    watch,
    setValue,
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

  // Watch all fields (RHF will re-render when any watched field changes)
  const keyword = watch('keyword');
  const cityInput = watch('city');
  const categoryId = watch('categoryId');
  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');

  // ─── 2) Fetch categories for dropdown (optional) ────────────────────────────────────────
  const { data: categories } = useGetCategoriesQuery(undefined);

  // ─── 3) Mapbox Autocomplete (based on cityInput) ─────────────────────────────────────────
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] =
    React.useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Debounced fetch function for Mapbox
  const fetchCitySuggestions = useMemo(() => {
    return debounce((query: string) => {
      if (!MAPBOX_TOKEN) {
        console.error('Missing Mapbox token in VITE_MAPBOX_TOKEN');
        return;
      }
      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Encode user input
      const encoded = encodeURIComponent(query);
      // Add `language=en` so results are in English
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?` +
        `access_token=${MAPBOX_TOKEN}` +
        `&types=place&limit=5&language=en`;

      fetch(url, { signal: controller.signal })
        .then(async res => {
          if (!res.ok) throw new Error(`Mapbox ${res.statusText}`);
          const data = (await res.json()) as { features: MapboxFeature[] };

          // Use `place_name` (e.g. "Sofia, Bulgaria") instead of `text`
          const cityNames = data.features.map(feat => feat.place_name);
          const unique = Array.from(new Set(cityNames)).filter(Boolean);
          setSuggestions(unique);
        })
        .catch(err => {
          if (err.name !== 'AbortError') console.error('Mapbox error:', err);
        });
    }, 400);
  }, [MAPBOX_TOKEN]);

  // Trigger fetch whenever cityInput changes
  useEffect(() => {
    const q = cityInput.trim();
    if (q.length >= 2) {
      fetchCitySuggestions(q);
    } else {
      setSuggestions([]);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [cityInput, fetchCitySuggestions]);

  // ─── 4) Call RTK Query with all filters ―───────────────────────────────────────────────
  // Pass city only if it exactly matches one of the suggestions
  const {
    data: events,
    isLoading,
    isError,
  } = useGetEventsQuery({
    keyword: keyword.trim() || undefined,
    city: cityInput.trim() || undefined,
    categoryId: categoryId === '' ? undefined : Number(categoryId),
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    take: 5,
  });

  // ─── 5) Render │──────────────────────────────────────────────────────────────────────────
  return (
    <div className='space-y-6'>
      {/* ── FILTER FORM ── */}
      <form
        onSubmit={e => e.preventDefault()}
        className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-white shadow rounded'>
        {/* Keyword */}
        <div>
          <FormInput
            label='Keyword'
            type='text'
            register={register('keyword')}
            error={errors.keyword?.message}
          />
        </div>

        {/* City input with Mapbox suggestions */}
        <div className='relative'>
          <FormInput
            label='City'
            type='text'
            register={{
              ...register('city', {
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                  setIsSuggestionsOpen(false);
                },
              }),
              onFocus: () => setIsSuggestionsOpen(true),
            }}
            error={errors.city?.message}
          />
          {suggestions.length > 0 && isSuggestionsOpen && (
            <ul className='absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto'>
              {suggestions.map(name => (
                <li
                  key={name}
                  onClick={() => {
                    // When the user picks a suggestion, set "city" to full place_name
                    setValue('city', name, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setSuggestions([]);
                  }}
                  className='px-2 py-1 hover:bg-gray-100 cursor-pointer'>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category dropdown */}
        <div>
          <label className='block text-sm font-medium mb-1'>Category</label>
          <Controller
            name='categoryId'
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className='w-full border rounded px-2 py-1 focus:ring-indigo-300'>
                <option value=''>All</option>
                {categories?.map((cat: Category) => (
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

        {/* Date From */}
        <div>
          <FormInput
            label='Date From'
            type='date'
            register={register('dateFrom')}
            error={errors.dateFrom?.message}
          />
        </div>

        {/* Date To */}
        <div>
          <FormInput
            label='Date To'
            type='date'
            register={register('dateTo')}
            error={errors.dateTo?.message}
          />
        </div>
      </form>

      {/* ── SEARCH RESULTS ── */}
      {isLoading ? (
        <h5 className='text-center'>Loading events…</h5>
      ) : isError ? (
        <h5 className='text-center text-red-600'>Error fetching events.</h5>
      ) : (
        <>
          {!events || events.length === 0 ? (
            <h5 className='text-center text-gray-600'>No events found.</h5>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4'>
              {events.map((ev: Event) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;
