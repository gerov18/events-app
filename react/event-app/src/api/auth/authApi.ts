import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateUserInput, User } from '../../types/User';
import { DeleteInput, UpdateUserInput } from './authSchema';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user?: User; //optional because of oauth login
};
export type RegisterResponse = {
  token: string;
  user: User;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    prepareHeaders: headers => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Users'],
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, CreateUserInput>({
      query: credentials => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    deleteUser: builder.mutation<void, DeleteInput>({
      query: credentials => ({
        url: `/users/me/delete`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, UpdateUserInput>({
      query: data => ({
        url: '/users/me/edit',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = authApi;
