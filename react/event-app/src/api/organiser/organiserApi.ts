import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Organiser, CreateOrganiserInput } from '../../types/Organiser';

export const organisersApi = createApi({
  reducerPath: 'organisersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/api',
    credentials: 'include',
  }),
  tagTypes: ['Organisers'],
  endpoints: builder => ({
    getOrganisers: builder.query<Organiser[], void>({
      query: () => '/organisers',
      providesTags: ['Organisers'],
    }),
    getOrganiserById: builder.query<Organiser, number>({
      query: id => `/organisers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Organisers', id }],
    }),
    createOrganiser: builder.mutation<Organiser, CreateOrganiserInput>({
      query: organiser => ({
        url: '/organisers',
        method: 'POST',
        body: organiser,
      }),
      invalidatesTags: ['Organisers'],
    }),
    updateOrganiser: builder.mutation<
      Organiser,
      { id: number; data: CreateOrganiserInput }
    >({
      query: ({ id, data }) => ({
        url: `/organisers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Organisers', id },
      ],
    }),
    deleteOrganiser: builder.mutation<void, number>({
      query: id => ({
        url: `/organisers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Organisers', id }],
    }),
  }),
});

export const {
  useGetOrganisersQuery,
  useGetOrganiserByIdQuery,
  useCreateOrganiserMutation,
  useUpdateOrganiserMutation,
  useDeleteOrganiserMutation,
} = organisersApi;
