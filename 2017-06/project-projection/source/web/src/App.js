import React, { Component } from 'react'
import logo from './logo.svg';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canPush: false,
      messages: []
    };
  }

  componentWillMount() {
    this.pullState();
  }

  pullState() {
    window.connection = new WebSocket('ws://localhost:8080');
    window.connection.onmessage = evt => {
      // add the new message to state
        this.setState({
        messages : this.state.messages.concat([ evt.data ])
      })
    };
    setTimeout(() => {
      this.setState({
        canPush: true,
      });
    }, 2000)
  }

  pushState() {
    window.connection.send(JSON.stringify(this.state))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          {this.state.canPush &&
            <button onClick={this.pushState.bind(this)}>pushState</button>
          }
        </div>
      </div>
    );
  }
}

export default App;
