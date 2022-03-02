import React from 'react';
import { render } from 'react-dom';
import ContextReducer from './useContextReducer';
import Show from './Components/Show';
import Home from './Components/Home';

function App() {
  return (
    <ContextReducer.Provider>
      <Home />

      <Show />
    </ContextReducer.Provider>
  );
}

render(<App />, document.getElementById('root'));
