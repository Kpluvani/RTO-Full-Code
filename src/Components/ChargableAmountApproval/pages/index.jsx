import React, { useMemo } from 'react';
import { Card, Table, Row, Col, Flex } from 'antd';
import '../styles/chargable-amount.css';
import dayjs from 'dayjs';

export const ChargableAmountApproval = ({ data, setData, grandTotal, application }) => {
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
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Agent Fee',
                dataIndex: 'consultancy_fee',
                key: 'consultancy_fee',
                width: '20%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                width: '20%',
                align: 'start',
                render: (text, record) => <div className={`sr-no-cell ${record.isTotal ? 'total-row' : ''}`}>{text}</div>
            },
        ]
    ), [dataSource]);

    return (
        <div className='chargable-amount-approval'>
            <Card title={'Chargable Amount'}>
                <div className='detail-card'>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Owner Name:</div>
                                <div className='detail-value'>{application?.OwnerDetail?.owner_name || ''}</div>
                            </Flex>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Chassis No:</div>
                                <div className='detail-value'>{application?.VehicleDetail?.chassis_no || ''}</div>
                            </Flex>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Vehicle:</div>
                                <div className='detail-value'>
                                    {`(${application?.VehicleDetail?.VehicleType?.name || ''}) ${application?.VehicleDetail?.VehicleCategory?.name || ''} (${application?.VehicleDetail?.Fuel?.name || ''})`}
                                </div>
                            </Flex>
                        </Col>
                        <Col span={12}>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Son/Wife/Daughter of:</div>
                                <div className='detail-value'>{application?.OwnerDetail?.relative_name || ''}</div>
                            </Flex>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Engin No:</div>
                                <div className='detail-value'>{application?.VehicleDetail?.engine_no || ''}</div>
                            </Flex>
                            <Flex gap={'small'}>
                                <div className='detail-label'>Sale Amount:</div>
                                <div className='detail-value'>
                                    {`Rs. ${application?.VehicleDetail?.sell_amount || '0'}/- (Purchase Date: ${dayjs(application?.VehicleDetail?.purchase_date).format('DD-MM-YYYY')})`}
                                </div>
                            </Flex>
                        </Col>
                    </Row>
                </div>
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
