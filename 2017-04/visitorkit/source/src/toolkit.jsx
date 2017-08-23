import React from 'react';

class SectionHeader extends React.Component {
  render() {
    return (
      <p className="f3">{ this.props.text }</p>
    )
  }
}

class Loader extends React.Component {
  render() {
    return (
      <img src="/dist/loading.gif"/>
    )
  }
}

module.exports = {
  SectionHeader,
  Loader,
}
