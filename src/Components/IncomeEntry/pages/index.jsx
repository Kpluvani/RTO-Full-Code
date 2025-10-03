import { useMemo } from 'react';
import { Card, Table, Select } from 'antd';
import Input from '@/CustomComponents/CapitalizedInput';
import { IncomeCategoryType } from '@/utils';
import '../styles/income-entry.css';

export const IncomeEntry = ({ data, setData, grandTotal, brokers = [], parties = [], dealers = [] }) => {
    const dataSource = useMemo(() => {
        const total = {
            key: data.length,
            amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.amount) || 0), 0) || 0).toFixed(2),
            paid_amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.paid_amount || 0)), 0) || 0).toFixed(2),
            remain_amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.remain_amount || 0)), 0) || 0).toFixed(2),
            isTotal: true,
        };
        return ([...data, total]);
    }, [data]);

    const handleInputChange = (value, index, key) => {
        let newData = [...data];
        let val = value;
        const numericKeys = ['amount', 'paid_amount', 'remain_amount']
        if (numericKeys.includes(key)) {
            val = val.replace(/[^0-9\.]+/, ''); // Remove non-numeric characters
            val = isNaN(val) ? 0 : val;
        }
        if (key === 'amount') {
            const remain = (val - parseFloat(newData[index]['paid_amount'] || 0)).toFixed(2);
            newData[index]['remain_amount'] = remain;  
        }
        newData[index][key] = val;
        setData(newData);
    }

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
                dataIndex: 'account_ref_id',
                key: 'account_ref_id',
                width: '13%',
                align: 'start',
                render: (value, record, index) => {
                    const options = record.account_category === IncomeCategoryType.Broker ? brokers : 
                        (record.account_category === IncomeCategoryType.Dealer ? dealers : parties);
                    return record.isTotal ? (<div className="total-row">{value}</div>) : (
                        <Select
                            placeholder={`Select ${record.account_category}`}
                            style={{ width: '100%' }}
                            value={value}
                            onChange={(val) => handleInputChange(val, index, 'account_ref_id')}
                            showSearch={true}
                            filterOption={(input, option) => option.label?.toLowerCase()?.includes(input?.toLowerCase())}
                            options={options}
                        >
                        </Select>
                    )
                }
            },
            {
                title:'Outstanding',
                dataIndex: 'amount',
                key: 'amount',
                width: '9%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder='0'
                        value={value}
                        onChange={(e) => handleInputChange(e.target.value, index, 'amount')}
                    />
                )
            },{
                title:'Paid',
                dataIndex: 'paid_amount',
                key: 'paid_amount',
                width: '9%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder='0'
                        value={record.paid_amount}
                        onChange={(e) => handleInputChange(e.target.value, index, 'paid_amount')}
                        readOnly={true}
                    />
                )
            },{
                title:'Remian',
                dataIndex: 'remain_amount',
                key: 'remain_amount',
                width: '9%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder='0'
                        value={record.remain_amount}
                        onChange={(e) => handleInputChange(e.target.value, index, 'remain_amount')}
                        readOnly={true}
                    />
                )
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
    ), [dealers, parties, brokers, dataSource]);

    return (
        <div className='income-entry'>
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
