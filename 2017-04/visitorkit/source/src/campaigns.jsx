import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader } from './toolkit';

import { CirclePie } from 'react-simple-charts'

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: $('.co-w50').width(),
      }
    };
  }

  componentDidMount() {
    this.setState({
      viewport: {
        width: $('.co-w50').width(),
      }
    });
    window.addEventListener('resize', this._resize_mixin_callback.bind(this));
  }

  _resize_mixin_callback() {
      this.setState({
        viewport: {
          width: $('.co-w50').width(),
        }
      });
    }

  render() {

    const width = this.state.viewport.width;
    return (
      <div className="db center tc">
        <CirclePie percent={5}/>
        <p>Facebook</p>
      </div>
    );
  }
}

export default Component;
