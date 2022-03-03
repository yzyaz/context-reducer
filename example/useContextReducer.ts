import { useContextReducer, IDispatch } from '../src';
// type变量抽离, 也可以不用, 直接写字符串能认识也行
import EConstants from './constants';

import useFetch from './useFetch';

/** state默认值 */
export const stateDefault = {
  data: 0,
  req: '',
};
/** state默认值类型 */
export type IState = typeof stateDefault;

/** reducer控制 */
export const reducer: React.Reducer<IState, IDispatch<EConstants>> = (
  state,
  action
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, meta } = action;

  switch (type) {
    case EConstants.CHANGE_DATA: {
      return {
        ...state,
        data: payload,
      };
    }
    case EConstants.CHANGE_FETCH_DATA: {
      return {
        ...state,
        req: payload,
      };
    }
    case EConstants.CHANGE_FETCH_DATA_E: {
      return {
        ...state,
        req: payload.message || '请求错误',
      };
    }

    default:
      return state;
  }
};

/** 导出 */
export default useContextReducer({ reducer, stateDefault, useFetch });
