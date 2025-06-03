import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Event } from '../../types/Event';

export const adminEventsApi = createApi({
  reducerPath: 'adminEventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/admin',
    credentials: 'include',
  }),
  tagTypes: ['AdminEvent'],
  endpoints: builder => ({
    getAdminEventById: builder.query<Event, number>({
      query: id => `events/${id}`,
      providesTags: (result, error, id) => [
        { type: 'AdminEvent' as const, id },
      ],
    }),
    updateAdminEvent: builder.mutation<Event, Partial<Event> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `events/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AdminEvent', id }],
    }),
    deleteAdminEvent: builder.mutation<{ message: string }, number>({
      query: id => ({
        url: `events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'AdminEvent', id }],
    }),
  }),
});

export const {
  useGetAdminEventByIdQuery,
  useUpdateAdminEventMutation,
  useDeleteAdminEventMutation,
} = adminEventsApi;
