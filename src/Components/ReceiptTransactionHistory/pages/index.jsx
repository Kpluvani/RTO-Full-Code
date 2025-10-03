import React, { useMemo, useState } from 'react';
import { Typography, Table } from "antd";
import dayjs from 'dayjs';
import "../styles/receiptTransactionHistory.css";
import { DateFormat } from '@/utils';

const { Title } = Typography;

export const ReceiptTransactionHistory = ({ receiptHistory = [] }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    
  const columns = useMemo(() => ([
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    { title: "Transaction ID", dataIndex: "transaction_no", key: "transaction_no"},
    { title: "Payment Mode", dataIndex: "payment_mode", key: "payment_mode", },
    { title: "File No ", dataIndex: "file_number", key: "file_number" },
    { title: "Application No", dataIndex: "application_number", key: "application_number" },
    { title: "Registration No", dataIndex: "registration_no", key: "registration_no" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ]), []);

  const dataSource = useMemo(() => {
      const data = receiptHistory.map((val, index) => {
        return ({
          key: index,
          date: val.application_number,
          amount: val.transaction?.reduce((prev, curr) => ((parseFloat(curr.amount || 0) + parseFloat(prev || 0)).toFixed(2)), 0),
          isRoot: true,
          children: (val.transaction || []).map((item, i) => {
            return ({
              key: `${index}-${i}`,
              ...val,
              ...item,
              date: item.date ? dayjs(item.date).format(DateFormat) : '',
            })
          })
        })
      })
      const rowKeys = data.map((val) => val.key);
      setExpandedRowKeys(rowKeys);
      return data;
  }, [receiptHistory]);

  return (
      <div className='receipt-transaction-history'>
          <Title level={4} className='title'>Transaction History</Title>
          <Table
              size={'middle'}
              dataSource={dataSource}
              columns={columns}
              rowClassName={(record) => (record.isBlank ? "blank-row" : "")}
              rowKey={'key'}
              expandable={{
                expandedRowKeys: expandedRowKeys, // Set expandedRowKeys for parent
                onExpandedRowsChange: setExpandedRowKeys, // Update expandedRowKeys
              }}
              pagination={false}
              bordered
          />
      </div>
  )
}
