import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader } from './toolkit';

import { Area } from 'react-simple-charts'

import 'whatwg-fetch';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: $('.seven-day').width(),
      }
    };
  }

  componentDidMount() {
    this.setState({
      viewport: {
        width: $('.seven-day').width(),
      }
    });
    this._resize_mixin_callback.bind(this)
    window.addEventListener('resize', this._resize_mixin_callback.bind(this));
  }

  _resize_mixin_callback() {
      this.setState({
        viewport: {
          width: $('.seven-day').width(),
        }
      });
    }

  render() {

    let data = [
      {value: 2, label: "active users"},
      {value: 5, label: "active users"},
      {value: 11, label: "active users"},
      {value: 9, label: "active users"},
      {value: 6, label: "active users"},
      {value: 17, label: "active users"},
      {value: 18, label: "active users"},
    ];

    const width = this.state.viewport.width;
    return (
      <div className="seven-day">
        <Area width={this.state.viewport.width} fillColor="#f9f9f9" gridColor="#f9f9f9" height={300} data={data} />
      </div>
    );
  }
}

export default Component;
