import React from 'react';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this._create = this._create.bind(this);
  }

  _create() {
    localStorage.setItem('VK_O', 1);
    location.href = '/';
  }

  render() {
    return (
      <div className="mw6 center db">
        <a href="#" className="uk-button uk-button-link db">Have an account?</a>
        <div className="mt4">
          <fieldset className="uk-fieldset">
            <legend className="uk-legend">Create an Account</legend>
            <div className="uk-margin">
              <input className="uk-input" type="email" placeholder="Email"/>
            </div>
            <div className="uk-margin">
              <input className="uk-input" type="password" placeholder="Password"/>
            </div>
          </fieldset>
        </div>
        <button className="uk-button uk-button-primary" onClick={this._create}>Create Account</button>
        <span className="pl4-ns"></span>
      </div>
    );
  }
}

export default Component;
