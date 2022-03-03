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
export type DispatchF<S, T = any> = IDispatch<T> | ((state: S) => IDispatch<T>);

type TReducer<S> = React.Reducer<S, IDispatch>;
type TReducerF<S> = React.Reducer<S, DispatchF<S>>;
// 为了支持immer的参数
type TImmerReducer<S> = (state: S, action: IDispatch) => void;
type TImmerReducerF<S> = (state: S, action: DispatchF<S>) => void;
/** 增加了回调参数的dispatch函数类型 */
export type ReactDispatchF<S = any> = React.Dispatch<DispatchF<S>>;

interface IProps<S, F> {
  /** 传入的reducer控制 */
  reducer: TReducer<S> | TImmerReducer<S>; // 好支持immer
  /** state默认值 */
  stateDefault: S;
  /** 可选参数, 使用useImmerReducer */
  useImmerReducer?: any;
  useFetch?: (dispatch: ReactDispatchF) => F;
}

export function useContextReducer<IState = {}, IFetch = {}>(
  props: IProps<IState, IFetch>
) {
  const { reducer, stateDefault, useImmerReducer, useFetch } = props;

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

  type TAllLoading = { [key in keyof IFetch]: boolean } & {
    /** 所有接口请求的总loading */
    allFetchLoading: boolean;
  };
  // type TFetchUtils = IFetch & {
  //   allLoading: TAllLoading;
  // };
  //创建 useContext
  const Context = React.createContext(
    {} as {
      state: IState;
      dispatch: ReactDispatchF<IState>;
      fetchUtils?: IFetch;
      allLoading?: TAllLoading;
    }
  );

  // 创建包裹context, 传递state, dispatch
  const Provider = React.memo(({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducerHook();

    const [allLoading, setAllLoading] = React.useState<TAllLoading>({
      allFetchLoading: false,
    } as TAllLoading);

    const fetchUtils = React.useMemo(() => {
      const obj: any = useFetch?.(dispatch) || {};

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          if (typeof element === 'function') {
            // 初始就给fetch的loading设置为false
            setAllLoading((pre) => ({ ...pre, [key]: false }));
            // 监听接口函数调用, 改变loading状态
            const proxy = new Proxy(element, {
              async apply(_func, _obj, _args) {
                setAllLoading((pre) => ({
                  ...pre,
                  allFetchLoading: true,
                  [key]: true,
                }));
                try {
                  await _func.apply(this, _args);
                } catch (error) {
                  throw error;
                }
                setAllLoading((pre) => ({
                  ...pre,
                  allFetchLoading: false,
                  [key]: false,
                }));
              },
            });
            obj[key] = proxy;
          }
        }
      }

      return obj as IFetch;
    }, [dispatch]);

    const value = React.useMemo(
      () => ({
        state,
        dispatch,
        fetchUtils,
        allLoading,
      }),
      [dispatch, state, allLoading]
    );
    return <Context.Provider value={value}>{children}</Context.Provider>;
  });

  // 创建子组件使用的hook
  const useContextReducer = () => React.useContext(Context);

  return { Provider, useContextReducer };
}

export default useContextReducer;
