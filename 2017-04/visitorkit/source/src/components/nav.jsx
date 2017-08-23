import React from 'react';
import PropTypes from 'prop-types';

import DatePicker from './date-picker';

class Component extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {

    $('.uk-navbar-container').attr('uk-navbar');

    return (
      <div>
        <header className="bg-blue w-100 ph3 pv3 pv4-ns ph4-m ph5-l">
          <nav className="f6 fw6 co-container w-100 mw8-l center ttu tracked">
            {this.props.ouath && <a className="link dim white hover-white-80 no-underline dib mr3" href="#">Analytics</a> }
            {this.props.ouath && <a className="link dim white hover-white-80 no-underline dib mr3" href="#">Campaigns</a> }
            {this.props.ouath && <a className="link dim white hover-white-80 no-underline dib mr3 fr" href="#">My Account</a> }
            {!this.props.ouath && <a className="link dim white hover-white-80 no-underline dib mr3 fr" href="#create">Create Account</a> }
            {!this.props.ouath && <a className="link dim white hover-white-80 no-underline dib mr3 fr" href="#">Login</a> }
          </nav>
        </header>
        <div className="pa2 db tc center">
          <DatePicker />
        </div>
      </div>
    );
  }
}

export default Component;
