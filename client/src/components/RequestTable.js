import React, { Component } from 'react'
import { Table } from 'antd'

import './RequestTable.css'

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: 'Status',
        dataIndex: 'response.statusCode',
        key: 'response.statusCode',
    },
    {
        title: 'Method',
        dataIndex: 'request.method',
        key: 'request.method',
    },
    {
        title: 'Host',
        dataIndex: 'request.parsedUrl.host',
        key: 'request.parsedUrl.host',
    },
    {
        title: 'URL',
        dataIndex: 'request.parsedUrl.path',
        key: 'request.parsedUrl.path',
    },
    {
        title: 'Body',
        dataIndex: 'response.bodyLength',
        key: 'response.bodyLength',
    },
    {
        title: 'Content-Type',
        dataIndex: 'response.headers.content-type',
        key: 'response.headers.content-type',
    },
];


const RequestTable = ({ data, onRowClick, selectedKey }) => (
    <div className="RequestTable">
        <Table 
            onRow={(record, dataIndex) => {
                return {
                    onClick: () => onRowClick(record, dataIndex) 
                };
            }}
            dataSource={data} 
            columns={columns}
            pagination={{
                defaultPageSize: 25
            }}
            rowClassName={(record, index) => `RequestTable__Row${record.key === selectedKey ? ' RequestTable__Row--Selected' : ''}`}
        />
    </div>
)

export default RequestTable 