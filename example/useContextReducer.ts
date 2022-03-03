import { useContextReducer, IDispatch } from '../src';
// type变量抽离, 也可以不用, 直接写字符串能认识也行
import EConstants from './constants';

/** state默认值 */
export const stateDefault = {
  data: 0,
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

    default:
      return state;
  }
};

/** 导出 */
export default useContextReducer(reducer, stateDefault);
