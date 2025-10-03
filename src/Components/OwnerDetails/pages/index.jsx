import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Row, Form, Select, Checkbox, DatePicker } from 'antd';
import '../styles/ownerDetails.css';
import { DateFormat, ALPHABETIC_PATTERN, NUMERIC_PATTERN, ALPHA_NUMERIC_PATTERN } from '@/utils';
import Input from '@/CustomComponents/CapitalizedInput';
import dayjs from 'dayjs';

const { Item } = Form;

export const OwnerDetails = ({ form, registrationTypes = [], ownershipTypes = [], ownerCategories = [], states = [], districts = [], vehicleClasses = [],
    vehicleTypes = [], vehicleCategories = [], showVehicalData = false, registerFields, isReadOnly=false, isNew
 }) => {
    const [currState, setCurrState] = useState(null);
    const [perState, setPerState] = useState(null);
    const [defOwnerCategoryId, setDefCategoryId] = useState(null);

    useEffect(() => {
        if (registerFields) {
            registerFields([
                "entry_date",
                "application_no",
                "registration_type_id",
                "purchase_date",
                "owner_name",
                "ownership_type_id",
                "relative_name",
                "ownership_serial",
                "owner_category_id",
                "mobile_number",
                "alt_mobile_no",
                "email",
                "pan_no",
                "aadhar_no",
                "aadhar_no_display",
                "passport_no",
                "rationcard_no",
                "voter_no",
                "dl_ll_no",
                "house_no",
                "city",
                "landmark",
                "state_id",
                "district_id",
                "pincode",
                "permanant_house_no",
                "permanant_city",
                "permanant_landmark",
                "permanant_state_id",
                "permanant_district_id",
                "permanant_pincode",
                "vehicle_type_id",
                "vehicle_class_id",
                "vehicle_category_id",
                "chassis_no",
                "engine_no"
                ]
            );
        }
    }, []);

    useEffect(() => {
        const generalCategory = ownerCategories.find((val) => val.name?.toLowerCase() === 'general')
        setDefCategoryId(generalCategory?.id);
        form.setFieldValue('owner_category_id', generalCategory?.id);
    }, [JSON.stringify(ownerCategories)]);

    useEffect(() => {
        setCurrState(form.getFieldValue('state_id') || null)
    }, [form.getFieldValue('state_id')]);

    useEffect(() => {
        setPerState(form.getFieldValue('permanant_state_id') || null)
    }, [form.getFieldValue('permanant_state_id')]);

    const handleInputChange = useCallback((value, name, type = 'alphanumeric') => {
        let cleanValue = value
        if (type === 'numeric') {
            cleanValue = value.replace(NUMERIC_PATTERN, '')
        } else if (type === 'alphabet') {
            cleanValue = value.replace(ALPHABETIC_PATTERN, '')
        } else if (type === 'alphanumeric') {
            cleanValue = value.replace(ALPHA_NUMERIC_PATTERN, '')
        }
        form.setFieldValue(`${name}`, cleanValue);
    }, [form]);

    const onSameAsCurrentAddr = (e) => {
        if (e.target.checked) {
            const house_no = form.getFieldValue('house_no');
            const city = form.getFieldValue('city');
            const landmark = form.getFieldValue('landmark');
            const state_id = form.getFieldValue('state_id');
            const district_id = form.getFieldValue('district_id');
            const pincode = form.getFieldValue('pincode');
            setPerState(currState);
            form.setFieldsValue({
                permanant_house_no: house_no,
                permanant_city: city,
                permanant_landmark: landmark,
                permanant_state_id: state_id,
                permanant_district_id: district_id,
                permanant_pincode: pincode
            });
        } else {
            form.resetFields(['permanant_house_no', 'permanant_city', 'permanant_landmark', 'permanant_state_id', 'permanant_district_id', 'permanant_pincode']);
        }
    }

    return (
        <div className='owner-details'>
            <Row gutter={[24, 24]}>                                
                <Col span={24}>
                    <Card>
                        <Row gutter={[24, 24]} className='mt-15'>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name='application_no'
                                    label="RTO Application No."
                                    // className='bottom-0'
                                    rules={[{ required: true, message: "Please enter RTO application no.", whitespace: true }]}
                                >
                                    <Input
                                        placeholder='Enter RTO application no.'
                                        disabled={isReadOnly || !isNew}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                               <Item
                                    name="entry_date"
                                    label="Entry Date"
                                    rules={[{ required: true, message: "Please select date" }]}
                                    >
                                    <DatePicker
                                        placeholder="Select date"
                                        format="DD/MM/YYYY"   // user-friendly display
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {isNew ? (
                <div className="title">Owner Details</div>
            ) : null}

            <Row gutter={[24, 24]}>                                
                <Col span={24}>
                    <Card title="Owner information">
                        <Row gutter={[24, 24]}>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    label="Registration Type"
                                    name={'registration_type_id'}
                                    rules={[{ required: true, message: 'Please select registration type' }]}
                                >
                                    <Select
                                        disabled={isReadOnly}
                                        placeholder={"Select Registration Type"}
                                        options={registrationTypes.map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name="purchase_date"
                                    label="Purchase Date/Delivery Date"
                                    rules={[{ required: true, message:'Please select a date'}]}
                                >
                                    <DatePicker disabled={isReadOnly} className='w-full' format={DateFormat} placeholder='Select Date'/>
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name='owner_name'
                                    label="Owner Name"
                                    rules={[{ required: true, message:'Please enter Owner name' }]}
                                >
                                    <Input
                                        placeholder='Enter Owner Name'
                                        onChange={(e) => handleInputChange(e.target.value, 'owner_name', 'alphabet')} 
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name='ownership_type_id'
                                    label="Ownership Type"
                                    rules={[{ required: true, message:'Please select ownership type' }]}
                                    >
                                    <Select
                                        placeholder="Select Ownership Type"
                                        options={ownershipTypes.map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name='relative_name'
                                    label="Son/Wife/Daughter of"
                                    rules={[{ required: true, message: "Please enter relative's name", whitespace: true }]}
                                >
                                    <Input
                                        placeholder='Enter Relative Name'
                                        onChange={(e) => handleInputChange(e.target.value, 'relative_name', 'alphabet')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name={'ownership_serial'}
                                    label={"Ownership Serial"}
                                    rules={[{ required: true, message:'Please enter ownership serial no'}]}
                                    initialValue={1}
                                >
                                    <Input
                                        placeholder='Enter Ownership Serial No'
                                        onChange={(e) => handleInputChange(e.target.value, 'ownership_serial', 'numeric')}
                                        readOnly={true}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card title="Owner Identification/Contact Details">
                        <Row gutter={[24, 24]}>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name='owner_category_id'
                                    label="Owner Category"
                                    rules={[{ required: true, message:'Please selecct a category'}]}
                                >
                                    <Select
                                        placeholder={"Select Owner Category"}
                                        options={ownerCategories.map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        value={defOwnerCategoryId}
                                        open={defOwnerCategoryId ? false : undefined}
                                        suffixIcon={defOwnerCategoryId ? false : undefined}
                                        style={defOwnerCategoryId ? { pointerEvents: 'none' } : {}}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Form.Item
                                    name="mobile_number"
                                    label="Mobile No"
                                    rules={[
                                        { required: true, message: 'please enter your mobile no' },
                                        { len: 10, message: 'Enter a valid mobile number' }
                                    ]}
                                >
                                    <Input
                                        maxLength={10}
                                        placeholder='xxxxxxxxxx'
                                        onChange={(e) => handleInputChange(e.target.value, 'mobile_number', 'numeric')}
                                        disabled={isReadOnly}
                                    />
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name="alt_mobile_no"
                                    label="Alternate Mobile No"
                                    rules={[
                                        { message: 'please enter your mobile no' },
                                        { len: 10, message: 'Enter a valid mobile number' }
                                    ]}
                                >
                                    <Input
                                        maxLength={10}
                                        placeholder='xxxxxxxxxx'
                                        onChange={(e) => handleInputChange(e.target.value, 'alt_mobile_no', 'numeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item
                                    name="email"
                                    label="Email ID"
                                    rules={[{ type:'email', message: 'Please enter valid email' }]}
                                >
                                    <Input placeholder='Enter email id' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item name="pan_no" label="PAN No">
                                    <Input
                                        placeholder='Enter PAN no'
                                        onChange={(e) => handleInputChange(e.target.value, 'pan_no', 'alphanumeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item name="aadhar_no" noStyle>
                                    <Input  type="hidden" />
                                </Item>

                                <Item label="Adharcard No" shouldUpdate>
                                    {({ getFieldValue, setFieldValue }) => (
                                        <Input
                                            maxLength={14} 
                                            placeholder="1234-5678-9012"
                                            value={getFieldValue("aadhar_no_display") || ""}
                                            onChange={(e) => {
                                                let raw = e.target.value.replace(/\D/g, ""); 
                                                raw = raw.slice(0, 12); 
                                                const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1-");
                                                setFieldValue("aadhar_no", raw); 
                                                setFieldValue("aadhar_no_display", formatted); 
                                            }}
                                            disabled={isReadOnly}
                                        />
                                    )}
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item name="passport_no" label="Passport No">
                                    <Input
                                        placeholder='Enter Passport no'
                                        onChange={(e) => handleInputChange(e.target.value, 'passport_no', 'alphanumeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item name="voter_no" label="Voter ID">
                                    <Input
                                        placeholder='Enter voter id'
                                        onChange={(e) => handleInputChange(e.target.value, 'voter_no', 'alphanumeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                                <Item name="dl_ll_no" label="DL/LL No">
                                    <Input
                                        placeholder='Enter Dl/ll no'
                                        onChange={(e) => handleInputChange(e.target.value, 'dl_ll_no', 'alphanumeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            
            <Row gutter={[24, 24]}>
                <Col lg={12} md={12} sm={24} xs={24}>
                    <Card title="Current Address">
                        <Row gutter={[24, 24]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'house_no'} label="House No & Street Name" rules={[{ required: true, message: 'Please Enter House no.' }]}>
                                    <Input placeholder='Enter House No & Street Name' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'city'} label="Village/Town/City" rules={[{ required: true, message: 'Please Enter city' }]}>
                                    <Input placeholder='Enter Village/Town/City' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'landmark'} label="Landmark/Police Station" rules={[{ required: true, message: 'Please Enter Landmark' }]}>
                                    <Input placeholder='Enter Landmark/Police Station' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'state_id'} label="State" rules={[{ required: true, message: 'Please select state' }]}>
                                    <Select
                                        placeholder="Select State"
                                        options={states.map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        onChange={(val) => {
                                            setCurrState(val)
                                            form.resetFields(['district_id']);
                                        }}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item
                                    name={'district_id'}
                                    label="District"
                                    rules={[{ required: true, message: 'Please Select District' }]}
                                >
                                    <Select
                                        placeholder={"Select District"}
                                        options={districts.filter((val) => val.state_id == currState).map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item
                                    name={'pincode'}
                                    label="Pin Code"
                                    rules={[{ required: true, message: 'Please enter pincode' }]}
                                >
                                    <Input
                                        placeholder={'Enter Pin Code'}
                                        maxLength={6}
                                        onChange={(e) => handleInputChange(e.target.value, 'pincode', 'numeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col lg={12} md={12} sm={24} xs={24}>
                    <Card title="Permanent Address" extra={<Checkbox onChange={onSameAsCurrentAddr} disabled={isReadOnly}>Same as current</Checkbox>}>
                        <Row gutter={[24, 24]} >
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'permanant_house_no'} label="House No & Street Name" rules={[{ required: true, message: 'Please Enter House no.' }]}>
                                    <Input placeholder='Enter House No & Street Name' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'permanant_city'} label="Village/Town/City" rules={[{ required: true, message: 'Please Enter City' }]}>
                                    <Input placeholder='Enter Village/Town/City' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'permanant_landmark'} label="Landmark/Police Station" rules={[{ required: true, message: 'Please Enter Landmark' }]}>
                                    <Input placeholder='Enter Landmark/Police Station' disabled={isReadOnly}/>
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item name={'permanant_state_id'} label="State" rules={[{ required: true, message: 'Please select state' }]}>
                                    <Select
                                        placeholder="Select State"
                                        options={states.map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        onChange={(val) => {
                                            setPerState(val);
                                            form.resetFields(['permanant_district_id']);
                                        }}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item
                                    name={'permanant_district_id'}
                                    label="District"
                                    rules={[{ required: true, message: 'Please Select District' }]}
                                >
                                    <Select
                                        placeholder={"Select District"}
                                        options={districts.filter((val) => val.state_id == perState).map((val) => ({ value: val.id, label: val.name }))}
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Item
                                    name={'permanant_pincode'}
                                    label="Pin Code"
                                    rules={[{ required: true, message: 'Please enter pincode' }]}
                                >
                                    <Input
                                        placeholder={'Enter Pin Code'}
                                        maxLength={6}
                                        onChange={(e) => handleInputChange(e.target.value, 'permanant_pincode', 'numeric')}
                                        disabled={isReadOnly}
                                    />
                                </Item>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            {showVehicalData ? (
                <Row gutter={[24, 24]}>                                
                    <Col span={24}>
                        <Card>
                            <Row gutter={[24, 24]} className='mt-15'>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Item
                                        name={"vehicle_type_id"}
                                        label="Vehicle Type"
                                        rules={[{ required: true, message: 'Please select vehicle type' }]}
                                    >
                                        <Select
                                            placeholder="Select Vehicle Type"
                                            options={vehicleTypes.map((val) => ({ value: val.id, label: val.name }))}
                                            showSearch={true}
                                            filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                            disabled={isReadOnly}
                                        />
                                    </Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Item
                                        name="vehicle_class_id"
                                        label="Vehicle class"
                                        rules={[{ required: true, message: 'Please select vehicle class' }]}
                                    >
                                        <Select
                                            placeholder="Select Vehicle Class"
                                            options={vehicleClasses.map((val) => ({ value: val.id, label: val.name }))}
                                            showSearch={true}
                                            filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                            disabled={isReadOnly}
                                        />
                                    </Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Item
                                        name="vehicle_category_id"
                                        label="Vehicle Category"
                                        rules={[{ required: true, message: 'Please select vehicle category' }]}
                                    >
                                        <Select
                                            placeholder="Select"
                                            options={vehicleCategories.map((val) => ({ value: val.id, label: val.name }))}
                                            showSearch={true}
                                            filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                                            disabled={isReadOnly}
                                        />
                                    </Item>
                                </Col>
                            </Row>

                            <Row gutter={[24, 24]}>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Item
                                        name="chassis_no"
                                        label="Chassis No"
                                        rules={[{ required: true, message: 'Please enter chassis no' }]}
                                    >
                                        <Input
                                            placeholder='Enter Chassis No'
                                            onChange={(e) => handleInputChange(e.target.value, 'chassis_no', 'alphanumeric')}
                                            disabled={isReadOnly}
                                        />
                                    </Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Item
                                        name="engine_no"
                                        label="Engine/Motor No"
                                        rules={[{ required: true, message: 'Please enter engine/motor no' }]}
                                    >
                                        <Input
                                            placeholder='Enter engine no'
                                            onChange={(e) => handleInputChange(e.target.value, 'engine_no', 'numeric')}
                                            disabled={isReadOnly}
                                        />
                                    </Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            ) : null}
        </div>
    );
}