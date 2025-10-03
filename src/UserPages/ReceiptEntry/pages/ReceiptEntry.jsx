import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { fetchAllHoldReasons } from '@/features/HoldReason/HoldReasonSlice';
import { fetchAllSubAgent } from "@/features/subAgent/subAgentSlice";
import { fetchAllRembursement } from "@/features/rembursement/rembursementSlice";
import { fetchAccountEntryByAppId, saveReceiptEntry } from "@/features/accountEntry/accountEntrySlice";
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { ReceiptIncomeExpenseEntry } from '@/Components/ReceiptIncomeExpenseEntry/pages';
import { IncomeApproval } from '@/Components/IncomeApproval/pages';
import { ExpenseApproval } from '@/Components/ExpenseApproval/pages';
import { fetchAllBrokers } from '@/features/broker/brokerSlice';
import { fetchAllParty } from '@/features/party/partySlice';
import { fetchAllDealer } from '@/features/dealer/dealerSlice';
import dayjs from 'dayjs';

const updateSerialNumbers = (data, srKey) => {
    return data.map((item, index) => ({
        ...item,
        [srKey]: index + 1
    }))
}

export const ReceiptEntry = ({ application, processes }) => {
    const [grandTotal, setGrandTotal] = useState(0);
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [receiptEntryData, setReceiptEntryData] = useState([]);
    const dispatch = useDispatch();

    const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});
    const { allData: subAgents = [] } = useSelector((state) => state?.subAgent || {});
    const { allData: rembursements = [] } = useSelector((state) => state?.rembursement || {});
    const { allData: brokers = [] } = useSelector((state) => state?.broker || {});
    const { allData: parties = [] } = useSelector((state) => state?.party || {});
    const { allData: dealers = [] } = useSelector((state) => state?.dealer || {});
    const { data: accountEntry = {} } = useSelector((state) => state?.accountEntry || {});
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllHoldReasons());
        dispatch(fetchAllSubAgent());
        dispatch(fetchAllRembursement());
        dispatch(fetchAllBrokers());
        dispatch(fetchAllParty());
        dispatch(fetchAllDealer());
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
        } else {
            receiptsData = [{
                srNo: 1,
                account_category: null,
                account_ref_id: null,
                amount: null,
                payment_category: null,
                payment_purpose: null,
                payment_mode: null,
                transaction_no: null,
                date: dayjs(),
                income_expense_id: null
            }];
        }
        setReceiptEntryData(updateSerialNumbers(receiptsData, 'srNo'));

    }, [accountEntry?.receipts]);

    useEffect(() => {
        const total = receiptEntryData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
        setGrandTotal(total);
    }, [JSON.stringify(receiptEntryData)]);

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
            receipt_details: receiptEntryData,
            process_id: application?.process_id
        };
        await saveEntry(application?.id, data);
    }

    // File Movement handler
    const handleFileMovement = async (fileMovementData, closeDialog) => {
        const data = {
            receipt_details: receiptEntryData,
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

            <ReceiptIncomeExpenseEntry
                data={receiptEntryData}
                setData={setReceiptEntryData}
                grandTotal={grandTotal}
                updateSerialNumbers={updateSerialNumbers}
                dealers={dealers}
                brokers={brokers}
                parties={parties}
                rembursements={rembursements}
                subAgents={subAgents}
                incomes={incomeData}
                expenses={expenseData}
            />

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