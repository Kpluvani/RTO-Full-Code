import { useCallback, useEffect } from 'react';
import { Typography, Col, Form, Row, Flex, Select, Button, message } from "antd";
import { SaveOutlined, UndoOutlined, RollbackOutlined, PlusSquareOutlined } from "@ant-design/icons";
import Input from '@/CustomComponents/CapitalizedInput';
import { addUser, editUser, fetchUserById } from '../../../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { ALPHA_NUMERIC_PATTERN, ALPHABETIC_PATTERN, NUMERIC_PATTERN } from '@/utils';

export const UserForm = ({ designations, workCategories, userCategories, rtoId, users = [], selectedUser, setSelectedUser }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedUser?.id) {
            form.setFieldsValue(selectedUser);
        } else {
            form.resetFields();
            setSelectedUser(null);
        }
    }, [selectedUser])

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
    

    const onSaveUser = (values) => {
        try {
            let res;
            let userData = {
                ...values,
                rto_id: rtoId
            };
            if (selectedUser?.id) {
                res = dispatch(editUser({
                    id: selectedUser.id,
                    data: userData
                }));
            } else {
                res = dispatch(addUser(userData));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save user');
            } else {
                message.success(res.payload || 'User saved successfully');
                form.resetFields();
                setSelectedUser(null);
            }
        } catch (e) {
            message.error("Failed to save user");
        }
    }

    const onNew = () => {
        form.resetFields();
        setSelectedUser(null);
    }
    const onReset = () => {
        if (selectedUser?.id) {
            form.setFieldsValue(selectedUser);
            form.resetFields(['newPassword', 'confirmPassword']);
        } else {
            setSelectedUser(null);
            form.resetFields();
        }
    }
    const onBack = async () => {
        let id;
        if (selectedUser?.id) {
            const index = users.findIndex((val) => val.id == selectedUser.id);
            if (index < (users.length - 1)) {
                id = users[index + 1]?.id
            }
        } else if (users?.length) {
            id = users[0]?.id
        }
        if (id) {
            const res = await dispatch(fetchUserById(id));
            setSelectedUser(res.payload);
        }
    }

    return (
        <div className="main-card2">
            <div className="card2-body">
            <h2 className='user-sub-title'>User Registration Form</h2>

            <Form
                form={form}
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={onSaveUser}
            >
                <div className="right-content">
                    <Flex horizontal>
                        <div className="card2-div1" style={{ width: "100%" }}>
                            <Row gutter={24}>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item name="work_category_ids" label={'Work Category'} rules={[{ required: true ,message: 'select work category'}]}>
                                    <Select
                                        size="large"
                                        mode={'multiple'}
                                        style={{ width: "100%" }} 
                                        options={workCategories.map((val) => ({ value: val.id, label: val.name }))} 
                                        placeholder="Work Category" 
                                        showSearch={true}
                                        filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                                    />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item name="name" label={'User Name'} rules={[{ required: true, message: 'Please enter username!' }]}>
                                        <Input size='large' placeholder='Enter Username' />
                                    </Form.Item>
                                </Col> 

                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item name="user_category_id" label={'User Category'} rules={[{ required: true ,message: 'select user category'}]}>
                                        <Select
                                            size="large"
                                            style={{ width: "100%" }} 
                                            options={userCategories.map((val) => ({ value: val.id, label: val.name }))} 
                                            placeholder="User Category"
                                            showSearch={true}
                                            filterOption={(input, option) =>
                                                option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        name="email"
                                        label={'Email ID'}
                                        rules={[{ type:"email" ,message: 'Please enter valid email id' }]}
                                    >
                                        <Input size='large' placeholder='Enter email id'/>
                                    </Form.Item>
                                </Col> 

                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item name="designation_id" label={'Designation'} rules={[{ required: true ,message: 'select designation'}]}>
                                        <Select
                                            size="large"
                                            style={{ width: "100%" }} 
                                            options={designations.map((val) => ({ value: val.id, label: val.name }))} 
                                            placeholder="Designation"
                                            showSearch={true}
                                            filterOption={(input, option) =>
                                                option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        label={'Mobile No'}
                                        name="mobile_number"
                                        rules={[
                                            { required: true ,message: 'please enter your mobile no' },
                                            { pattern: /^\d{10}$/, message: 'Mobile No must have 10 digit' }
                                        ]}
                                    >
                                        <Input 
                                            onChange={(e) => handleInputChange(e.target.value, 'mobile_number', 'numeric')}  
                                            maxLength={10} 
                                            size='large'
                                            placeholder='enter mobile no' 
                                        />
                                    </Form.Item>
                                </Col>

                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        label={'User ID'}
                                        name="user_name"
                                        rules={[{ required: true ,message: 'please enter user id'}]}
                                    >
                                        <Input size='large' placeholder='Enter user id' />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        label={'Adharcard No'}
                                        name="aadharcard_number"
                                        rules={[
                                            // { required: true ,message: 'please enter your adharcard no'},
                                            { pattern: /^\d{12}$/, message: 'Adharcard must have 12 digit'}
                                        ]}
                                    >
                                        <Input maxLength={12} size='large' placeholder='Enter adharcard no' />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label={'Password'}
                                        name="password"
                                        rules={[
                                            { required: true ,message: 'please set a password' },
                                            // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])/, message:'Password must contain 1 numeric, 1 uppercase, 1 lowercase and 1 special character' },
                                            // { min: 8, message:'password must be 8 characters long' }
                                        ]}
                                    >
                                        <Input type='password' size='large' placeholder='Enter password' disabled={selectedUser?.id} />
                                    </Form.Item>
                                </Col>
                                {selectedUser?.id ? (
                                    <>
                                        <Col span={24}>
                                            <Form.Item
                                                label={'New Password'}
                                                name="newPassword"
                                                rules={[
                                                    // { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])/, message:'Password must contain atleast 1 numeric, 1 uppercase, 1 lowercase and 1 special character' },
                                                    // { min: 8, message:'password must be 8 characters long' }                                
                                                ]}
                                            >
                                                <Input type='password' size='large' placeholder='Enter new password'/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                label={'Confirm Password'}
                                                name="confirmPassword"
                                                rules={[
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('newPassword') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Passwords do not match'));
                                                        },
                                                    })
                                                ]}
                                            >
                                                <Input type='password' size='large' placeholder='Enter confirm password'/>
                                            </Form.Item>
                                        </Col>
                                    </>
                                ) : null}
                            </Row>
                        </div>
                    </Flex>

                    <Flex className="save-btn" horizontal gap={"middle"} justify="center">
                        <Button type="primary" size="large" htmlType="submit"><SaveOutlined/>Save</Button>
                        <Button type="primary" size="large" onClick={onReset}><UndoOutlined/>Reset</Button>
                        <Button type="primary" size="large" htmlType='reset' onClick={onNew}><PlusSquareOutlined />New</Button>
                        <Button type="primary" size="large" onClick={onBack}><RollbackOutlined />Back</Button>
                    </Flex>
                </div>
            </Form>
            </div>
        </div>
    )
}
