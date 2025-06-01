import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Organiser } from '../../types/Organiser';
import { User } from '../../types/User';

export type MeResponse =
  | { type: 'user' | 'admin'; data: User }
  | { type: 'organiser'; data: Organiser };

export const meApi = createApi({
  reducerPath: 'meApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  endpoints: builder => ({
    getMe: builder.query<MeResponse, void>({
      query: () => '/me',
    }),
  }),
});

export const { useGetMeQuery } = meApi;
