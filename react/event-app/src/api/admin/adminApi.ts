import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../types/User';
import { Organiser } from '../../types/Organiser';
import { RoleRequest } from '../../types/RoleRequest';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/',
    credentials: 'include',
  }),
  tagTypes: ['AdminUsers', 'AdminOrganisers'],
  endpoints: builder => ({
    deleteUserByAdmin: builder.mutation<void, number>({
      query: id => ({
        url: `/users/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteOrganiserByAdmin: builder.mutation<void, number>({
      query: id => ({
        url: `/organiser/${id}`,
        method: 'POST',
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
    updateUserRole: builder.mutation<
      User,
      { id: number; role: 'ADMIN' | 'ORGANISER' | 'USER' }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
    }),
    getRoleRequests: builder.query<RoleRequest[], void>({
      query: () => '/role-requests',
    }),
    handleRoleRequest: builder.mutation<
      RoleRequest,
      { id: number; status: 'ACCEPTED' | 'REJECTED' }
    >({
      query: ({ id, status }) => ({
        url: `/role-requests/${id}`,
        method: 'PATCH',
        body: { status },
      }),
    }),
    promoteToAdmin: builder.mutation<
      void,
      { id: number; role: 'ADMIN' | 'USER' }
    >({
      query: id => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useDeleteUserByAdminMutation,
  useDeleteOrganiserByAdminMutation,
  useGetAllUsersQuery,
  useGetAllOrganisersQuery,
  useGetRoleRequestsQuery,
  useHandleRoleRequestMutation,
  usePromoteToAdminMutation,
  useUpdateUserRoleMutation,
} = adminApi;
