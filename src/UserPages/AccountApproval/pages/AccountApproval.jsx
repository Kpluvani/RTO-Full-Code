import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import { ChargableAmountApproval } from '@/Components/ChargableAmountApproval/pages';
import { IncomeApproval } from '@/Components/IncomeApproval/pages';
import { ExpenseApproval } from '@/Components/ExpenseApproval/pages';
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { FILE_MOVEMENT_TYPE } from '@/utils';
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { fetchAllService } from "@/features/service/serviceSlice";
import { fetchAccountEntryByAppId, saveAccountEntry } from "@/features/accountEntry/accountEntrySlice";
import _ from 'lodash';

const updateSerialNumbers = (data, srKey) => {
    return data.map((item, index) => ({
        ...item,
        [srKey]: index + 1
    }))
}

export const AcountApproval = ({ application, processes }) => {
    const [grandTotal, setGrandTotal] = useState(0);
    const [chargableData, setChargableData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [modal, contextHolder] = Modal.useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});
    const { data: accountEntry = {} } = useSelector((state) => state?.accountEntry || {});
    const services = useSelector((state) => state?.service?.allData || []);

    useEffect(() => {
        dispatch(fetchAllHoldReasons());
    }, []);

    useEffect(() => {
        if (application?.id) {
            dispatch(fetchAccountEntryByAppId(application.id));
            dispatch(fetchAllService(
                {
                    where: {  
                        vehicle_type_id: application?.VehicleDetail?.VehicleType?.id, 
                        work_category_id: application?.work_category_id ? application?.work_category_id : 1 
                    }
                }
            ));
            console.log('<<Applications--', application);
        }
    }, [application?.id]);

    useEffect(() => {
        if (application?.id) {
            const serviceIds = [...(application?.service_ids || [])];
            serviceIds.sort();
            let serviceData = [];
            if (accountEntry?.chargableAmount?.length) {
                serviceData = accountEntry.chargableAmount.map((val, index) => {
                    const service = services.find((ser) => parseInt(ser.id) === parseInt(val.service_id));
                    return ({
                        ...val,
                        srNo: index + 1,
                        service: service?.name,
                    });
                });
            }
            setChargableData(serviceData);
        } else {
            setChargableData([]);
        }
    }, [application?.id, services, accountEntry?.chargableAmount]);

    useEffect(() => {
        if (application?.id) {
            let incomes = [];
            if (accountEntry?.income?.length) {
                incomes = accountEntry.income.map((val, index) => ({
                    ...val,
                    srNo: index + 1
                }));
            }
            setIncomeData(incomes);
        }
    }, [application, accountEntry?.income])
    
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
        const total = chargableData.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
        setGrandTotal(total);
    }, [JSON.stringify(chargableData)]);

    const validateAmount = () => {
        const totalIncome = (incomeData || [])?.reduce((prev, curr) => prev + parseFloat(curr.amount || 0), 0);
        return (parseFloat(grandTotal || 0) === totalIncome || 0);
    }

    const saveEntry = async (id, data) => {
        console.log('<<Save entry--', id, data);
        const isValid = validateAmount();
        const isFileMnt = data.file_movement ? (data.file_movement_type === FILE_MOVEMENT_TYPE.NEXT ? isValid : true) : isValid;
        if (isFileMnt) {
            const res = await dispatch(saveAccountEntry({ id, data }));
            if (res.error) {
                message.error(res.payload || 'Failed to save data');
            } else {
                message.success(res.payload.message || 'Data saved successfully');
                if (data.file_movement) {
                    navigate('/home');
                }
            }
        } else {
            modal.warning({
                title: '',
                centered: true,
                content: (
                    <div>
                        Total Chargable Amount and Total Income Amount should be same.
                    </div>
                ),
                className: 'amount-validate-modal',
                okButtonProps: {
                    style: { margin: 'auto', display: 'block' }
                }
            });
        }
    }

    const handleSaveData = async () => {
        const data = {
            chargable_amount: chargableData,
            Income: incomeData,
            Expense: expenseData,
            process_id: application?.process_id
        };
        await saveEntry(application?.id, data)
    }

    // File Movement handler
    const handleFileMovement = async (fileMovementData, closeDialog) => {
        const data = {
            chargable_amount: chargableData,
            Income: incomeData,
            Expense: expenseData,
            process_id: application?.process_id,
            ...fileMovementData
        };
        await saveEntry(application?.id, data)
        closeDialog && closeDialog();
    };

    return (
        <>
            {contextHolder}
            <div className="container">
                <ChargableAmountApproval
                    data={chargableData}
                    application={application}
                    setData={setChargableData}
                    grandTotal={grandTotal}
                    updateSerialNumbers={updateSerialNumbers}
                />

                <IncomeApproval data={incomeData}/>

                <ExpenseApproval data={expenseData}/>
    
                <SaveAndFileMovement
                    processes={processes}
                    currProcessId={application?.process_id}
                    holdReasons={holdReasons}
                    handleSaveData={handleSaveData}
                    handleFileMovement={handleFileMovement}
                />
            </div>
        </>
    )
}