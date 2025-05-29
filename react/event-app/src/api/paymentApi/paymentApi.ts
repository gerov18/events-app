import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5008',
    credentials: 'include',
  }),
  endpoints: builder => ({
    createPayment: builder.mutation<any, { id: string; amount: number }>({
      query: data => ({
        url: '/payment',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
