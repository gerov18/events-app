import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organiser } from '../../types/Organiser';

interface OrganiserState {
  organiser: Organiser | null;
  token: string | null;
}

const initialState: OrganiserState = {
  organiser: null,
  token: null,
};

const organiserSlice = createSlice({
  name: 'organiser',
  initialState,
  reducers: {
    setOrganiserCredentials: (
      state,
      action: PayloadAction<{ organiser: Organiser; token: string }>
    ) => {
      state.organiser = action.payload.organiser;
      state.token = action.payload.token;
    },
    clearOrganiserState: state => {
      state.organiser = null;
      state.token = null;
    },
    setOrganiserData: (state, action: PayloadAction<Organiser>) => {
      state.organiser = action.payload;
    },
  },
});

export const {
  setOrganiserCredentials,
  clearOrganiserState,
  setOrganiserData,
} = organiserSlice.actions;

export default organiserSlice.reducer;
