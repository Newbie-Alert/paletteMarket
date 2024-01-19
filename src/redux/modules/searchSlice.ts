import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Communityy, UsedItem } from '../../pages/usedtypes';

interface SearchState {
  searchQuery: string;
  searchResults: {
    usedItemResults: UsedItem[];
    communityResults: Communityy[];
  };
}

const initialState: SearchState = {
  searchQuery: '',
  searchResults: {
    usedItemResults: [],
    communityResults: []
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (
      state,
      action: PayloadAction<{
        usedItemResults: UsedItem[];
        communityResults: Communityy[];
      }>
    ) => {
      state.searchResults = action.payload;
    }
  }
});

export const { setSearchQuery, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
