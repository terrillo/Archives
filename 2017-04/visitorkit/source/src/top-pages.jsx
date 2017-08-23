import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader, Loader } from './toolkit';

import { BarMetric } from 'react-simple-charts'

import 'whatwg-fetch';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: $('.co-container').width(),
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

    fetch(`http://track.visitorkit.com/pull.php?api_key=0758a127-f3f5-4e21-a974-5f80f6690fe5&method=pages&type=list&limit=${this.props.limit}`)
    .then(function(response) {
       return response.json()
     }).then((json) => {
       const metrics = [];
       for (var a in json['Data']) {
         var data = {
           metricName: 'Hits',
           value: json['Data'][a],
           percent: (json['Data'][a]/json['Count'])*100,
           label: a,
         }
         metrics.push(data)

       }
       this.setState({
         metrics: metrics,
       });
     });
  }

  _resize_mixin_callback() {
      this.setState({
        viewport: {
          width: $('.co-container').width(),
        }
      });
    }

  render() {

    const data = this.state.metrics;
    const width = this.state.viewport.width;

    console.log(data);

    return (
      <div>
        {!data && <Loader />}
        {data && data.map(function(object, i){
          return <div className="co-bar"><BarMetric width={width} height={300} value={object.value} percent={object.percent} label={object.label} key={i} metricName="Pageviews"/></div>;
        })}
        {data && this.props.button && <a href="#pages" className="uk-button uk-button-primary">All Pages</a>}
      </div>
    );
  }
}

export default Component;
