import React, { useMemo } from 'react';
import CheckSvg from '@/assets/icons/check.svg?react';
import '../styles/stepper.css';

export const Stepper = ({ currentStep = 0, processes = [], apllicationProcesses = [] }) => {

    const lineWidth = useMemo(() => {
        const width = ((currentStep / (processes.length - 1)) * 100);
        return width > 100 ? 100 : width;
    }, [processes, currentStep])

    return (
        <div className='stepper'>
            <div className='stepper-wrapper'>
                {/* Progress line */}
                <div className='progress-line'>
                    <div
                        className='line'
                        style={{ width: `${lineWidth}%` }}
                    />
                </div>

                {processes
                    .slice()
                    .sort((a, b) => a.step - b.step)
                    .map((step) => {
                        // find matching application process
                        const appProcess = apllicationProcesses.find(
                            (ap) => ap.process_id === step.id
                        );

                        const status = appProcess?.status || 'NotStarted';
                        const isCompleted = status === 'Completed';
                        const isInProcess = status === '';
                        const isCurrent = step.step === currentStep;

                        const getIconStyle = (isRequired, isCurrent, isCompleted, isInProcess) => {
                            let styles = {
                                backgroundColor: 'rgb(240, 242, 245)',
                                border: '1px solid #6C757D',
                                boxShadow: 'none'
                            };

                            if (isCompleted) {
                                styles = {
                                    ...styles,
                                    backgroundColor: isRequired ? '#20C997' : '#FFC500',
                                    border: `1px solid ${isRequired ? '#20C997' : '#FFC500'}`,
                                };
                            } else if (isCurrent || isInProcess) {
                                styles = {
                                    ...styles,
                                    backgroundColor: '#1890ff',
                                    border: '2px solid #91d5ff',
                                    boxShadow: '0 0 0 2px #e6f7ff'
                                };
                            } else if (!isRequired) {
                                styles = {
                                    ...styles,
                                    border: '1px solid #FFC500'
                                };
                            }
                            return styles;
                        };

                        return (
                            <div className='progress-wrapper' key={step?.key}>
                                <div
                                    className={'progress-icon'}
                                    style={getIconStyle(
                                        step?.is_required,
                                        isCurrent,
                                        isCompleted,
                                        isInProcess
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckSvg style={{ maxWidth: '20px', color: '#ffffff' }} />
                                    ) : (
                                        <div
                                            style={{ color: isCurrent || isInProcess ? '#fff' : '#212529' }}
                                            dangerouslySetInnerHTML={{
                                                __html: step?.icon?.trim().startsWith('<svg')
                                                    ? step.icon
                                                    : '',
                                            }}
                                        />
                                    )}
                                </div>
                                <span className={'progress-label'}>
                                    {step?.name}
                                    <small style={{
                                        display: 'block',
                                        fontSize: '10px',
                                        color:
                                            status === 'Completed'
                                                ? '#20C997' // green
                                                : status === 'InProcess'
                                                ? '#1890ff' // blue
                                                : status === 'NotStarted'
                                                ? '#666' // gray
                                                : '#FFC500' // fallback yellow
                                    }}>
                                        {status}
                                    </small>
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};


