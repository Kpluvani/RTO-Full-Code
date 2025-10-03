import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Col, Button, Form, Modal, Select, Flex, message, DatePicker } from 'antd';
import { fetchAllRtos } from '@/features/rto/rtoSlice';
import { fetchAllRegistrationTypes } from '@/features/registrationType/registrationTypeSlice';
import { fetchAllOwnershipTypes } from '@/features/ownershipType/ownershipTypeSlice';
import { fetchAllOwnerCategories } from '@/features/ownerCategory/ownerCategorySlice';
import { fetchAllStates } from '@/features/state/stateSlice';
import { fetchAllDistricts } from '@/features/district/districtSlice';
import { fetchAllVehicalClasses } from '@/features/vehicalClass/vehicalClassSlice';
import { fetchAllVehicalCategories } from '@/features/vehicalCategory/vehicalCategorySlice';
import { fetchAllVehicalType } from '@/features/vehicalType/vehicalTypeSlice';
import { registerNewApplication } from '@/features/application/applicationSlice';
import { OwnerDetails } from '@/Components/OwnerDetails/pages';
import { convertISTToUTC } from '@/utils';
import '../styles/newRegistration.css';

const { Item } = Form;

const NewRegistration = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();
    const location = useLocation();
    const { state } = location;
    const { allData: rtos = [] } = useSelector((state) => state?.rto || {});
    const { allData: registrationTypes = [] } = useSelector((state) => state?.registrationType || {});
    const { allData: ownershipTypes = [] } = useSelector((state) => state?.ownershipType || {});
    const { allData: ownerCategories = [] } = useSelector((state) => state?.ownerCategory || {});
    const { allData: states = [] } = useSelector((state) => state?.state || {});
    const { allData: districts = [] } = useSelector((state) => state?.district || {});
    const { allData: vehicleClasses = [] } = useSelector((state) => state?.vehicalClass || {});
    const { allData: vehicleTypes = [] } = useSelector((state) => state?.vehicalType || {});
    const { allData: vehicleCategories = [] } = useSelector((state) => state?.vehicalCategory || {});

    useEffect(() => {
        dispatch(fetchAllRtos());
        dispatch(fetchAllRegistrationTypes());
        dispatch(fetchAllOwnershipTypes());
        dispatch(fetchAllOwnerCategories());
        dispatch(fetchAllStates());
        dispatch(fetchAllDistricts());
        dispatch(fetchAllVehicalClasses());
        dispatch(fetchAllVehicalCategories());
        dispatch(fetchAllVehicalType());
    }, []);

    const onRegisterApplication = async (values) => {
        try {
            const res = await dispatch(registerNewApplication({
                ...values,
                work_category_id: state.work_category?.id,
                purchase_date: values.purchase_date ? convertISTToUTC(values.purchase_date) : null,
            }));
            if (res.error) {
                message.error(res.payload || 'Failed to register application');
            } else {
                message.success(res.payload.message || 'Application registered successfully');
                modal.warning({
                    title: '',
                    icon: null,
                    centered: true,
                    content: (
                        <div>
                            <div className='application-modal-title'>Generated Application No</div>
                            <div className='application-modal-text'>{`Application No: ${res.payload.data?.application_number}`}</div>
                            <div className='application-modal-title'>Generated File No</div>
                            <div className='application-modal-text'>{`File No: ${res.payload.data?.file_number}`}</div>
                        </div>
                    ),
                    okText: 'Ok',
                    onOk: (e) => {
                        form.resetFields();
                        navigate('/data-entry', { state: { applicationId: res.payload?.data?.id } });
                    },
                    okButtonProps: {
                        style: { margin: 'auto', display: 'block' }
                    }
                });
            }
        } catch (err) {
            message.error(err.message || 'Failed to register application');
        }
    }

    return (
        <div className='registration-form'>
            <div className="registration-title">RTO Information</div>
            {contextHolder}
            <Form form={form} layout='vertical' onFinish={onRegisterApplication}>
                <Col span={24}>
                    <Card className='rto-card'>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Item name="rto_id" label="Select RTO" className={'mt-15 bottom-0'} rules={[{ required: true, message: 'Please select RTO' }]}>
                                <Select
                                    placeholder="Select RTO office"
                                    options={rtos.map((val) => ({ value: val.id, label: val.name }))}
                                    showSearch={true}
                                    filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                />
                            </Item>
                        </Col>
                    </Card>
                </Col>
                
                {/* <div className="title">Owner Details</div> */}
                <OwnerDetails
                    form={form}
                    registrationTypes={registrationTypes}
                    ownershipTypes={ownershipTypes}
                    ownerCategories={ownerCategories}
                    states={states}
                    districts={districts}
                    vehicleClasses={vehicleClasses}
                    vehicleTypes={vehicleTypes}
                    vehicleCategories={vehicleCategories}
                    showVehicalData={true}
                    isNew={true}
                />

                <div className="partial-sve-btn">
                    <Flex justify='center' align='center'>
                        <Button type='primary' size='large' htmlType='submit'> Inward Application (partial save) </Button>
                    </Flex>
                </div>
            </Form>
        </div>
      )
}

export default NewRegistration;