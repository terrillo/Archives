import React from 'react';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this._login = this._login.bind(this);
  }

  _login() {
    localStorage.setItem('VK_O', 1);
    location.href = '/';
  }

  render() {
    return (
      <div className="mw6 center db">
        <fieldset className="uk-fieldset">
          <legend className="uk-legend">Login</legend>
          <div className="uk-margin">
            <input className="uk-input" type="email" placeholder="Email"/>
          </div>
          <div className="uk-margin">
            <input className="uk-input" type="password" placeholder="Password"/>
          </div>
        </fieldset>
        <button className="uk-button uk-button-primary" onClick={this._login}>Login</button>
        <span className="pl4-ns"></span>
        <a href="#create" className="uk-button uk-button-link dib">Create Free Account</a>
      </div>
    );
  }
}

export default Component;
