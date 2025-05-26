import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Reservation } from '../../types/Reservation';

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Reservations', 'Events'],
  endpoints: builder => ({
    getUserReservations: builder.query<Reservation[], void>({
      query: () => '/users/me/reservations',
      providesTags: ['Reservations'],
    }),
    createReservation: builder.mutation<void, number>({
      query: eventId => ({
        url: `/events/${eventId}/reservations`,
        method: 'POST',
      }),
      invalidatesTags: ['Reservations', 'Events'],
    }),
    cancelReservation: builder.mutation<void, number>({
      query: id => ({
        url: `/reservations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reservations', 'Events'],
    }),
  }),
});

export const {
  useGetUserReservationsQuery,
  useCreateReservationMutation,
  useCancelReservationMutation,
} = reservationsApi;
