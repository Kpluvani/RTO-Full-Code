import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { ApplicationDetails } from '@/Components/ApplicationDetails/pages';
import { Stepper } from '@/Components/Stepper/pages';
import { fetchApplicationById, setApplicationId } from '@/features/application/applicationSlice';
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchApplicationProcessStatus } from '@/features/applicationProcessStatus/applicationProcessStatusSlice';
import { AcountApproval } from './AccountApproval';
import '../styles/account-approval.css';

const AcountApprovalView = () => {
    const [currStep, setCurrStep] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;
    const { currApplication, loading } = useSelector((state) => state.application || {});

    const process = useSelector(state => state?.process?.allData || []);
    const apllicationProcess = useSelector(state => state?.applicationProcessStatus?.allData || []);
    
    useEffect(() => {
        dispatch(fetchAllProcess());
    }, []);
    
    useEffect(() => {
        if (state?.applicationId) {
            setApplicationId(state.applicationId);
            dispatch(fetchApplicationById(state.applicationId));
            dispatch(fetchApplicationProcessStatus(state.applicationId));
        }
    }, [state?.applicationId]);

    useEffect(() => {
        if (currApplication) {
            setCurrStep(currApplication?.Process?.step);
        }
    }, [currApplication])
    
    return (
        <Spin spinning={loading}>
            <ApplicationDetails
                application={currApplication}
            />
                <Stepper currentStep={currStep} processes={process} apllicationProcesses={apllicationProcess}/>
                <AcountApproval application={currApplication} processes={process}/>
        </Spin>
    )
}

export default AcountApprovalView;