import { useEffect, useMemo, useState } from 'react';
import { Card, Table } from 'antd';
import { PayStatus, PayStatusBColor, PayStatusColor } from '@/utils';
import '../styles/income-approval.css';

export const IncomeApproval = ({ data = [] }) => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const total = {
            key: data.length,
            amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.amount) || 0), 0) || 0).toFixed(2),
            paid_amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.paid_amount || 0)), 0) || 0).toFixed(2),
            remain_amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.remain_amount || 0)), 0) || 0).toFixed(2),
            isTotal: true,
        }
        setDataSource([ ...data, total]);
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
                title:'Income Category',
                dataIndex: 'account_category',
                key: 'account_category',
                width: '12%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title:'Name',
                dataIndex: 'name',
                key: 'name',
                width: '13%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title:'Outstanding',
                dataIndex: 'amount',
                key: 'amount',
                width: '9%',
                align: 'start',
                render: (text, record) => {
                    const status = parseFloat(record.amount) === parseFloat(record.remain_amount) ? PayStatus.Unpaid
                        : (parseFloat(record.remain_amount) ? PayStatus.HalfPaid : PayStatus.Paid);
                    return (
                        <div
                            className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}
                            style={record.isTotal ? {} : { background: PayStatusBColor[status], color: PayStatusColor[status], fontWeight: 500 }}
                        >
                            {text}
                        </div>
                    )
                }
            },
            {
                title:'Paid',
                dataIndex: 'paid_amount',
                key: 'paid_amount',
                width: '9%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title:'Remian',
                dataIndex: 'remain_amount',
                key: 'remain_amount',
                width: '9%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            // {
            //     title:'Transaction ID',
            //     dataIndex: 'tid1',
            //     key: 'tid1',
            //     width: '12%',
            //     align: 'start',
            //     render: (_, record, index) => (
            //         <Input placeholder='Enter Transaction id'
            //             value={record.tid1}
            //             onChange={(e) => handleInputChange(e.target.value, index, 'tid1')}
            //         />
            //     )
            // },
            // {
            //     title: 'Date',
            //     dataIndex: 'date',
            //     key: 'date',
            //     width: '10%',
            //     align: 'start',
            //     render: (_, record, index) => (  
            //         <div style={{ position: 'relative' }}>
            //             <DatePicker style={{width:'100%'}}
            //                 placeholder='DD-MM-YYYY'
            //                 format="DD-MM-YYYY"
            //                 value={record.date}
            //                 onChange={(e) => handleInputChange(e?.target?.value || e, index, 'date')}
            //             />
            //             {/* <Button type="primary"
            //                 size="small"
            //                 icon={index === data.length - 1 ? <PlusOutlined /> : <MinusOutlined />}
            //                 style={{
            //                     position: 'absolute',
            //                     right: '-14px',
            //                     top: '50%',
            //                     transform: 'translateY(-50%)',
            //                     zIndex: 1,
            //                 }}
            //                 onClick={() => handleRowAction2(index)}
            //             /> */}
            //         </div>
            //     )
            // },
        ]
    ), [dataSource]);

    return (
        <div className='income-approval'>
            <Card title={'Income Source'}>
                <Table
                    size={'middle'}
                    className='income-tbl'
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                />
            </Card>
        </div>
    )
}
