import React from 'react';
import contextReducer from './useContextReducer';
import EConstants from './constants';

const enum EType {
  ADD,
  SUB,
  RESET,
}

const Home = () => {
  const { dispatch } = contextReducer.useContextReducer();

  const clickBtn = React.useCallback((type: EType) => {
    switch (type) {
      case EType.ADD:
        dispatch((s) => {
          // s原始值
          console.log('s', s);
          return {
            type: EConstants.CHANGE_DATA,
            payload: s.data + 1,
          };
        });
        break;

      case EType.SUB:
        dispatch((s) => ({
          type: EConstants.CHANGE_DATA,
          payload: s.data - 1,
        }));
        break;

      case EType.RESET:
        // 不使用回调模式
        dispatch({
          type: EConstants.CHANGE_DATA,
          payload: 0,
        });
        break;

      default:
        break;
    }
  }, []);

  return (
    <>
      <button onClick={() => clickBtn(EType.SUB)}>点我-</button>
      <button onClick={() => clickBtn(EType.ADD)}>点我+</button>
      <button onClick={() => clickBtn(EType.RESET)}>点我归零</button>
    </>
  );
};
export default React.memo(Home);
