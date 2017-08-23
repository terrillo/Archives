import React from 'react';
import ReactDOM from 'react-dom';

import Router from './router';

import Nav from './components/nav';

import { SectionHeader } from './toolkit';

const ouath = (localStorage.getItem('VK_O'))

ReactDOM.render(
  <div>
    {!ouath && <Nav /> }
    {ouath && <Nav ouath/> }
    <div className="co-container w-100 mw8-l center ph2 pv2  ph3-m pv3-l">
      <Router />
    </div>
  </div>,
  document.querySelector('.root')
);
