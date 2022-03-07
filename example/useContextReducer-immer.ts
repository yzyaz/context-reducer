// 使用useimmer模式
import createContextReducer, { IDispatch } from '../src';
// type变量抽离, 也可以不用, 直接写字符串能认识也行
import EConstants from './constants';
import { useImmerReducer, Reducer } from 'use-immer';

/** state默认值 */
export const stateDefault = {
  data: 0,
};
/** state默认值类型 */
export type IState = typeof stateDefault;

/** reducer控制-immer模式 */
export const reducer: Reducer<IState, IDispatch<EConstants>> = (
  state,
  action
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, meta } = action;

  switch (type) {
    case EConstants.CHANGE_DATA: {
      // 使用immer可以直接赋值
      state.data = payload;
      break;
    }

    default:
      break;
  }
};

/** 导出 */
export default createContextReducer({ reducer, stateDefault, useImmerReducer });
