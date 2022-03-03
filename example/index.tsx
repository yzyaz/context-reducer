import React from 'react';
import { render } from 'react-dom';
import ContextReducer from './useContextReducer';
import Show from './Components/Show';
import Home from './Components/Home';

import ContextReducerImmer from './useContextReducer-immer';
import HomeImmer from './Components/HomeImmer';
import ShowImmer from './Components/ShowImmer';

function App() {
  return (
    <>
      <ContextReducer.Provider>
        <Home />
        <Show />
      </ContextReducer.Provider>

      <ContextReducerImmer.Provider>
        <HomeImmer />
        <ShowImmer />
      </ContextReducerImmer.Provider>
    </>
  );
}

render(<App />, document.getElementById('root'));
