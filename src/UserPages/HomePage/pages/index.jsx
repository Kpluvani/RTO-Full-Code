import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Select, Radio, Space, Row, Col } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { fetchAllWorkCategories } from '../../../features/workCategory/workCategorySlice';
import { UserActions, Action, WorkCategory, ActionValue } from '../../../utils';
import ApplicationList from './applicationList';

export const UserHomePage = () => {
    const [selectedWorkCategory, setSelectedWorkCategory] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [workType, setWorkType] = useState('application');
    const [applicationNo, setApplicationNo] = useState();
    const [disableShowBtn, setDisableShowBtn] = useState(true);
    const [showApplicationList, setShowApplicationList] = useState(false);
    const [allowedActions, setAllowedActions] = useState([]);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allData: workCategories } = useSelector((state) => state?.workCategory || {});
    const { profile } = useSelector((state) => state?.user || {});

    useEffect(() => {
        dispatch(fetchAllWorkCategories());
    }, []);

    useEffect(() => {
        setDisableShowBtn(!(selectedWorkCategory?.id && selectedAction));
    }, [selectedWorkCategory?.id, selectedAction]);

    useEffect(() => {
        if (selectedWorkCategory && profile?.actions) {
            const action = profile.actions.find((user) => user.work_category_id === selectedWorkCategory?.id);
            setAllowedActions((action?.processes || []).map((val) => val.key));
        } else {
            setAllowedActions([]);
        }
    }, [profile?.actions, selectedWorkCategory])

    const onClickShowForm = (e) => {
        if (selectedWorkCategory.name?.toLowerCase() === WorkCategory.NEW_RC) {
            if (selectedAction === ActionValue.ENTRY_NEW_REGISTRATION) {
                navigate('/new-registration', { state: { work_category: selectedWorkCategory } });
            }
        }
    }

    const handleGetPendingWork = () => {
        if (workType !== 'pending-application' && !applicationNo.trim()) {
            setError('Please enter the Application No.');
            return;
        }
        setError('');
        setShowApplicationList(true);
    };

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
                    <Card title="Select Work Category & Action" style={{ height: "100%" }}>
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Work Category:</label>
                            <Select
                                placeholder={'Select Work Category'}
                                value={selectedWorkCategory?.id}
                                onChange={(id) => {
                                    const workCategory = workCategories.find((val) => val.id == id);
                                    setSelectedWorkCategory(workCategory);
                                    setSelectedAction(null);
                                }}
                                style={{ width: "100%" }}
                                suffixIcon={<DownOutlined />}
                                options={workCategories
                                        .filter((workCategory) => (profile?.work_category_ids || []).includes(workCategory.id))
                                        .map((workCategory) => ({ value: workCategory.id, label: workCategory.name }))}
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
                                options={UserActions
                                        .filter((val) => allowedActions.includes(val.value))
                                        .map((val) => ({ value: val.value, label: val.label }))}
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
                    <Radio.Group value={workType}  onChange={(e) => {
                        setWorkType(e.target.value);
                        setShowApplicationList(false);
                        setApplicationNo('');
                    }} style={{ width: "100%" }}>
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
                        {/* <Col span={12}>
                            <Radio value="old-software-data">Old Software Data Fetch</Radio>
                        </Col> */}
                    </Row>
                    </Radio.Group>
                </div>

                {workType !== 'pending-application' ? (
                    <div style={{ marginBottom: "32px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                            {
                                workType === 'registration'
                                ? 'Registration No:'
                                : workType === 'old-software-data'
                                ? 'Old Software Application No:'
                                : 'Application No:'
                            }
                        </label>
                        <Input
                            placeholder="16 Digit number"
                            value={applicationNo}
                            onChange={(e) => {
                                setApplicationNo(e.target.value);
                                setShowApplicationList(false);
                            }}
                            style={{ width: "100%" }}
                        />
                        {error && (
                            <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>
                        )}
                    </div>
                ) : <div style={{ height: '94px' }} />}

                <div style={{ textAlign: "center" }}>
                    <Space>
                        <Button type="primary" onClick={handleGetPendingWork}>Get Pending Work</Button>
                        <Button type="primary">Pull Back Application</Button>
                    </Space>
                </div>
                </Card>
            </Col>
            </Row>
            {showApplicationList && (
                <Row gutter={24} style={{ marginTop: 24 }}>
                    <Col xs={24} lg={24}>
                        <ApplicationList applicationNo={applicationNo} workType={workType}/>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default UserHomePage;
