import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './auth/authApi';
import authReducer from './auth/authSlice';
import eventReducer from './events/eventsSlice';
import organiserReducer from './organiser/organiserSlice';
import { eventsApi } from './events/eventApi';
import { organisersApi } from './organiser/organiserApi';
import { meApi } from './me/meApi';
import { adminApi } from './admin/adminApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [organisersApi.reducerPath]: organisersApi.reducer,
    [meApi.reducerPath]: meApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    organiser: organiserReducer,
    auth: authReducer,
    event: eventReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(meApi.middleware)
      .concat(organisersApi.middleware)
      .concat(adminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
