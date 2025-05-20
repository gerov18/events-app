import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types/Event';

interface EventsState {
  selectedEvent: Event | null;
  filterCategoryId: number | null;
  isModalOpen: boolean;
}

const initialState: EventsState = {
  selectedEvent: null,
  filterCategoryId: null,
  isModalOpen: false,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setSelectedEvent(state, action: PayloadAction<Event | null>) {
      state.selectedEvent = action.payload;
    },
    setFilterCategory(state, action: PayloadAction<number | null>) {
      state.filterCategoryId = action.payload;
    },
    toggleModal(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    resetEventState() {
      return initialState;
    },
  },
});

export const {
  setSelectedEvent,
  setFilterCategory,
  toggleModal,
  resetEventState,
} = eventSlice.actions;

export default eventSlice.reducer;
