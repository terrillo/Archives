import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Card, Col, Row, Tag } from 'antd';
const { SubMenu, ItemGroup } = Menu;
const { Header, Content, Sider } = Layout;

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  play() {
    var chattyPlayer = document.getElementById('chatty-player');
    chattyPlayer.src = this.props.feed
    chattyPlayer.play()
    this.props.action(this.props.title)
  }

  render() {
    return (
      <Col span="8" style={{ padding: '0 12px'}} onClick={() => this.play()} >
        <Card title={this.props.title} bordered={false}></Card>
      </Col>
    );
  }
}
