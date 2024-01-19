import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

// slice의 타입 정의
interface CounterState {
  value: number;
}

// slice 초기값 정의
const initialState: CounterState = {
  value: 0
};

// reducer
export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // reducer의 인자로 action이 들어간다면 action의 타입을 정의하여 함수 선언
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

// 생성한 reducer export
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 컴포넌트에서 countSlice를 가져오고 싶을 때 사용 할 Hook을 export
//  export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
