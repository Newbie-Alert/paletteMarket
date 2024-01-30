import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../api/supabase/products';

interface CountState {
  myItems: Product[];
  purchasedItems: Product[];
  favItems: Product[];
  myPosts: Product[];
  favPosts: Product[];
}

// slice 초기값 정의
const initialState: CountState = {
  myItems: [],
  purchasedItems: [],
  favItems: [],
  myPosts: [],
  favPosts: []
};

// TODO: 이름은 왜 count?
export const countSlice = createSlice({
  name: 'count',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMyItem: (state: CountState, action: PayloadAction<Product[]>) => {
      state.myItems = action.payload;
    },
    setPurchasedItem: (state: CountState, action: PayloadAction<Product[]>) => {
      state.purchasedItems = action.payload;
    },
    setFavItem: (state: CountState, action: PayloadAction<Product[]>) => {
      state.favItems = action.payload;
    },
    setMyPost: (state: CountState, action: PayloadAction<Product[]>) => {
      state.myPosts = action.payload;
    },
    setFavPost: (state: CountState, action: PayloadAction<Product[]>) => {
      state.favPosts = action.payload;
    }
  }
});

export const {
  setMyItem,
  setPurchasedItem,
  setFavItem,
  setMyPost,
  setFavPost
} = countSlice.actions;
export default countSlice.reducer;
