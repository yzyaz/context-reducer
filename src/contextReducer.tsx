import React from 'react';

/** 普通dispatch类型 */
export type IDispatch = { type: string; payload?: any; meta?: any };
/** 增加了回调参数的dispatch类型 */
export type IDispatchF<S> = IDispatch | ((state: S) => IDispatch);

export function useContextReducer<IState = {}>(
  /** 传入的reducer控制 */
  reducer: React.Reducer<IState, IDispatch>,
  /** state默认值 */
  stateDefault: IState
) {
  // 处理reducer, 增加dispatch的回调功能
  const thisReducer: React.Reducer<IState, IDispatchF<IState>> = (
    state,
    action
  ) => {
    if (typeof action === 'function') return reducer(state, action(state));
    return reducer(state, action);
  };

  //创建 useReducer
  const useReducerHook = () => React.useReducer(thisReducer, stateDefault);

  //创建 useContext
  const Context = React.createContext(
    {} as {
      state: IState;
      dispatch: React.Dispatch<IDispatchF<IState>>;
      // fetchUtils: IFetch;
    }
  );

  // 创建包裹context, 传递state, dispatch
  const Provider = React.memo(({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducerHook();
    const value = React.useMemo(() => ({ state, dispatch }), [dispatch, state]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  });

  // 创建子组件使用的hook
  const useContextReducer = () => React.useContext(Context);

  return { Provider, useContextReducer };
}

// // =======以下放入 母 tsx文件中
// import ContextProvider from './reducer';
// <ContextProvider>
// </ContextProvider>

// // //=======以下放入 子 tsx文件中
// import { useReducerContextHook } from './reducer';
// const {
//   state,
//   dispatch,
// } = useReducerContextHook();
// //条件判断 并执行reducer 示列
// if (data) {
//   dispatch({
//     type: 'change_data',
//     payload: data,
//   });
// } else {}
