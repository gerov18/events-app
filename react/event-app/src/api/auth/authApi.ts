import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateUserInput, User } from '../../types/User';
import { DeleteInput } from './authSchema';

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
    getMe: builder.query<User, void>({
      query: () => '/me',
    }),
    deleteUser: builder.mutation<void, { id: number; data: DeleteInput }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/delete`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useRegisterMutation,
  useDeleteUserMutation,
} = authApi;
