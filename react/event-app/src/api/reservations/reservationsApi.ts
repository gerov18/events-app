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
        url: `/reservations/${id}/edit`,
        method: 'PATCH',
        body: { status: 'CANCELLED' },
      }),
      invalidatesTags: ['Reservations', 'Events'],
    }),

    deleteReservation: builder.mutation<void, number>({
      query: id => ({
        url: `/reservations/${id}/delete`,
        method: 'POST',
      }),
      invalidatesTags: ['Reservations', 'Events'],
    }),
    getReservationById: builder.query<Reservation, number>({
      query: id => `/reservations/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Reservations', id }],
    }),
  }),
});

export const {
  useGetUserReservationsQuery,
  useCreateReservationMutation,
  useCancelReservationMutation,
  useGetReservationByIdQuery,
} = reservationsApi;
