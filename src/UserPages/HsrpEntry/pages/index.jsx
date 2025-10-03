import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationDetails } from '@/Components/ApplicationDetails/pages';
import { Stepper } from '@/Components/Stepper/pages';
import HsrpEntryDetail from '@/UserPages/HsrpEntry/pages/HsrpEntryDetail';
import { fetchApplicationById } from '@/features/application/applicationSlice';
import '@/UserPages/HsrpEntry/styles/hsrpEntry.css'; // Assuming you have a CSS file for styles
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchApplicationProcessStatus } from '@/features/applicationProcessStatus/applicationProcessStatusSlice';
import { fetchAllParty } from '@/features/party/partySlice';
import { fetchAllUsers } from '@/features/user/userSlice';

const HsrpEntry = () => {
    const [currStep, setCurrStep] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;
    const { currApplication } = useSelector((state) => state.application || {});

    const process = useSelector(state => state?.process?.allData || []);
    const apllicationProcess = useSelector(state => state?.applicationProcessStatus?.allData || []);
    const parties = useSelector(state => state?.party?.allData || []);
    const employees = useSelector(state => state?.user?.allData || []);
    
    useEffect(() => {
        dispatch(fetchAllProcess());
        dispatch(fetchAllParty());
        dispatch(fetchAllUsers());
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

    // console.log(
    //     'Current Application:', currApplication,
    //     'Current Step:', currStep,
    //     'Processes:', process
    // );
    
    
    return (
        <div>
            <ApplicationDetails application={currApplication}/>
            <Stepper currentStep={currStep} processes={process} apllicationProcesses={apllicationProcess}/>
            <HsrpEntryDetail
                application={currApplication}
                processes={process}
                parties={parties || []}
                employees={employees || []}
            />
        </div>
    )
}

export default HsrpEntry;
