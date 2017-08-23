import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import { SectionHeader } from './toolkit';

import { Area, CirclePie, BarMetric } from 'react-simple-charts'

import 'whatwg-fetch';

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
    this._resize_mixin_callback.bind(this)
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
      <div>
        <SectionHeader text="New vs Returning" />
        <BarMetric width={this.state.viewport.width} height={300} data={{ metricName: 'points', value: 0,  percent: 70, label: 'New' }} />
        <BarMetric width={this.state.viewport.width} height={300} data={{ metricName: 'points', value: 0,  percent: 30, label: 'Returning' }} />
      </div>
    );
  }
}

export default Component;
