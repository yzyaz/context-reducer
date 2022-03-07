import axios from 'axios';
import { ReactDispatchF } from '../src';
// type变量抽离, 也可以不用, 直接写字符串能认识也行
import EConstants from './constants';

const fetchFun = (dispatch: ReactDispatchF<EConstants>) => {
  /** 正确接口 */
  const fetch = async (
    /** 请求参数 */
    type: string
  ) => {
    try {
      const res: any = await axios(
        'https://www.fastmock.site/mock/5ccec72a2e72fceba0799c3844ba3c0f/xs/successreq',
        {
          params: {
            type,
          },
        }
      );
      dispatch((s) => {
        console.log('state原始值:', s);
        return {
          type: EConstants.CHANGE_FETCH_DATA,
          payload: res.data?.data,
          // meta:,
        };
      });
    } catch (error) {
      dispatch({
        type: EConstants.CHANGE_FETCH_DATA_E,
        payload: error,
      });
    }
  };

  /** 错误接口 */
  const fetchErr = async () => {
    try {
      const res: any = await axios(
        'https://www.fastmock2.site/mock/5ccec72a2e72fceba0799c3844ba3c0f/xs/successreq'
      );
      dispatch({
        type: EConstants.CHANGE_FETCH_DATA,
        payload: res.data?.data,
      });
    } catch (error) {
      dispatch({
        type: EConstants.CHANGE_FETCH_DATA_E,
        payload: error,
      });
    }
  };

  return {
    fetch,
    fetchErr,
  };
};

export default fetchFun;

// export type IFetch = ReturnType<typeof fetchFun>;
