import React from 'react';

/** 普通dispatch类型 */
export interface IDispatch<T = any> {
  /** 类型 */
  type: T;
  /** 参数 */
  payload?: any;
  /** 第三值, 可选 */
  meta?: any;
}
/** 增加了回调参数的dispatch类型 */
export type IDispatchF<S, T = any> =
  | IDispatch<T>
  | ((state: S) => IDispatch<T>);

type TReducer<S> = React.Reducer<S, IDispatch>;
type TReducerF<S> = React.Reducer<S, IDispatchF<S>>;
type TImmerReducer<S> = (state: S, action: IDispatch) => void;
type TImmerReducerF<S> = (state: S, action: IDispatchF<S>) => void;
type TDispatch<S> = React.Dispatch<IDispatchF<S>>;

export function useContextReducer<IState = {}>(
  /** 传入的reducer控制 */
  reducer: TReducer<IState> | TImmerReducer<IState>, // 好支持immer
  /** state默认值 */
  stateDefault: IState,
  /** 可选参数, 使用useImmerReducer */
  useImmerReducer?: any
) {
  // 处理reducer, 增加dispatch的回调功能
  const thisReducer: TReducerF<IState> | TImmerReducerF<IState> = (
    state,
    action
  ) => {
    if (typeof action === 'function') return reducer(state, action(state));
    return reducer(state, action);
  };

  //创建 useReducer
  const useReducerHook = () =>
    useImmerReducer
      ? useImmerReducer(thisReducer, stateDefault)
      : React.useReducer(thisReducer as TReducerF<IState>, stateDefault);

  //创建 useContext
  const Context = React.createContext(
    {} as {
      state: IState;
      dispatch: TDispatch<IState>;
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
