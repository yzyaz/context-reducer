import { useContextReducer, IDispatch } from '../src';
// 也可以不用, type变量抽离, 直接写字符串能认识也行
import EConstants from './constants';
// import { useImmerReducer } from 'use-immer';

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
      // 使用immer可以直接赋值
      // state.data = payload;
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
export default useContextReducer(
  reducer,
  stateDefault
  // 第三参数可选使用useImmerReducer
  // , useImmerReducer
);
