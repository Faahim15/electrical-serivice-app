import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReminderDetails {
  id: string;
  title: string;
  date: string;
  frequency: string;
  status: string;
  key: string;
}

interface ReminderDetailsState {
  selectedReminder: ReminderDetails | null;
}

const initialState: ReminderDetailsState = {
  selectedReminder: null,
};

const reminderDetailsSlice = createSlice({
  name: "reminderDetails",
  initialState,
  reducers: {
    setSelectedReminder: (state, action: PayloadAction<ReminderDetails>) => {
      state.selectedReminder = action.payload;
    },
    clearSelectedReminder: (state) => {
      state.selectedReminder = null;
    },
  },
});

export const { setSelectedReminder, clearSelectedReminder } =
  reminderDetailsSlice.actions;
export default reminderDetailsSlice.reducer;
