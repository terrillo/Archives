import React from 'react';
import { SectionHeader } from '../toolkit';

import SevenDay from '../seven-day';
import TopPages from '../top-pages';
import Referrers from '../referrers';
import Campaigns from '../campaigns';

class Component extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: ''
    }
    this._changeDate = this._changeDate.bind(this);
  }

  componentDidMount() {
    this._changeDate();
  }

  _changeDate() {
    $(document).on('click', '.react-datepicker__input-container', () => {
      const vale = $('#startDate input').val();
      this.setState({
        startDate: vale
      });
      // console.log(this.val());
    });
    console.log('afs');
  }

  render() {
    return (
      <div className="db center tc">
        <SevenDay />
        <div className="w-100 mt3 mb5">
          <div className="co-w50 dib w-100 w-50-ns pr2 pr4-ns br">
            <SectionHeader text="Top Referrers" />
            <Referrers limit="3" button />
          </div>
          <div className="co-w50 dib w-100 w-50-ns pr2 pr0-ns pl4-ns">
            <SectionHeader text={this.state.startDate} />
            <Referrers limit="3" button />
          </div>
        </div>
        <SectionHeader text="Top Pages" />
        <TopPages limit="5" button />
        <br/>
        <SectionHeader text="Top Campaigns" />
        <div className="w-100">
          <div className="w-100 w-25-ns dib">
            <Campaigns />
          </div>
          <div className="w-100 w-25-ns dib">
            <Campaigns />
          </div>
          <div className="w-100 w-25-ns dib">
            <Campaigns />
          </div>
          <div className="w-100 w-25-ns dib">
            <Campaigns />
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
