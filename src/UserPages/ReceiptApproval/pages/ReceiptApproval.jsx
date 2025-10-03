import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { fetchAllHoldReasons } from '@/features/HoldReason/HoldReasonSlice';
import { fetchAccountEntryByAppId, saveReceiptEntry } from "@/features/accountEntry/accountEntrySlice";
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { ReceiptIncomeExpenseApproval } from '@/Components/ReceiptIncomeExpenseApproval/pages';
import { IncomeApproval } from '@/Components/IncomeApproval/pages';
import { ExpenseApproval } from '@/Components/ExpenseApproval/pages';
import dayjs from 'dayjs';

const updateSerialNumbers = (data, srKey) => {
    return data.map((item, index) => ({
        ...item,
        [srKey]: index + 1
    }))
}

export const ReceiptApproval = ({ application, processes }) => {
    const [grandTotal, setGrandTotal] = useState(0);
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [receiptApprovalData, setReceiptApprovalData] = useState([]);
    const dispatch = useDispatch();

    const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});
    const { data: accountEntry = {} } = useSelector((state) => state?.accountEntry || {});
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllHoldReasons());
    }, []);

    useEffect(() => {
        if (application?.id) {
            console.log('<<Applications--', application);
            dispatch(fetchAccountEntryByAppId(application.id));
        }
    }, [application?.id]);

    useEffect(() => {
        let incomes = [];
        if (accountEntry?.income?.length) {
            incomes = accountEntry.income.map((val, index) => ({
                ...val,
                srNo: index + 1
            }));
        }
        setIncomeData(incomes);
    }, [accountEntry?.income])

    useEffect(() => {
        let expenses = [];
        if (accountEntry?.expense?.length) {
            expenses = accountEntry.expense.map((val, index) => ({
                ...val,
                srNo: index + 1
            }));
        }
        setExpenseData(expenses);
    }, [accountEntry?.expense])

    useEffect(() => {
        let receiptsData = [];
        if (accountEntry?.receipts?.length) {
            receiptsData = accountEntry?.receipts.map((val) => {
                return ({
                    ...val,
                    date: val.date && dayjs(val.date)
                })
            });
        }
        setReceiptApprovalData(updateSerialNumbers(receiptsData, 'srNo'));

    }, [accountEntry?.receipts]);

    useEffect(() => {
        const total = receiptApprovalData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
        setGrandTotal(total);
    }, [JSON.stringify(receiptApprovalData)]);

    const saveEntry = async (id, data) => {
        const res = await dispatch(saveReceiptEntry({ id, data }));
        if (res.error) {
            message.error(res.payload || 'Failed to save data');
        } else {
            message.success(res.payload.message || 'Data saved successfully');
            if (data.file_movement) {
                navigate('/home');
            }
        }
    }

    const handleSaveData = async () => {
        const data = {
            receipt_details: receiptApprovalData,
            process_id: application?.process_id
        };
        await saveEntry(application?.id, data);
    }

    // File Movement handler
    const handleFileMovement = async (fileMovementData, closeDialog) => {
        const data = {
            receipt_details: receiptApprovalData,
            process_id: application?.process_id,
            ...fileMovementData
        };
        await saveEntry(application?.id, data)
        closeDialog && closeDialog();
    };

    return (
        <> 
            <IncomeApproval data={incomeData}/>

            <ExpenseApproval data={expenseData}/>

            <ReceiptIncomeExpenseApproval data={receiptApprovalData} grandTotal={grandTotal}/>

            <SaveAndFileMovement
                processes={processes}
                currProcessId={application?.process_id}
                holdReasons={holdReasons}
                handleSaveData={handleSaveData}
                handleFileMovement={handleFileMovement}
            />
        </>
    )
}