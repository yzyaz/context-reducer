import React from 'react';
import contextReducer from './useContextReducer';

const Show = () => {
  const {
    state: {
      data ,
    },
  } = contextReducer.useContextReducer();

  return (
    <div>
      我是show组件:
      <b>{data}</b>
    </div>
  );
};

export default React.memo(Show);
