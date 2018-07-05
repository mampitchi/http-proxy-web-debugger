import React, { Component } from 'react'
import { Card } from 'antd'
import ProxyUtil from '../utils/ProxyUtil'

import './RequestDetail.css'

const RequestDetail = ({ request, response }) => (
  <div className="RequestDetail">
    <Card title="Request Detail">
      <strong>Request</strong>
      <pre>
        {ProxyUtil.rawRequest(request)}
      </pre>

      <strong>Response</strong>
      <pre>
        {ProxyUtil.rawResponse(response)}
      </pre>
    </Card>
  </div>
)

export default RequestDetail