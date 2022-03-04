<p align="right">
  <strong>
    <a href="README-zh-cn.md">中文</a> |
    <!-- <a href="README.md">English</a> |
    <a href="README-ru-ru.md">Русский</a> |
    <a href="README-th-th.md">ภาษาไทย</a> |
    <a href="README-vi-vn.md">Tiếng Việt</a> -->
  </strong>
  <br/>
  <sup><em>(Please contribute translations!)</em></sup>
</p>

# context-reducer

> 使用useContext和useReducer的一个轻量状态管理库, 仅仅 600 字节。


- **React Hooks** _React Hooks 用做你所有的状态管理_
- **熟悉的 API** _仅仅使用了 React，没有依赖第三方库_
- **~600 bytes** _min+gz._
- **TypeScript 编写** _推断代码更容易，易于编写 React 代码_
- **数据请求** _可以接入数据请求方法_
- **请求loading** _可以自动监控请求接口的loading状态, 无需手动添加_
- **useImmer** _支持接入useImmer_
- **按需引入** _支持es6模块语法 和 treeShaking_
- **它更容易学习。** _你已经知道 useContext useReducer , 只需使用它们_
  
  
## 安装

```sh
npm install --save context-reducer
```

## 基本使用

##### example地址: https://github.com/yzyaz/context-reducer/tree/master/example
#### useContextReducer.ts
```js
import useContextReducer, { IDispatch } from 'context-reducer';

/** 初始state值 */
const stateDefault = {
  data: 0,
  req: '',
};
type IState = typeof stateDefault;

export const reducer: React.Reducer<IState, IDispatch> = (
  state,
  action
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, meta } = action;

  switch (type) {
    case 'CHANGE_DATA': {
      return {
        ...state,
        data: payload,
      };
    } 
    // ...

    default:
      return state;
  }
};

export default useContextReducer({ reducer, stateDefault });
```
#### index.tsx
```js
// 根目录使用Provider包裹
import React from 'react';
import { render } from 'react-dom';
import ContextReducer from './useContextReducer';
import Show from './Show';
import Home from './Home';

function App() {
  return (
      <ContextReducer.Provider>
        <Home />
        <Show />
      </ContextReducer.Provider>
  );
}

render(<App />, document.getElementById('root'));
```
#### Home.tsx
```js
// 对值进行操作
import React from 'react';
import contextReducer from './useContextReducer';

const Home = () => {
  const { dispatch } = contextReducer.useContextReducer();

  const clickBtn = React.useCallback((type: string) => {
    switch (type) {
      case 'add':
        dispatch((s) => {
          // s即为上一个state的值
          return {
            type: 'CHANGE_DATA',
            // 操作逻辑可放到useContextReducer.ts文件中的reducer中
            payload: s.data + 1,
          };
        });
        break;

      case 'sub':
        dispatch((s) => ({
          type: 'CHANGE_DATA',
          payload: s.data - 1,
        }));
        break;

      case 'reset':
        // 不使用回调
        dispatch({
          type: 'CHANGE_DATA',
          payload: 0,
        });
        break;

      default:
        break;
    }
  }, []);

  return (
    <>
      <button onClick={() => clickBtn('sub')}>点我-</button>
      <button onClick={() => clickBtn('add')}>点我+</button>
      <button onClick={() => clickBtn('reset')}>点我归零</button>
    </>
  );
};
export default React.memo(Home);
```
#### Show.tsx
```js
// 展示数据
import React from 'react';
import contextReducer from './useContextReducer';

const Show = () => {
  const {
    state: { data },
  } = contextReducer.useContextReducer();

  return (
    <div>
      我是data值:
      <b>{data}</b>
    </div>
  );
};

export default React.memo(Show);
```
_如上, 即可通过dispatch修改reducer中的值, 如果你使用过useReducer或是redux就很方便理解_

## 接口请求

1 新建一个方法包含此模块的所有请求(使用dispatch修改状态即可, 其他是正常的js语法):
#### useFetch.ts
```js
import axios from 'axios';
import { ReactDispatchF } from 'context-reducer';

const useFetch = (dispatch: ReactDispatchF) => {
  /** 接口1 */
  const fetch = async (
    /** 请求参数 */
    type: string
  ) => {
    try {
      const res: any = await axios(
        'https://www.fastmock.site/mock/5ccec72a2e72fceba0799c3844ba3c0f/xs/succ',
        {
          params: {
            type,
          },
        }
      );
      // 修改状态
      dispatch((s) => {
        return {
          type: 'CHANGE_FETCH_DATA',
          payload: res.data?.data,
          // meta:,
        };
      });
    } catch (error) {
      dispatch({
        type: 'CHANGE_FETCH_DATA_E',
        payload: error,
      });
    }
  };

  /** 接口2 */
  const fetchErr = async () => {
      
      // ...

  }

  return {
    fetch,
    fetchErr,
  };
};

export default useFetch;
```

2 在配置文件中引入请求方法
#### useContextReducer.ts
```diff
import useContextReducer,{  IDispatch } from 'context-reducer';
+ import useFetch from './useFetch';

/** state默认值 */
const stateDefault = {
  data: 0,
+ req: '',
};
/** state默认值类型 */
type IState = typeof stateDefault;

/** reducer控制 */
export const reducer: React.Reducer<IState, IDispatch> = (
  state,
  action
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, meta } = action;

  switch (type) {

    //...
      
+   case 'CHANGE_FETCH_DATA': {
+     return {
+       ...state,
+       req: payload,
+     };
+   }
+   case 'CHANGE_FETCH_DATA_E': {
+     return {
+       ...state,
+       req: payload.message || '请求错误',
+     };
+   }

    default:
      return state;
  }
};

// ...

export default useContextReducer({ reducer, stateDefault, 
+ useFetch 
});
```

3 在需要调用接口的文件中调用:
#### Home.tsx
```diff
import React from 'react';
import contextReducer from './useContextReducer'; 
 
const Home = () => {
   const { dispatch,
+    fetchUtils, allLoading 
   } = contextReducer.useContextReducer();

+  // 获取请求方法
+  const { fetch, fetchErr } = fetchUtils;

+  // 获取loading
+  const { allFetchLoading, fetchLoading, fetchErrLoading } = allLoading

  const clickBtn = React.useCallback((type: string) => {
    switch (type) { 

      //...
      
+      case 'req':
+        // 接口请求
+        fetch('1');
+        break;
+
+      case 'reqe':
+        fetchErr();
+        break;

      default:
        break;
    }
  }, []);

  return (
    <>
      // ...
+      <button onClick={() => clickBtn('req')}>请求</button>
+      <button onClick={() => clickBtn('reqe')}>请求错误接口</button>
    </>
  );
};
export default React.memo(Home);

```

#### 关于allLoading
```js
   // 此库会自动跟踪每个接口方法的状态(接口方法在useFetch.ts中), 无需手动添加
   const { allLoading } = contextReducer.useContextReducer();
   // allFetchLoading: 所有接口的请求状态
   // fetchLoading: 对应fetch接口方法的请求状态
   // fetchErrLoading: 对应fetchErr接口方法的请求状态
   const { allFetchLoading, fetchLoading, fetchErrLoading } = allLoading
```

## 选择使用useImmer
```diff
// useContextReducer.ts入口文件中
import useContextReducer, { IDispatch } from 'context-reducer';
+import { useImmerReducer, Reducer } from 'use-immer';

/** state默认值 */
const stateDefault = {
  data: 0,
};
type IState = typeof stateDefault;

- export const reducer: React.Reducer<IState, IDispatch<string>> = (
+ export const reducer: Reducer<IState, IDispatch<string>> = (
  state,
  action
) => {
  const { type, payload, meta } = action;

-  switch (type) {
-    case 'CHANGE_DATA': {
-      return {
-        ...state,
-        data: payload,
-      };
-    } 
-    // ...
-
-    default:
-      return state;
-  }

+  switch (type) {
+    case 'CHANGE_DATA': {
+      // 使用immer可以直接赋值
+      state.data = payload;
+      break;
+    }
+    // ...
+
+    default:
+      break;
+  }

};

export default useContextReducer({ reducer, stateDefault,
+ useImmerReducer 
});
```


## API 和 TS类型
### `useContextReducer(useHook)`

```js
import useContextReducer from 'context-reducer';

// reducer 状态管理逻辑(见上)
// stateDefault 初始state值
// useFetch fetch方法集合, 可选
const ContextReducer  = useContextReducer({ reducer, stateDefault, useFetch });
// ContextReducer  === { Provider, useContextReducer }
```
### `<ContextReducer.Provider>`
```js
function ParentComponent() {
  return (
    <ContextReducer.Provider>
      <ChildComponent />
    </ContextReducer.Provider>
  )
}
```

### `ContextReducer.useContextReducer()`

```js
function ChildComponent() {
  // dispatch 状态管理修改
  // fetchUtils 所包含的请求方法
  // allLoading 所有的loading, 包含每个fetch的状态
  const { state, dispatch, fetchUtils, allLoading } = ContextReducer.useContextReducer()
  return <div...
}
```
### `IDispatch(TS)`
```js 
// useContextReducer.ts入口文件中
import { IDispatch } from 'context-reducer';
// 声明这里的action类型
const reducer: React.Reducer<IState, IDispatch> = (
  state,
  action
) => {
    const { type, payload, meta } = action;
    // ...

// or

// 可声明action中type为string, 或者也可声明type为枚举enum类型, 都可
const reducer: React.Reducer<IState, IDispatch<string>> = (
  state,
  action
) => {
    const { type, payload, meta } = action;
    // ...

``` 

### `ReactDispatchF(TS)`
```js 
// useFetch.ts接口文件中
import { ReactDispatchF } from 'context-reducer'; 

// s声明这里使用的dispatch类型, 除了自身的类型外还包含回调参数类型
const useFetch = (dispatch: ReactDispatchF<string>) => {
  /** 接口 */
  const fetch = async (
    /** 请求参数 */
    type: string
  ) => {
    // ...
  }

``` 
