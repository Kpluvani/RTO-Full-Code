import React, { useMemo } from 'react';
import { Card, Table } from 'antd';
import Input from '@/CustomComponents/CapitalizedInput';
import '../styles/chargable-amount.css';

export const ChargableAmount = ({ data, setData, grandTotal }) => {
    const dataSource = useMemo(() => {
        const total = {
            key: data.length,
            official_fee: (data?.reduce((prev, curr) => (prev + parseFloat(curr.official_fee) || 0), 0) || 0).toFixed(2),
            consultancy_fee: (data?.reduce((prev, curr) => (prev + parseFloat(curr.consultancy_fee || 0)), 0) || 0).toFixed(2),
            total: (data?.reduce((prev, curr) => (prev + parseFloat(curr.total || 0)), 0) || 0).toFixed(2),
            isTotal: true,
        };
        return ([...data, total]);
    }, [data]);

    const handleInputChange = (value, index, key) => {
        let newData = [...data];
        let val = value;
        const numericKeys = ['official_fee', 'consultancy_fee', 'total'];
        if (numericKeys.includes(key)) {
            val = value.replace(/[^0-9\.]+/, ''); // Remove non-numeric characters
            val = isNaN(val) ? 0 : val;
        }
        newData[index][key] = val;
        const official_fee = parseFloat(newData[index].official_fee || 0);
        const consultancy_fee = parseFloat(newData[index].consultancy_fee || 0);
        newData[index]['total'] = official_fee + consultancy_fee;
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
                title: 'Service',
                dataIndex: 'service',
                key: 'service',
                width: '20%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Official Fee',
                dataIndex: 'official_fee',
                key: 'official_fee',
                width: '20%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder='0'
                        value={value}
                        onChange={(e) => handleInputChange(e.target.value, index, 'official_fee')}
                    />
                )
            },
            {
                title: 'Agent Fee',
                dataIndex: 'consultancy_fee',
                key: 'consultancy_fee',
                width: '20%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder='0'
                        value={value}
                        onChange={(e) => handleInputChange(e.target.value, index, 'consultancy_fee')}
                    />
                )
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                width: '20%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <div style={{ position: 'relative' }}>
                        <Input
                            placeholder='0'
                            value={record.total}  
                            readOnly={true}
                        />
                        {/* <Button type="primary"
                            size='small'
                            icon={index === data.length - 1 ? <PlusOutlined /> : <MinusOutlined />}
                            style={{
                                position: 'absolute',
                                right: '-14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                            }}
                            onClick={() => handleRowAction1(index)}
                        /> */}
                    </div>
                )
            },
        ]
    ), [dataSource]);

    return (
        <div className='chargable-amount'>
            <Card title={'Chargable Amount'}>
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
