import React from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks/reduxBase';

const HowtoUseRedux = () => {
  // count 라는 슬라이스를 가져올 때 /reduxHooks/reduxBas에 만들어둔 커스텀 훅(useAppSelector)로 가져온다.
  // const count = useAppSelector((state) => state.counter.value);

  // countSlice의 reducer를 사용하고 싶으면 useAppdisPatch를 가져와서 사용한다
  const dispatch = useAppDispatch();
  return <div>reduxExample</div>;
};

export default HowtoUseRedux;
