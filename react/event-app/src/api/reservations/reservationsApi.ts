// src/api/reservations/reservationsApi.ts
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
  tagTypes: ['Reservations'],
  endpoints: builder => ({
    getMyReservations: builder.query<Reservation[], void>({
      query: () => '/users/me/reservations',
      providesTags: ['Reservations'],
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
      invalidatesTags: ['Reservations'],
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

    cancelReservation: builder.mutation<void, number>({
      query: id => ({
        url: `/users/me/reservations/${id}`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Reservations', id }],
    }),
  }),
});

export const {
  useGetMyReservationsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useCancelReservationMutation,
} = reservationsApi;
