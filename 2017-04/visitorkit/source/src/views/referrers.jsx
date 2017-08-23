import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader } from '../toolkit';

import Referrers from '../referrers';

class Component extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="db center tc">
        <SectionHeader text="All Referrers" />
        <Referrers limit="20" button={false} />
      </div>
    );
  }
}

export default Component;
