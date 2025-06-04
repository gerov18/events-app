import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/User';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Users'],
  endpoints: builder => ({
    getUserById: builder.query<User, number>({
      query: id => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    deleteUser: builder.mutation<void, number>({
      query: id => ({
        url: `/admin/users/${id}/delete`,
        method: 'POST',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}/edit`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi;
