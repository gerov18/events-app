import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../../types/Category';
import { CreateEventInput } from '../../types/Event';
import { UpdateEventInput } from './eventSchema';
import { Event } from '../../types/Event';
import { Image } from '../../types/Image';

export interface Filters {
  keyword?: string;
  city?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  take?: number;
  createdBy?: number;
}

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
    getEvents: builder.query<Event[], Filters>({
      query: filters => {
        const params = new URLSearchParams();

        if (filters.keyword && filters.keyword.trim() !== '') {
          params.append('keyword', filters.keyword.trim());
        }

        if (filters.city && filters.city.trim() !== '') {
          params.append('city', filters.city.trim());
        }

        if (filters.categoryId !== undefined) {
          params.append('categoryId', String(filters.categoryId));
        }

        if (filters.dateFrom && filters.dateFrom.trim() !== '') {
          params.append('dateFrom', filters.dateFrom);
        }

        if (filters.dateTo && filters.dateTo.trim() !== '') {
          params.append('dateTo', filters.dateTo);
        }

        if (filters.take !== undefined) {
          params.append('limit', String(filters.take));
        }

        if (filters.createdBy !== undefined) {
          params.append('createdBy', String(filters.createdBy));
        }

        return {
          url: `/events${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
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
      { eventId: number; files: File }
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
    deleteEventImage: builder.mutation<
      { message: string },
      { eventId: number; imageId: number }
    >({
      query: ({ eventId, imageId }) => ({
        url: `/events/${eventId}/images/${imageId}`,
        method: 'POST',
      }),
      invalidatesTags: (_res, _err, { eventId }) => [
        { type: 'Images' as const, id: eventId },
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
  useGetEventsQuery,
  useDeleteEventImageMutation,
} = eventsApi;
