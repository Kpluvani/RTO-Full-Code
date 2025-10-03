import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Select, Radio, Space, Row, Col } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { fetchAllRtos } from '../../../features/rto/rtoSlice';
import { AdminActions, Action } from '../../../utils';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [selectedAction, setSelectedAction] = useState()
    const [workType, setWorkType] = useState()
    const [applicationNo, setApplicationNo] = useState();
    const [disableShowBtn, setDisableShowBtn] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allData: rtos = [], loading } = useSelector((state) => state.rto);

    useEffect(() => {
        dispatch(fetchAllRtos());
    }, []);

    useEffect(() => {
        setDisableShowBtn(!(selectedOffice && selectedAction));
    }, [selectedOffice, selectedAction]);

    const onClickShowForm = (e) => {
        if (selectedAction === Action.CREATE_MODIFY_USER) {
            navigate('/admin/user-registration', { state: { office: selectedOffice }});
        } else if (selectedAction === Action.ASSIGN_ROLE_ACTION) {
            navigate('/admin/user-action-management', { state: { office: selectedOffice } });
        }
    }
    
    return (
        <div>
            <div style={{ marginBottom: "24px" }}>
            <Space>
                <Button type="primary" danger icon={<UserOutlined />} style={{ marginRight: "16px" }}>
                    User Permission
                </Button>
                <Button type="primary">Current Running Registration No:</Button>
            </Space>
            </div>

            <Row gutter={24}>
            <Col xs={24} lg={12}>
                <Card title="Select Assigned Office & Action" style={{ height: "100%" }}>
                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                        Assigned Office:
                    </label>
                    <Select
                        placeholder={'Select Assigned Office'}
                        value={selectedOffice}
                        onChange={setSelectedOffice}
                        style={{ width: "100%" }}
                        suffixIcon={<DownOutlined />}
                        options={rtos.map((rto) => ({ value: rto.id, label: rto.name }))}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.label?.toLowerCase()?.includes(input?.toLowerCase())
                        }
                    />
                </div>

                <div style={{ marginBottom: "32px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Action:</label>
                    <Select
                        placeholder={'Select Action'}
                        value={selectedAction}
                        onChange={setSelectedAction}
                        style={{ width: "100%" }}
                        suffixIcon={<DownOutlined />}
                        options={AdminActions.map((val) => ({ value: val, label: val }))}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.label?.toLowerCase()?.includes(input?.toLowerCase())
                        }
                    />
                </div>

                <div style={{ textAlign: "right" }}>
                    <Button type="primary" size="large" disabled={disableShowBtn} onClick={onClickShowForm}>Show Form</Button>
                </div>
                </Card>
            </Col>

            <Col xs={24} lg={12}>
                <Card title="Get Pending Work" style={{ height: "100%" }}>
                <div style={{ marginBottom: "24px" }}>
                    <Radio.Group value={workType} onChange={(e) => setWorkType(e.target.value)} style={{ width: "100%" }}>
                    <Row>
                        <Col span={12}>
                            <Radio value="application">Application No</Radio>
                        </Col>
                        <Col span={12}>
                            <Radio value="pending-application">Pending Application</Radio>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "8px" }}>
                        <Col span={12}>
                            <Radio value="registration">Registration No</Radio>
                        </Col>
                        <Col span={12}>
                            <Radio value="old-software-data">Old Software Data Fetch</Radio>
                        </Col>
                    </Row>
                    </Radio.Group>
                </div>

                <div style={{ marginBottom: "32px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Application No:</label>
                    <Input
                        placeholder="16 Digit number"
                        value={applicationNo}
                        onChange={(e) => setApplicationNo(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ textAlign: "right" }}>
                    <Space>
                        <Button type="primary">Get Pending Work</Button>
                        <Button type="primary">Pull Back Application</Button>
                    </Space>
                </div>
                </Card>
            </Col>
            </Row>
        </div>
    );
}

export default HomePage;
