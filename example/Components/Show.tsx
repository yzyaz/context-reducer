import React from 'react';
import contextReducer from '../useContextReducer';

const Show = () => {
  const {
    state: { data ,req},
  } = contextReducer.useContextReducer();

  return (
    <div>
      <div>
        我是show组件:
        <b>{data}</b>
      </div>
      <div>接口返回:
        <b>{req}</b>
      </div>
    </div>
  );
};

export default React.memo(Show);
