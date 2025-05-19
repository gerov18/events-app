import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './auth/authApi';
import authReducer from './auth/authSlice';
import eventReducer from './events/eventsSlice';
import { eventsApi } from './events/eventApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    auth: authReducer,
    event: eventReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
