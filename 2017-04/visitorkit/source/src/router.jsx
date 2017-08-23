import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader } from './toolkit';

import HomeView from './views/home';
import ReferrersView from './views/referrers';
import PagesView from './views/pages';
import LoginView from './views/login';
import CreateView from './views/create';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      view: 'home'
    };
  }

  componentDidMount() {
    this._locationHashChanged();
    window.onhashchange = this._locationHashChanged.bind(this);
  }

  _locationHashChanged() {
    let view = window.location.hash.replace('#', '');
    if (view == '') view = 'home';
    this.setState({
      view: view
    });
  }

  render() {
    const ouath = (localStorage.getItem('VK_O'))
    return (
      <div>
        {ouath && this.state.view == 'home' && <HomeView /> }
        {ouath && this.state.view == 'referrers' && <ReferrersView /> }
        {ouath && this.state.view == 'pages' && <PagesView /> }
        {!ouath && this.state.view == 'home' && <LoginView /> }
        {!ouath && this.state.view == 'create' && <CreateView /> }
      </div>
    );
  }
}

export default Component;
