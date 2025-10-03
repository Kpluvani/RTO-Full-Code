import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationDetails } from '@/Components/ApplicationDetails/pages';
import { Stepper } from '@/Components/Stepper/pages';
import ServiceEntryDetail from '@/UserPages/ServiceEntry/pages/ServiceEntryDetail';
import { fetchApplicationById } from '@/features/application/applicationSlice';
import '@/UserPages/ServiceEntry/styles/serviceEntry.css'; // Assuming you have a CSS file for styles
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchApplicationProcessStatus } from '@/features/applicationProcessStatus/applicationProcessStatusSlice';


const ServiceEntry = () => {
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

    console.log(
        'Current Application:', currApplication,
        'Current Step:', currStep,
        'Processes:', process
    );
    
    
    return (
        <div>
            <ApplicationDetails application={currApplication}/>
            <Stepper currentStep={currStep} processes={process} apllicationProcesses={apllicationProcess}/>
            <ServiceEntryDetail application={currApplication} processes={process} />
        </div>
    )
}

export default ServiceEntry;
