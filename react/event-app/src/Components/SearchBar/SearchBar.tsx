// src/Components/SearchBar/SearchBar.tsx

import React, { useState, useMemo } from 'react';

import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';
import { Category } from '../../types/Category';
import {
  useGetCategoriesQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';

const ALL_CITIES = [
  'Sofia',
  'Plovdiv',
  'Varna',
  'Burgas',
  'Ruse',
  // …add any other cities you want
];

const SearchBar: React.FC = () => {
  // 1) Local state for all filters:
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState(''); // "YYYY-MM-DD"
  const [dateTo, setDateTo] = useState(''); // "YYYY-MM-DD"
  const [limit, setLimit] = useState<number | undefined>(20);

  // 2) Optionally fetch category list for a dropdown:
  const { data: categories } = useGetCategoriesQuery(undefined);

  // 3) City suggestions as the user types:
  const filteredCities = useMemo(() => {
    const lc = city.trim().toLowerCase();
    if (!lc) return [];
    return ALL_CITIES.filter(c => c.toLowerCase().startsWith(lc)).slice(0, 5);
  }, [city]);

  // 4) Fetch events as soon as any filter changes:
  const {
    data: events,
    isLoading,
    isError,
  } = useGetEventsQuery({
    keyword: keyword.trim() || undefined,
    city: city.trim() || undefined,
    categoryId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    take: limit,
  });

  return (
    <div className='space-y-6'>
      {/* ── Filters Form ── */}
      <form
        onSubmit={e => {
          e.preventDefault();
          // We don’t need to do anything here because RTK Query is already watching our state.
        }}
        className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-white shadow rounded'>
        {/* Keyword */}
        <div>
          <label className='block text-sm font-medium mb-1'>Keyword</label>
          <input
            type='text'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder='Search title/description'
            className='w-full border rounded px-2 py-1 focus:ring-indigo-300'
          />
        </div>

        {/* City (Location) with suggestions */}
        <div className='relative'>
          <label className='block text-sm font-medium mb-1'>City</label>
          <input
            type='text'
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder='Type a city'
            className='w-full border rounded px-2 py-1 focus:ring-indigo-300'
            autoComplete='off'
          />
          {filteredCities.length > 0 && (
            <ul className='absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-auto'>
              {filteredCities.map(c => (
                <li
                  key={c}
                  onClick={() => setCity(c)}
                  className='px-2 py-1 hover:bg-gray-100 cursor-pointer'>
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category dropdown */}
        <div>
          <label className='block text-sm font-medium mb-1'>Category</label>
          <select
            value={categoryId ?? ''}
            onChange={e => {
              const v = e.target.value;
              setCategoryId(v ? Number(v) : undefined);
            }}
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
        </div>

        {/* Date From */}
        <div>
          <label className='block text-sm font-medium mb-1'>Date From</label>
          <input
            type='date'
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className='w-full border rounded px-2 py-1 focus:ring-indigo-300'
          />
        </div>

        {/* Date To */}
        <div>
          <label className='block text-sm font-medium mb-1'>Date To</label>
          <input
            type='date'
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className='w-full border rounded px-2 py-1 focus:ring-indigo-300'
          />
        </div>

        {/* Limit */}
        <div className='sm:col-span-2 lg:col-span-1'>
          <label className='block text-sm font-medium mb-1'>Limit</label>
          <input
            type='number'
            min={1}
            value={limit ?? ''}
            onChange={e =>
              setLimit(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder='e.g. 20'
            className='w-full border rounded px-2 py-1 focus:ring-indigo-300'
          />
        </div>
      </form>

      {/* ── Results ── */}
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
