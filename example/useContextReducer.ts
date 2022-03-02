import { useContextReducer } from '../src/contextReducer';

/** state默认值 */
export const stateDefault = {
  data: 0,
};

export type IState = typeof stateDefault;

/** reducer */
export const reducer = (state, action) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, meta } = action;

  switch (type) {
    case 'change_data': {
      return {
        ...state,
        data: payload,
      };
    }
    default:
      return state;
  }
};

export default useContextReducer<IState>(reducer, stateDefault);
