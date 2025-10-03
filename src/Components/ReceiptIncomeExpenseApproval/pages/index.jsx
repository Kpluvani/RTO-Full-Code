import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import dayjs from 'dayjs';
import "../styles/receipt-approval.css";

export const ReceiptIncomeExpenseApproval = ({ data, grandTotal }) => {
    const dataSource = useMemo(() => {
        const total = {
            key: data.length,
            amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.amount || 0)), 0) || 0).toFixed(2),
            isTotal: true,
        };
        return ([...data, total]);
    }, [data]);
    
    const columns = useMemo(() => (
        [
            {
                title: 'SR No',
                dataIndex: 'srNo',
                key: 'srNo',
                width: '5%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Account',
                dataIndex: 'account_category',
                key: 'account_category',
                width: '10%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                width: '10%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Payment Category',
                dataIndex: 'payment_category',
                key: 'payment_category',
                width: '7%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Payment Purpose',
                dataIndex: 'payment_purpose',
                key: 'payment_purpose',
                width: '10%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Mode',
                dataIndex: 'payment_mode',
                key: 'payment_mode',
                width: '7%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Transaction Id',
                dataIndex: 'transaction_no',
                key: 'transaction_no',
                width: '12%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: '10%',
                align: 'start',
                render: (text) => <div className="sr-no-cell">{text && dayjs(text).format('DD-MM-YYYY')}</div>
            },
        ]
    ), [dataSource]);

    return (
        <div className='receipt-approval'>
            <Card title={'Receipt Approval'}>
                <Table
                    className='amount-tbl'
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    size='middle'
                    rowKey="index"
                    // footer={() => (
                    //     <>
                    //         <div className={'footer-wrapper'}>
                    //             <div className={'footer-label'}>Grand Total :</div>
                    //             <div className={'footer-value'}>{grandTotal}</div>
                    //         </div>
                    //     </>
                    // )}
                /> 
            </Card>            
        </div>
    )
}
