import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from './authApi';
import { LoginResponse as OrganiserLoginResponse } from '../organiser/organiserApi';
import { User } from '../../types/User';
import { MeResponse } from '../me/meApi';

type AuthState =
  | {
      initialized: boolean;
      userType: 'user' | 'admin' | null;
      user: LoginResponse['user'] | null;
      token: string | null;
    }
  | {
      initialized: boolean;
      userType: 'organiser' | null;
      user: OrganiserLoginResponse['organiser'] | null;
      token: string | null;
    };

const initialState: AuthState = {
  userType: null,
  user: null,
  token: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (_state, action: PayloadAction<string>): AuthState => {
      return {
        ...initialState,
        userType: null,
        user: null,
        token: action.payload,
        initialized: false,
      };
    },

    setCredentials: (
      state,
      action: PayloadAction<
        | {
            userType: 'user';
            user: LoginResponse['user'];
            token: string;
            initialized: boolean;
          }
        | {
            userType: 'organiser';
            user: OrganiserLoginResponse['organiser'];
            token: string;
            initialized: boolean;
          }
      >
    ) => {
      state.userType = action.payload.userType;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUserState: state => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.initialized = false;
    },
    setМе: (
      state,
      action: PayloadAction<
        | {
            userType: 'user';
            user: LoginResponse['user'] | null;
          }
        | {
            userType: 'admin';
            user: LoginResponse['user'] | null;
          }
        | {
            userType: 'organiser';
            user: OrganiserLoginResponse['organiser'] | null;
          }
      >
    ) => {
      state.initialized = true;
      state.userType = action.payload.userType;
      state.user = action.payload.user;
    },
  },
});

export const { setCredentials, clearUserState, setМе, setToken } =
  authSlice.actions;
export default authSlice.reducer;
