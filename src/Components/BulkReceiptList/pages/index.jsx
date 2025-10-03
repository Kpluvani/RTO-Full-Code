import React, { useState, useMemo } from 'react';
import { Typography, Table, Select, Checkbox, Modal } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { PaymentMode, PaymentPurposes } from '@/utils';
import dayjs from 'dayjs';
import "../styles/bulkReceiptList.css";

const { Title, Text } = Typography;

export const BulkReceiptList = ({ data = [], setData, tableConfig, searchBy }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const dataSource = useMemo(() => {
        if (!data?.length) return [];
        return data.map((item, index) => {
            const app = item.Application || item; 
            const cfg = tableConfig[searchBy];

            return {
                key: index,
                id: item.id,
                sr_no: index + 1,
                name: cfg?.nameKey(item),
                fileNo: app?.file_number || "_",
                app_no: app?.application_number || "_",
                date: app?.application_date? dayjs(app.application_date).isValid()? dayjs(app.application_date).format("DD-MM-YYYY") : "_" : "_",
                regNo: app?.VehicleDetail?.registration_no || "_",
                purpose: item.purpose || null,
                outstanding: item?.outstanding ?? "0",
                paid: item?.paid ?? "0",
                amount: item?.amount ?? "0",
                payAmount: item?.payAmount ?? "0",
                paymentMode: item.paymentMode || null,
                transactionId: item.transactionId || "",
                selected: !!item.selected
            };
        });
    }, [data, searchBy]);

    const totalOutstanding = useMemo(() => (
        dataSource?.reduce((sum, row) => sum + parseFloat(row?.outstanding || 0), 0)
    ), [dataSource]);
    const totalAmount = useMemo(() => (
        dataSource?.reduce((sum, row) => sum + parseFloat(row?.amount || 0), 0)
    ), [dataSource]);
    const totalPayAmount = useMemo(() => (
        dataSource?.reduce((sum, row) => sum + parseFloat(row?.payAmount || 0), 0)
    ), [dataSource]);
    const totalPaid = useMemo(() => (
        dataSource?.reduce((sum, row) => sum + parseFloat(row?.paid || 0), 0)
    ), [dataSource]);
 
    const handleInputChange = (key, value, index) => {
        let newData = data.slice(0);
        newData[index][key] = value;
        if (key === 'selected') {
            newData[index]['payAmount'] = value ? (newData[index]['outstanding'] || 0) : 0;
        }
        setData(newData);
    }

    const onBlurPayAmount = (value, record) => {
        if (parseFloat(value || 0) > parseFloat(record.outstanding || 0)) {
            const newData = data?.slice(0) || [];
            newData[record.key]['payAmount'] = newData[record.key]['outstanding'] || 0;
            setData(newData);
            Modal.warning({
                title: 'Invalid Amount',
                centered: true,
                content: (
                    <div>Pay amount shouldn't be greater than outstanding value.</div>
                ),
                className: '',
                okButtonProps: {
                    style: { margin: 'auto', display: 'block' }
                }
            })
        }
    }

    const columns = useMemo(() => ([
        { title: "SR No", dataIndex: "sr_no", key: "sr_no", width: "5%" },
        { title: tableConfig[searchBy]?.nameLabel, dataIndex: "name", key: "name", width: "12%" },
        { title: "File No", dataIndex: "fileNo", key: "fileNo", width: "8%" },
        { title: "Application No", dataIndex: "app_no", key: "app_no", width: "9%" },
        { title: "Date", dataIndex: "date", key: "date", width: "6%" },
        { title: "Registration No", dataIndex: "regNo", key: "regNo", width: "9%" },
        {
            title: "Payment Purpose",
            dataIndex: "purpose",
            key: "purpose",
            width: "9%",
            render: (value, record) => (
                <Select
                    placeholder="Select"
                    className='w-full'
                    value={value}
                    options={PaymentPurposes.map((val) => ({ value: val, label: val }))}
                    onChange={(val) => handleInputChange('purpose', val, record.key)}
                    disabled={!record.selected}
                    showSearch={true}
                    filterOption={(input, option) =>
                        option.label?.toLowerCase()?.includes(input?.toLowerCase())
                    }
                />
            ),
        },
        {
            title: "Payment Mode",
            dataIndex: "paymentMode",
            key: "paymentMode",
            width: "8%",
            render: (value, record) => (
                <Select
                    placeholder="Select"
                    value={value}
                    style={{ width: "100%" }}
                    options={PaymentMode.map((val) => ({ value: val, label: val }))}
                    onChange={(val) => handleInputChange('paymentMode', val, record.key)}
                    disabled={!record.selected}
                    showSearch={true}
                    filterOption={(input, option) =>
                        option.label?.toLowerCase()?.includes(input?.toLowerCase())
                    }
                />
            ),
        },
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            key: "transactionId",
            width: "10%",
            render: (value, record) => (
                <Input
                    placeholder="Enter Transaction ID"
                    value={value}
                    onChange={(e) => handleInputChange('transactionId', e.target.value, record.key)}
                    disabled={!record.selected}
                />
            ),
        },
        {
            title: "Total Amount",
            dataIndex: "amount",
            key: "amount",
            width: "7%",
        },
        {
            title: "Outstanding",
            dataIndex: "outstanding",
            key: "outstanding",
            width: "8%",
        },
        {
            title: "Pay Amount",
            dataIndex: "payAmount",
            key: "payAmount",
            width: "15%",
            render: (value, record) => (
                <Input
                    placeholder="Enter Amount"
                    value={value}
                    onChange={(e) => handleInputChange('payAmount', e.target.value, record.key)}
                    disabled={!record.selected}
                    onBlur={() => onBlurPayAmount(value, record)}
                />
            ),
        },
        {
            title: () => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Checkbox
                    checked={dataSource?.length > 0 && selectedRowKeys.length === dataSource.length}
                    indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < (dataSource?.length || 0)}
                    onChange={e => {
                        if (e.target.checked) {
                            const allKeys = dataSource.map(item => item.key);
                            setSelectedRowKeys(allKeys);
                        } else {
                            setSelectedRowKeys([]);
                        }
                        const newData = data.map((val) => ({
                            ...val,
                            selected: e.target.checked,
                            payAmount: e.target.checked ? (val.outstanding || 0) : 0,
                        }));
                        setData(newData);
                    }}
                >
                    Action
                </Checkbox>
                </div>
            ),
            dataIndex: "selected",
            key: "selected",
            align: "center",
            render: (value, record) => {
                const key = record.key;
                return (
                <Checkbox
                    checked={value}
                    onChange={e => {
                        handleInputChange('selected', e.target.checked, key);
                        if (e.target.checked) {
                            setSelectedRowKeys(prev =>
                            prev.includes(key) ? prev : [...prev, key]
                            );
                        } else {
                            setSelectedRowKeys(prev => prev.filter(k => k !== key));
                        }
                    }}
                />
                );
            },
        }
    ]), [selectedRowKeys, dataSource]);

    return (
        <div className='bulk-receipt-list'>
            <Title level={4} className='title'>Result</Title>

            <Table
                size={'middle'}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered
                summary={() => (
                    dataSource?.length ? (<>
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={9} align="right">
                                <Text>Total</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <Text>{totalAmount}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <Text>{totalOutstanding}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                                <Text>{totalPayAmount}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell/>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={9} align="right">
                                <Text>Total Paid Amount</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell colSpan={3}>
                                <Text>{totalPaid}</Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </>) : null
                )}
            />
        </div>
    );
}