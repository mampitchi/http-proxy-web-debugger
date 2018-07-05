import React, { Component } from 'react'
import { Modal, Icon, Row, Col, Input, notification } from 'antd'
import RequestTable from './components/RequestTable'
import RequestDetail from './components/RequestDetail'
import ProxyUtil from './utils/ProxyUtil'

import './App.css'

const openNotificationWithIcon = (type, title, description) => {
  notification[type]({
    message: title,
    description: description,
    duration: 15
  });
};


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      requests: [],
      filteredRequests: [],
      selectedIndex: undefined,
      filterValue: ''
    }

    this.handleRequestTableRowClick = this.handleRequestTableRowClick.bind(this)
  }

  componentDidMount() {
    this.connection = new WebSocket(window.REACT_APP_PROXY_WEBSOCKET_URL)

    this.connection.onmessage = (evt) => {
      let jsonData = JSON.parse(evt.data)

      if (jsonData.type === "newRequest") {
        this.setState((prevState) => {
          let requests = [ Object.assign({}, { key: prevState.requests.length + 1 }, jsonData.message), ...prevState.requests] 

          if (!this.state.filterValue) 
            return { requests } 
          else 
            return { requests, filteredRequests: ProxyUtil.filter(this.state.filterValue, requests) }
        })
      } else if (jsonData.type === "error") {
        openNotificationWithIcon('error', `Chyba: ${jsonData.message.code}`, jsonData.message.message)
      }
    }
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
      selectedIndex: undefined
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      selectedIndex: undefined
    })
  }

  handleRequestTableRowClick = (record, dataIndex) => {
    this.setState({
      visible: true,
      selectedIndex: dataIndex
    })
  }

  handleFilterChange = (e) => {
    if (e.target.value) {
      this.setState({
        filterValue: e.target.value,
        filteredRequests: ProxyUtil.filter(e.target.value, this.state.requests),
      })
    } else {
      this.setState({
        filterValue: e.target.value,
        filteredRequests: []
      })
    }
  }

  render() {
    let selectedRequest;
    if (typeof this.state.selectedIndex !== "undefined") {
      selectedRequest = this.state.requests[this.state.selectedIndex]
    }

    let requestDetail;
    if (selectedRequest) {
      requestDetail = <RequestDetail request={selectedRequest.request} response={selectedRequest.response} />
    }

    return (
      <div className="App">
        <h1 className="App-logo"><Icon type="global" className="App-logo-icon" /> HTTP Proxy Debugger</h1>

        <Row gutter={16}>
          <Col span={12}>
            <Input placeholder={`Search HTTP Request...`} value={this.state.filterValue} onChange={this.handleFilterChange} />
            <RequestTable data={!this.state.filterValue ? this.state.requests : this.state.filteredRequests} onRowClick={this.handleRequestTableRowClick} selectedKey={this.state.selectedIndex !== undefined ? this.state.requests[this.state.selectedIndex].key : undefined} />
          </Col>
          <Col span={12}>
            {requestDetail}
          </Col>
        </Row>
        <Modal
          title="Request Detail"
          visible={/*this.state.visible*/false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'98%'}
        >
          {requestDetail}
        </Modal>
      </div>
    )
  }
}

export default App