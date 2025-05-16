import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from './authApi';
import { User } from '../../types/User';

interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: state => {
      state.user = null;
      state.token = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, logoutUser, setUser } = authSlice.actions;
export default authSlice.reducer;
