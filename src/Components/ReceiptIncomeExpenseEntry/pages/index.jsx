import React, { useEffect, useMemo } from 'react';
import { Card, Table, Button, DatePicker, Select } from 'antd';
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Input from '@/CustomComponents/CapitalizedInput';
import { ReceiptAccountCategories, PaymentCategories, PaymentMode, IncomeCategoryType, ExpenseCategoryType, PaymentCategoryType, PaymentPurposes } from '@/utils/constants';
import dayjs from 'dayjs';
import "../styles/receipt-entry.css";

export const ReceiptIncomeExpenseEntry = ({ data, setData, grandTotal, updateSerialNumbers, brokers = [], dealers = [], parties = [],
    rembursements = [], subAgents = [], incomes = [], expenses = []
 }) => {
    const dataSource = useMemo(() => {
        const total = {
            key: data.length,
            amount: (data?.reduce((prev, curr) => (prev + parseFloat(curr.amount || 0)), 0) || 0).toFixed(2),
            isTotal: true,
        };
        return ([...data, total]);
    }, [data]);

    const handleInputChange = (value, index, key) => {

        let newData = [...data];
        let val = value;
        const numericKeys = ['amount']
        if (numericKeys.includes(key)) {
            val = val.replace(/[^0-9\.]+/, ''); // Remove non-numeric characters
            val = isNaN(val) ? 0 : val;
        }
        if (key === 'account_category') {
            const incomeCategory = [IncomeCategoryType.Broker, IncomeCategoryType.Party, IncomeCategoryType.Dealer];
            const expenseCategory = [ExpenseCategoryType.SubAgent, ExpenseCategoryType.Rembursement];
            let payment_category = null;
            let account_ref_id = null;
            let income_expense_id = null;
            if (incomeCategory.includes(value)) {
                payment_category = PaymentCategoryType.Income;
                const entry = incomes.find((income) => income.account_category === value);
                account_ref_id = entry?.account_ref_id;
                income_expense_id = entry?.id;
            } else if (expenseCategory.includes(value)) {
                payment_category = PaymentCategoryType.Expense;
                const entry = expenses.find((expense) => expense.account_category === value);
                account_ref_id = entry?.account_ref_id;
                income_expense_id = entry?.id;
            }
            newData[index]['payment_category'] = payment_category;
            newData[index]['account_ref_id'] = account_ref_id;
            newData[index]['income_expense_id'] = income_expense_id;
        }
        newData[index][key] = val;

        setData(updateSerialNumbers(newData, 'srNo'));
    }

    const handleRowAction = (index) => {
        const isLast = index === data.length - 1;
        let updated
        if (isLast) {
            const newRow = {
                srNo: data.length + 1,
                account_category: null,
                account_ref_id: null,
                amount: null,
                payment_category: null,
                payment_purpose: null,
                payment_mode: null,
                transaction_no: null,
                date: dayjs(),
                income_expense_id: null,
                isNew: true,
            };
            updated = [...data, newRow];
        } else {
            updated = [...data]
            updated.splice(index, 1)
        }
        setData(updateSerialNumbers(updated || [], 'srNo'));
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
                title: 'Account',
                dataIndex: 'account_category',
                key: 'account_category',
                width: '10%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Select
                        className='w-full'
                        placeholder={"Select"}
                        showSearch={true}
                        value={value}
                        onChange={(val) => handleInputChange(val, index, 'account_category')}
                        filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                        options={ReceiptAccountCategories.map((val) => ({ value: val, label: val }))}
                    />
                )
            },
            {
                title: 'Name',
                dataIndex: 'account_ref_id',
                key: 'account_ref_id',
                width: '15%',
                align: 'start',
                render: (value, record, index) => {
                    let options = [];
                    let entry;
                    switch (record.account_category) {
                        case IncomeCategoryType.Broker:
                            entry = incomes.find((income) => income.account_category === IncomeCategoryType.Broker);
                            options = brokers.filter((val) => val.id === entry?.account_ref_id);
                            break;
                        case IncomeCategoryType.Dealer:
                            entry = incomes.find((income) => income.account_category === IncomeCategoryType.Dealer);
                            options = dealers.filter((val) => val.id === entry?.account_ref_id);
                            break;
                        case IncomeCategoryType.Party:
                            entry = incomes.find((income) => income.account_category === IncomeCategoryType.Party);
                            options = parties.filter((val) => val.id === entry?.account_ref_id);
                            break;
                        case ExpenseCategoryType.SubAgent:
                            entry = expenses.find((expense) => expense.account_category === ExpenseCategoryType.SubAgent);
                            options = subAgents.filter((val) => val.id === entry?.account_ref_id);
                            break;
                        case ExpenseCategoryType.Rembursement:
                            entry = expenses.find((expense) => expense.account_category === ExpenseCategoryType.Rembursement);
                            options = rembursements.filter((val) => val.id === entry?.account_ref_id);
                            break;
                    }
                    return record.isTotal ? <div className="total-row">{value}</div> : (
                        <Select
                            placeholder={`Select ${record.account_category || ''}`}
                            style={{ width: '100%' }}
                            value={value}
                            onChange={(val) => handleInputChange(val, index, 'account_ref_id')}
                            showSearch={true}
                            filterOption={(input, option) => option.label?.toLowerCase()?.includes(input?.toLowerCase())}
                            options={options.map((val) => ({ value: val.id, label: val.name }))}
                        >
                        </Select>
                    )
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                width: '10%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder={'Amount'}
                        value={record.amount}
                        onChange={(e) => handleInputChange(e.target.value, index, 'amount')}
                    />
                )
            },
            {
                title: 'Payment Category',
                dataIndex: 'payment_category',
                key: 'payment_category',
                width: '7%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Select
                        className='w-full payment'
                        placeholder={"Category"}
                        showSearch={true}
                        value={value}
                        onChange={(val) => handleInputChange(val, index, 'payment_category')}
                        filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                        options={PaymentCategories.map((val) => ({ value: val, label: val }))}
                        disabled={true}
                    />
                )
            },
            {
                title: 'Payment Purpose',
                dataIndex: 'payment_purpose',
                key: 'payment_purpose',
                width: '10%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Select
                        className='w-full'
                        placeholder={"Select"}
                        showSearch={true}
                        value={value}
                        onChange={(val) => handleInputChange(val, index, 'payment_purpose')}
                        filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                        options={PaymentPurposes.map((val) => ({ value: val, label: val }))}
                    />
                )
            },
            {
                title: 'Mode',
                dataIndex: 'payment_mode',
                key: 'payment_mode',
                width: '7%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Select
                        className='w-full'
                        placeholder={"Select"}
                        showSearch={true}
                        value={value}
                        onChange={(val) => handleInputChange(val, index, 'payment_mode')}
                        filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                        options={PaymentMode.map((val) => ({ value: val, label: val }))}
                    />
                )
            },
            {
                title: 'Transaction Id',
                dataIndex: 'transaction_no',
                key: 'transaction_no',
                width: '12%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <Input
                        placeholder={'Transaction Id'}
                        value={record.transaction_no}
                        onChange={(e) => handleInputChange(e.target.value, index, 'transaction_no')}
                    />
                )
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: '10%',
                align: 'start',
                render: (value, record, index) => record.isTotal ? <div className="total-row">{value}</div> : (
                    <div style={{ position: 'relative' }}>
                        <DatePicker style={{ width:'100%' }}
                            placeholder='DD-MM-YYYY'
                            format="DD-MM-YYYY"
                            value={record.date}
                            onChange={(date) => handleInputChange(date, index, 'date')}
                        />
                        <Button type="primary"
                            size="small"
                            icon={(index === data.length - 1 || data.length === 1) ? <PlusOutlined /> : <MinusOutlined />}
                            style={{
                                position: 'absolute',
                                right: '-14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                            }}
                            onClick={() => handleRowAction(index)}
                        />
                    </div>
                )
            },
        ]
    ), [dataSource, brokers, dealers, parties, rembursements, subAgents, incomes, expenses]);

    return (
        <div className='receipt-entry'>
            <Card title={'Receipt Entry'}>
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
