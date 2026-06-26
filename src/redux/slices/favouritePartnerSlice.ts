import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritePartnersState {
  favorites: Record<string, boolean>;
}

const initialState: FavoritePartnersState = {
  favorites: {},
};

const favoritePartnersSlice = createSlice({
  name: "favoritePartners",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.favorites[id] = !state.favorites[id];
    },
    setFavorite: (
      state,
      action: PayloadAction<{ partnerId: string; value: boolean }>,
    ) => {
      state.favorites[action.payload.partnerId] = action.payload.value;
    },
  },
});

export const { toggleFavorite, setFavorite } = favoritePartnersSlice.actions;
export default favoritePartnersSlice.reducer;

// Selector
export const selectIsFavorite = (
  state: { favoritePartners: FavoritePartnersState },
  partnerId: string,
) => !!state.favoritePartners.favorites[partnerId];
