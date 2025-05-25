import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../../types/Category';
import { CreateEventInput } from '../../types/Event';
import { UpdateEventInput } from './eventSchema';
import { Event } from '../../types/Event';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Events', 'Categories'],
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEventById: builder.query<Event, number>({
      query: id => `/events/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Events', id }],
    }),
    createEvent: builder.mutation<Event, CreateEventInput>({
      query: data => ({
        url: '/events/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<
      Event,
      { id: number; data: UpdateEventInput }
    >({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} = eventsApi;
