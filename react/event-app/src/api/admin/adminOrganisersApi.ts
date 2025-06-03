import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Organiser } from '../../types/Organiser';

export type AdminOrganiser = Organiser;

export const adminOrganiserApi = createApi({
  reducerPath: 'adminOrganiserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/admin',
    credentials: 'include',
  }),
  tagTypes: ['AdminOrganisers'],
  endpoints: builder => ({
    getOrganisers: builder.query<AdminOrganiser[], void>({
      query: () => '/organisers',
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'AdminOrganisers' as const, id })),
        { type: 'AdminOrganisers', id: 'LIST' },
      ],
    }),

    getOrganiserById: builder.query<AdminOrganiser, number>({
      query: id => `/organisers/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminOrganisers', id }],
    }),

    updateOrganiser: builder.mutation<
      AdminOrganiser,
      { id: number; data: Partial<AdminOrganiser> }
    >({
      query: ({ id, data }) => ({
        url: `/organisers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminOrganisers', id },
        { type: 'AdminOrganisers', id: 'LIST' },
      ],
    }),

    deleteOrganiser: builder.mutation<void, number>({
      query: id => ({
        url: `/organisers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminOrganisers', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrganisersQuery,
  useGetOrganiserByIdQuery,
  useUpdateOrganiserMutation,
  useDeleteOrganiserMutation,
} = adminOrganiserApi;
