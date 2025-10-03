import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { ApplicationDetails } from '@/Components/ApplicationDetails/pages';
import { Stepper } from '@/Components/Stepper/pages';
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchApplicationById } from '@/features/application/applicationSlice';
import { fetchApplicationProcessStatus } from '@/features/applicationProcessStatus/applicationProcessStatusSlice';
import { Feedback } from './Feedback';
import '../styles/feedback.css';

const FeedbackView = () => {
    const [currStep, setCurrStep] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;
    const { currApplication } = useSelector((state) => state.application || {});

    const process = useSelector(state => state?.process?.allData || []);
    const apllicationProcess = useSelector(state => state?.applicationProcessStatus?.allData || []);
    
    useEffect(() => {
        dispatch(fetchAllProcess());
    }, []);

    useEffect(() => {
        if (state?.applicationId) {
            dispatch(fetchApplicationById(state.applicationId));
            dispatch(fetchApplicationProcessStatus(state.applicationId));
        }
    }, [state?.applicationId]);

    useEffect(() => {
        if (currApplication) {
            setCurrStep(currApplication?.Process?.step);
        }
    }, [currApplication]);

    return (
        <div>
            <ApplicationDetails application={currApplication}/>
            <Stepper currentStep={currStep} processes={process} apllicationProcesses={apllicationProcess}/>
            <Feedback application={currApplication} processes={process}/>
        </div>
    )
}

export default FeedbackView;
