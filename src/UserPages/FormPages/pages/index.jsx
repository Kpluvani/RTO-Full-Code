import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationDetails } from '@/Components/ApplicationDetails/pages';
import { Stepper } from '@/Components/Stepper/pages';
import SendToRtoDetail from '@/UserPages/SendToRto/pages/SendToRtoDetail';
import { fetchApplicationById } from '@/features/application/applicationSlice';
import '@/UserPages/HsrpEntry/styles/hsrpEntry.css'; // Assuming you have a CSS file for styles
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchApplicationProcessStatus } from '@/features/applicationProcessStatus/applicationProcessStatusSlice';
import Form18 from './Form18';
import Form19 from './Form19';
import FormAB from './FormAB';
import Form20 from './Form20';
import Form20B from './Form20B';
import Form21 from './Form21';
import Form22 from './Form22';
import Form22A from './Form22A';
import Form22B from './Form22B';
import Form22C from './Form22C';
import Form22D from './Form22D';
import Form65 from './Form65';
import Form66 from './Form66';
import Form67 from './Form67';
import Form68 from './Form68';
import { Table, Typography } from 'antd';
import Form40 from './Form40';
import Form41 from './Form41';
import Form42 from './Form42';
import Form43 from './Form43';
import Form44 from './Form44';
import Form50 from './Form50';
import Form51 from './Form51';

const { Title } = Typography;

const FormPages = ({ application }) => {
    const [currStep, setCurrStep] = useState(0);
    const [currApplication, setCurrApplication] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = location;

    useEffect(() => {
        dispatch(fetchAllProcess());
    }, []);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return; // ✅ security
            if (event.data?.type === "APPLICATION_DATA") {
            setCurrApplication(event.data.payload);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    console.log('Current Application in Form Page:', currApplication);
    
    return (
        <div>
            {/* <ApplicationDetails application={currApplication}/>
            <Stepper currentStep={currStep} processes={process} apllicationProcesses={apllicationProcess}/> */}

            <Title level={2} style={{ textAlign: 'center', margin: '20px 0' }}>
                Forms
            </Title>

            <Typography style={{ marginBottom: '20px' , textAlign: 'center' , fontSize: '16px' }}>
                Application No: <span className='application'> {currApplication?.application_number || 'N/A'} </span>
            </Typography>
            
            <Table
                pagination={false}
                bordered
                columns={[
                {
                    title: "Form No.",
                    dataIndex: "formNo",
                    key: "formNo",
                    render: (text) => (
                    <Typography.Text level={5} style={{ margin: 0 }}>
                        {text}
                    </Typography.Text>
                    ),
                },
                { title: "Action",
                    dataIndex: "action",
                    key: "action", },
                ]}
                dataSource={[
                { key: "1",
                    formNo: "Form No. 18",
                    action: <Form18
                            application={currApplication}
                            />, 
                },
                { key: "2",
                    formNo: "Form No. 19",
                    action: <Form19 
                            application={currApplication}
                            />, 
                },
                { key: "3",
                    formNo: "Form A & B",
                    action: <FormAB 
                            application={currApplication}
                            />, 
                },
                { key: "4",
                    formNo: "Form 20",
                    action: <Form20 
                            application={currApplication}
                            />, 
                },
                { key: "21",
                    formNo: "Form 20 B",
                    action: <Form20B 
                            application={currApplication}
                            />, 
                },
                { key: "22",
                    formNo: "Form 21",
                    action: <Form21 
                            application={currApplication}
                            />, 
                },
                { key: "23",
                    formNo: "Form 22",
                    action: <Form22 
                            application={currApplication}
                            />, 
                },
                { key: "24",
                    formNo: "Form 22 A",
                    action: <Form22A 
                            application={currApplication}
                            />, 
                },
                { key: "25",
                    formNo: "Form 22 B",
                    action: <Form22B
                            application={currApplication}
                            />, 
                },
                { key: "26",
                    formNo: "Form 22 C",
                    action: <Form22C
                            application={currApplication}
                            />, 
                },
                { key: "27",
                    formNo: "Form 22 D",
                    action: <Form22D
                            application={currApplication}
                            />, 
                },
                { key: "40",
                    formNo: "Form 40",
                    action: <Form40
                            application={currApplication}
                            />, 
                },
                { key: "41",
                    formNo: "Form 41",
                    action: <Form41
                            application={currApplication}
                            />, 
                },
                { key: "42",
                    formNo: "Form 42",
                    action: <Form42
                            application={currApplication}
                            />, 
                },
                { key: "43",
                    formNo: "Form 43",
                    action: <Form43
                            application={currApplication}
                            />, 
                },
                { key: "44",
                    formNo: "Form 44",
                    action: <Form44
                            application={currApplication}
                            />, 
                },
                { key: "50",
                    formNo: "Form 50",
                    action: <Form50
                            application={currApplication}
                            />, 
                },
                { key: "51",
                    formNo: "Form 51",
                    action: <Form51
                            application={currApplication}
                            />, 
                },
                { key: "65",
                    formNo: "Form No. 65",
                    action: <Form65 
                            application={currApplication}
                            />,  
                },
                { key: "66",
                    formNo: "Form No. 66",
                    action: <Form66 
                            application={currApplication}
                            />, 
                },
                { key: "67",
                    formNo: "Form No. 67",
                    action: <Form67 
                            application={currApplication}
                            />, 
                },
                { key: "68",
                    formNo: "Form No. 68",
                    action: <Form68 
                            application={currApplication}
                            />,
                },
                ]}
                        />
        </div>
    )
}

export default FormPages;
