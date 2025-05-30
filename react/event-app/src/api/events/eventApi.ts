import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../../types/Category';
import { CreateEventInput } from '../../types/Event';
import { UpdateEventInput } from './eventSchema';
import { Event } from '../../types/Event';
import { Image } from '../../types/Image';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  tagTypes: ['Events', 'Categories', 'Images'],
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query<Category, number>({
      query: id => `/categories/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Categories', id }],
    }),
    getEvents: builder.query<Event[], void>({
      query: () => '/events',
      providesTags: ['Events'],
    }),
    getEventById: builder.query<Event, number>({
      query: id => `/events/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Events', id }],
    }),
    createEvent: builder.mutation<Event, CreateEventInput>({
      query: data => ({
        url: '/events/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation<
      Event,
      { id: number; data: UpdateEventInput }
    >({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation<void, number>({
      query: id => ({
        url: `/events/${id}/delete`,
        method: 'POST',
      }),
      invalidatesTags: ['Events'],
    }),
    getEventImages: builder.query<Image[], number>({
      query: eventId => `/events/${eventId}/images`,
      providesTags: (_res, _err, eventId) => [
        { type: 'Images' as const, id: eventId },
      ],
    }),
    uploadEventImages: builder.mutation<
      Image[],
      { eventId: number; files: File[] }
    >({
      query: ({ eventId, files }) => {
        const fd = new FormData();
        files.forEach(f => fd.append('images', f));
        return {
          url: `/events/${eventId}/images`,
          method: 'POST',
          body: fd,
        };
      },
      invalidatesTags: (_res, _err, { eventId }) => [
        { type: 'Images' as const, id: eventId },
        { type: 'Events' as const, id: eventId },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventImagesQuery,
  useUploadEventImagesMutation,
} = eventsApi;
