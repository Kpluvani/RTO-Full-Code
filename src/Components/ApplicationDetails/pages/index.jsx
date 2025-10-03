import React, { useEffect, useState , useRef} from 'react';
import { useDispatch } from 'react-redux';
import { Card, Row, Col, Typography, Space, Button } from 'antd';
import Input from '@/CustomComponents/CapitalizedInput';
import { convertUTCToIST, DateFormat } from '@/utils';
import { saveDataEntry } from '@/features/application/applicationSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/applicationDetails.css';

const { Title } = Typography;

export const ApplicationDetails = ({ application = {}, setRegistrationNo }) => {
    

    const inputRef = useRef(null);

  
useEffect(() => {
  if (inputRef.current) {
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  }
}, [])

  const handleClick = () => {
    console.log("Input clicked automatically on page load!");
  };

    const [regiNo, setRegiNo] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formUrl = `/form-pages`;

    const NavigateForm = () => {
        const newWindow = window.open("/form-pages", "_blank"); // 👈 opener maintain karo

        if (!newWindow) return;

        const sendMessage = () => {
            newWindow.postMessage(
            { type: "APPLICATION_DATA", payload: application },
            window.location.origin
            );
        };

        // jab tab load thaye, tab data moklo
        newWindow.onload = () => {
            sendMessage();
        };

        // fallback (jo onload na chale to 1 sec baad push)
        setTimeout(sendMessage, 1000);
    };


    useEffect(() => {
        setRegiNo(application?.VehicleDetail?.vehicle_no || '');
    }, [application?.VehicleDetail?.vehicle_no])
    
    return (
        <div className="bg-gray-50 p-4 md:p-8 application-details">
            <div className='application-box'
                style={{ margin: '0 auto' }}
            >
                <Row xs={24} sm={12} lg={8} className='box-header'>
                        <Title level={4}>Application Details</Title>
                        <Button type="primary" onClick={NavigateForm}>Print</Button>
                </Row>
                <Row xs={24} sm={12} lg={8} className='detail-body'>
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label>Application No :</label>
                            <Input value={application?.application_number || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label>Application Date :</label>
                            <Input value={application?.application_date && convertUTCToIST(application?.application_date).format(DateFormat)} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label>File No :</label>
                            <Input value={application?.file_number || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label>Owner Name :</label>
                            <Input value={application?.OwnerDetail?.owner_name || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Chassis No :</label>
                            <Input value={application?.VehicleDetail?.chassis_no} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Registration No :</label>
                            <Input 
                                tabIndex={1} 
                                autoFocus={true}
                                 onClick={handleClick}
                                placeholder="Enter registration number"
                                style={{ backgroundColor: '#fff' }}
                                value={regiNo}
                                onChange={(e) => setRegiNo(e.target.value)}
                                onBlur={(e) => {
                                    if (setRegistrationNo) {
                                        setRegistrationNo(e.target.value);
                                    } else {
                                        dispatch(saveDataEntry({
                                            id: application.id,
                                            data: {
                                                registration_no: e.target.value || null,
                                                vehicle_no: e.target.value || null,
                                                process_id: application.process_id
                                            }
                                        }))
                                    }                                    
                                }}
                            />
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Vehicle Class :</label>
                            <Input value={application?.VehicleDetail?.VehicleClass?.name || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Fuel Type :</label>
                            <Input value={application?.VehicleDetail?.Fuel?.name || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={12} lg={8}>
                        <Space direction="horizontal">
                            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Engine No :</label>
                            <Input value={application?.VehicleDetail?.engine_no || ''} readOnly className='readonly-input'/>
                        </Space>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
