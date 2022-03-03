import React from 'react';
import contextReducerImmer from '../useContextReducer-immer';

const Show = () => {
  const {
    state: { data: dataImmer },
  } = contextReducerImmer.useContextReducer();

  return (
    <div>
      我是show组件(immer):
      <b>{dataImmer}</b>
    </div>
  );
};

export default React.memo(Show);
