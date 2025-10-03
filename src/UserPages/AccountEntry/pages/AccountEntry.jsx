import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import { ChargableAmount } from '@/Components/ChargableAmount/pages';
import { IncomeEntry } from '@/Components/IncomeEntry/pages';
import { ExpenseEntry } from '@/Components/ExpenseEntry/pages';
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { IncomeCategories, ExpenseCategories, IncomeCategoryType, FILE_MOVEMENT_TYPE } from '@/utils';
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { fetchAllService } from "@/features/service/serviceSlice";
import { fetchAllSubAgent } from "@/features/subAgent/subAgentSlice";
import { fetchAllRembursement } from "@/features/rembursement/rembursementSlice";
import { fetchAccountEntryByAppId, saveAccountEntry } from "@/features/accountEntry/accountEntrySlice";
import _ from 'lodash';

const updateSerialNumbers = (data, srKey) => {
    return data.map((item, index) => ({
        ...item,
        [srKey]: index + 1
    }))
}

export const AcountEntry = ({ application, processes }) => {
    const [grandTotal, setGrandTotal] = useState(0)
    const [chargableData, setChargableData] = useState([]) ;
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [brokers, setBrokers] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [parties, setParties] = useState([]);
    const [modal, contextHolder] = Modal.useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});
    const { allData: subAgents = [] } = useSelector((state) => state?.subAgent || {});
    const { allData: rembursements = [] } = useSelector((state) => state?.rembursement || {});
    const { data: accountEntry = {} } = useSelector((state) => state?.accountEntry || {});
    const services = useSelector((state) => state?.service?.allData || []);

    useEffect(() => {
        dispatch(fetchAllHoldReasons());
        dispatch(fetchAllSubAgent());
        dispatch(fetchAllRembursement());
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
            setBrokers(application.Broker?.id ? [{ value: application.Broker.id, label: application.Broker.name }] : []);
            setDealers(application.Dealer?.id ? [{ value: application.Dealer.id, label: application.Dealer.name }] : []);
            setParties(application.Party?.id ? [{ value: application.Party.id, label: application.Party.name}] : []);
        }
    }, [application?.id]);

    useEffect(() => {
        if (application?.id) {
            const serviceIds = [...(application?.service_ids || [])];
            serviceIds.sort();
            let serviceData = [];
            console.log('<<Chargable amount--', accountEntry?.chargableAmount, serviceIds)
            if (accountEntry?.chargableAmount?.length && services) {
                let accServiceIds = accountEntry.chargableAmount.map((val) => val.service_id);
                const diff = _.difference(serviceIds, accServiceIds);
                serviceData = accountEntry.chargableAmount.map((val, index) => {
                    const service = services.find((ser) => parseInt(ser.id) === parseInt(val.service_id));
                    let official_fee = parseFloat(val.official_fee || 0);
                    if (!official_fee) {
                        if (service?.amount_reflect_account && application?.reflect_in_account) {
                            official_fee = parseFloat(application.total_amount || 0);
                        }
                    }
                    return ({
                        ...val,
                        srNo: index + 1,
                        official_fee,
                        total: (official_fee + parseFloat(val.consultancy_fee || 0)).toFixed(2),
                        service: service?.name,
                    });
                });
                if (diff.length) {
                    diff.forEach((val) => {
                        const service = services.find((ser) => parseInt(ser.id) === parseInt(val));
                        let official_fee = 0;
                        if (service?.amount_reflect_account && application?.reflect_in_account) {
                            official_fee = parseFloat(application.total_amount || 0);
                        }
                        serviceData.push({
                            service: service?.name,
                            service_id: service?.id,
                            official_fee: official_fee,
                            consultancy_fee: 0,
                            total: official_fee
                        });
                    });
                }
                serviceData = serviceData.map((val, index) => ({ ...val, srNo: index + 1 }));
            } else {
                serviceData = serviceIds.map((val, index) => {
                    const service = services.find((ser) => parseInt(ser.id) === parseInt(val));
                    let official_fee = 0;
                    if (service?.amount_reflect_account && application?.reflect_in_account) {
                        official_fee = parseFloat(application.total_amount || 0);
                    }
                    return ({
                        srNo: index + 1,
                        service: service?.name,
                        service_id: service?.id,
                        official_fee: official_fee,
                        consultancy_fee: 0,
                        total: official_fee
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
            } else {
                incomes = IncomeCategories.map((value, index) => {
                    const options = value.key === IncomeCategoryType.Broker ? brokers : (value.key === IncomeCategoryType.Dealer ? dealers : parties);
                    const selectedValue = (options?.length ? options[0]?.value : undefined);
                    return ({
                        srNo: index + 1,
                        key: value.key,
                        account_category: value.name,
                        account_ref_id: selectedValue,
                        amount: 0,
                        paid_amount: 0,
                        remain_amount: 0
                    });
                });
            }
            setIncomeData(incomes);
        }
    }, [application, dealers, parties, brokers, accountEntry?.income])
    
    useEffect(() => {
        let expenses = [];
        if (accountEntry?.expense?.length) {
            expenses = accountEntry.expense.map((val, index) => ({
                ...val,
                srNo: index + 1
            }));
        } else {
            expenses = ExpenseCategories.map((value, index) => {
                return ({
                    srNo: index + 1,
                    key: value.key,
                    account_category: value.name,
                    amount: 0,
                    paid_amount: 0,
                    remain_amount: 0
                });
            });
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
                <ChargableAmount
                    data={chargableData}
                    setData={setChargableData}
                    grandTotal={grandTotal}
                    updateSerialNumbers={updateSerialNumbers}
                />

                <IncomeEntry
                    data={incomeData}
                    setData={setIncomeData}
                    grandTotal={grandTotal}
                    brokers={brokers}
                    dealers={dealers}
                    parties={parties}
                />

                <ExpenseEntry
                    data={expenseData}
                    setData={setExpenseData}
                    grandTotal={grandTotal}
                    subAgents={subAgents.map((val) => ({ value: val.id, label: val.name }))}
                    rembursements={rembursements.map((val) => ({ value: val.id, label: val.name }))}
                />
    
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