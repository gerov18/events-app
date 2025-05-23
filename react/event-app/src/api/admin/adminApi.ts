import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/User';
import { Organiser } from '../../types/Organiser';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/admin',
    credentials: 'include',
  }),
  tagTypes: ['AdminUsers', 'AdminOrganisers'],
  endpoints: builder => ({
    deleteUserByAdmin: builder.mutation<void, number>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteOrganiserByAdmin: builder.mutation<void, number>({
      query: id => ({
        url: `/organiser/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminOrganisers'],
    }),

    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['AdminUsers'],
    }),
    getAllOrganisers: builder.query<Organiser[], void>({
      query: () => '/organiser/all',
      providesTags: ['AdminOrganisers'],
    }),
  }),
});

export const {
  useDeleteUserByAdminMutation,
  useDeleteOrganiserByAdminMutation,
  useGetAllUsersQuery,
  useGetAllOrganisersQuery,
} = adminApi;
