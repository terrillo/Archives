import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Card, Col, Row, Tag } from 'antd';
import Station from './Station';

const { SubMenu, ItemGroup } = Menu;
const { Header, Content, Sider } = Layout;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      play: false
    };
  }

  pause() {
    var chattyPlayer = document.getElementById('chatty-player');
    chattyPlayer.pause()
    console.log('PAUSE')
    this.setState({
      play: false,
      pause: true,
    })
  }

  play(title) {
    console.log('PLAY')
    this.setState({
      playing: title,
      play: true,
      pause: false,
    })
  }

  render() {

    return (
      <Layout>
        <Layout style={{ height: '100vh' }}>
          <Sider width={200} style={{ background: '#fff', height: '100%', overflow: 'auto' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
              <SubMenu key="sub1" title={<span><i className="ion-radio-waves" style={{marginRight: '10px'}}></i>Stations</span>}>
                <Menu.Item key="1">Hip Hop</Menu.Item>
                <Menu.Item key="2">Rap</Menu.Item>
                <Menu.Item key="3">R&B</Menu.Item>
                <Menu.Item key="4">Pop</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px', 'marginTop': '20px' }}>
            <Content style={{ background: '#f8f8f8', margin: 0, minHeight: 280 }}>
              <div style={{ padding: '30px' }}>
                <Row>
                  <Station title="KTSO (80s Hits)" feed="http://crystalout.surfernetwork.com:8001/KJMM_MP3" action={this.play.bind(this)}  />
                </Row>
              </div>
            </Content>
          </Layout>
        </Layout>

        {this.state.play &&
          <Header className="header" style={{ position: 'fixed', 'bottom': 0, 'left': 0, 'right': 0, 'color': 'white' }}>
            <Tag color="orange" style={{'marginRight': '10px'}} onClick={() => this.pause()}><i className="ion-pause"></i></Tag> <b>Now Playing:</b>  {this.state.playing}
          </Header>
        }
      </Layout>
    );
  }
}
