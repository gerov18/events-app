import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateReservationInput,
  UpdateReservationInput,
} from './reservationsSchema';
import { Reservation } from '../../types/Reservation';

export const reservationsApi = createApi({
  reducerPath: 'reservationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Reservations', 'Event'],
  endpoints: builder => ({
    getMyReservations: builder.query<Reservation[], void>({
      query: () => '/users/me/reservations',
      providesTags: ['Reservations'],
    }),
    getUserReservations: builder.query<Reservation[], number>({
      query: userId => `/users/${userId}/reservations`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(r => ({ type: 'Reservations' as const, id: r.id })),
              { type: 'Reservations', id: 'LIST' },
            ]
          : [{ type: 'Reservations', id: 'LIST' }],
    }),
    getReservationById: builder.query<
      Reservation,
      { userId: number; reservationId: number }
    >({
      query: ({ userId, reservationId }) =>
        `/users/${userId}/reservations/${reservationId}`,
      providesTags: ['Reservations'],
    }),

    createReservation: builder.mutation<
      Reservation,
      { eventId: number; quantity?: number }
    >({
      query: ({ eventId, quantity }) => ({
        url: `/events/${eventId}/reservations`,
        method: 'POST',
        body: { quantity },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: 'Event', id: eventId },
      ],
    }),

    updateReservation: builder.mutation<
      Reservation,
      { reservationId: number; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }
    >({
      query: ({ reservationId, status }) => ({
        url: `/users/me/reservations/${reservationId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_r, _e, { reservationId }) => [
        { type: 'Reservations', id: reservationId },
      ],
    }),

    cancelReservation: builder.mutation<
      void,
      { userId: number; resId: number }
    >({
      query: ({ userId, resId }) => ({
        url: `/users/${userId}/reservations/${resId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Reservations'],
    }),
  }),
});

export const {
  useGetMyReservationsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useCancelReservationMutation,
  useGetUserReservationsQuery,
} = reservationsApi;
