import React from 'react';
import PropTypes from 'prop-types';
import { SectionHeader } from '../toolkit';

import TopPages from '../top-pages';

class Component extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="db center tc">
        <SectionHeader text="Pages" />
        <TopPages limit="20" button={false} />
      </div>
    );
  }
}

export default Component;
