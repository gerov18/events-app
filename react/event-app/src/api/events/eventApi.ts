import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Event } from '../../types/Event';
import { EventInput } from './eventSchema';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Events'],
  endpoints: builder => ({
    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEvent: builder.query<Event, number>({
      query: id => `/events/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Events', id }],
    }),
    createEvent: builder.mutation<Event, EventInput>({
      query: newEvent => ({
        url: '/events/create',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<Event, { id: number; data: EventInput }>({
      query: ({ id, data }) => ({
        url: `/events/edit/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Events', id }],
    }),
    deleteEvent: builder.mutation<void, number>({
      query: id => ({
        url: `/events/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Events', id }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
