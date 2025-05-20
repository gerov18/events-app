import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Organiser, CreateOrganiserInput } from '../../types/Organiser';
import { OrganiserDeleteInput } from './organiserSchema';

export type LoginResponse = {
  token: string;
  organiser: Organiser;
};
export type LoginRequest = {
  email: string;
  password: string;
};
export type RegisterResponse = {
  token: string;
  organiser: Organiser;
};

export const organisersApi = createApi({
  reducerPath: 'organisersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008/organiser',
    credentials: 'include',
    prepareHeaders: headers => {
      return headers;
    },
  }),
  tagTypes: ['Organisers'],
  endpoints: builder => ({
    registerOrganiser: builder.mutation<RegisterResponse, CreateOrganiserInput>(
      {
        query: organiser => ({
          url: '/register',
          method: 'POST',
          body: organiser,
        }),
      }
    ),
    loginOrganiser: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutOrganiser: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    getOrganisers: builder.query<Organiser[], void>({
      query: () => '/all',
      providesTags: ['Organisers'],
    }),
    getOrganiserById: builder.query<Organiser, number>({
      query: id => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Organisers', id }],
    }),
    createOrganiser: builder.mutation<Organiser, CreateOrganiserInput>({
      query: organiser => ({
        url: '/',
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
        url: `/${id}/edit`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Organisers', id },
      ],
    }),
    deleteOrganiser: builder.mutation<
      void,
      { id: number; data: OrganiserDeleteInput }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/delete`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Organisers'],
    }),
  }),
});

export const {
  useGetOrganisersQuery,
  useGetOrganiserByIdQuery,
  useCreateOrganiserMutation,
  useUpdateOrganiserMutation,
  useDeleteOrganiserMutation,
  useRegisterOrganiserMutation,
  useLoginOrganiserMutation,
  useLogoutOrganiserMutation,
} = organisersApi;
