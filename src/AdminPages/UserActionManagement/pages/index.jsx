import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Typography, Card, Col, Row, Flex, Select, Button, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import TextArea from '@/CustomComponents/CapitalizedTextArea';
import { SearchOutlined, ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined, UndoOutlined, VerticalLeftOutlined, VerticalRightOutlined } from "@ant-design/icons";
import { AssignedActions } from './AssignedActions';
import { fetchAllUsers } from '@/features/user/userSlice';
import { fetchAllWorkCategories } from '@/features/workCategory/workCategorySlice';
import { fetchAllProcess } from '@/features/process/processSlice';
import { fetchUserActions, saveUserActions, setUserId } from '@/features/userAction/userActionSlice';
import "../styles/userActionManagement.css";

const { Title } = Typography;

const UserActionManagement = () => {
    const [actions, setActions] = useState([]);
    const [availableActions, setAvailableActions] = useState([]);
    const [assignedActions, setAssignedActions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);
    const [workCategoriesOpt, setWorkCategoriesOpt] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedWorkCategoryId, setSelectedWorkCategoryId] = useState(null);
    const [selectedUserActionMgmt, setSelectedUserActionMgmt] = useState({});
    const [form] = Form.useForm();
    const location = useLocation();
    const rtoId = location?.state?.office;
    const { allData: users = [], loading } = useSelector((state) => state?.user || {});
    const { allData: workCategories = [] } = useSelector((state) => state?.workCategory || {});
    const { allData: allProcess = [] } = useSelector((state) => state?.process || {});
    const { data: userActions = [] } = useSelector((state) => state?.userAction || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllWorkCategories({ include: 'id,name' }));
        dispatch(fetchAllProcess({ include: 'id,name,work_category_id' }));
    }, []);

    useEffect(() => {
        if (selectedUser?.id) {
            dispatch(setUserId(selectedUser.id));
            dispatch(fetchUserActions(selectedUser.id));
        }
    }, [selectedUser?.id])

    useEffect(() => {
        dispatch(fetchAllUsers({ where: { rto_id: rtoId }, include: 'id,name,work_category_ids' }));
    }, [rtoId]);

    useEffect(() => {
        setWorkCategoriesOpt(() => (workCategories.filter((item) => selectedUser?.id ? selectedUser.work_category_ids?.includes(item.id) : false)));
    }, [selectedUser, workCategories]);

    useEffect(() => {
        console.log('<<userActions--', userActions, selectedWorkCategoryId);
        if (selectedWorkCategoryId) {
            const actionMgmt = (userActions || []).find((item) => item.work_category_id == selectedWorkCategoryId);
            console.log('<<selected--', actionMgmt)
            setSelectedUserActionMgmt(actionMgmt || {});
        }
    }, [selectedWorkCategoryId, userActions]);

    useEffect(() => {
        if (selectedWorkCategoryId) {
            setActions(allProcess.filter((val) => val.work_category_id == selectedWorkCategoryId));
        } else {
            setActions([]);
        }
    }, [allProcess, selectedWorkCategoryId]);

    const setUserActions = (actions, actionMgmt) => {
        if (actionMgmt?.id) {
            const actionIds = actionMgmt.process_ids || [];
            setAvailableActions(actions.filter((val) => !actionIds.includes(val.id)));
            setAssignedActions(actions.filter((val) => actionIds.includes(val.id)));
        } else {
            setAvailableActions(actions);
            setAssignedActions([]);
        }
    }

    useEffect(() => {
        setUserActions(actions, selectedUserActionMgmt);
    }, [actions, selectedUserActionMgmt, selectedUser?.id]);

    const handleAssign = () => { 
        setAssignedActions([...assignedActions, ...selectedAvailable]);
        setAvailableActions(availableActions.filter(item => !(selectedAvailable.map((val) => val.id).includes(item?.id))));
        setSelectedAvailable([]);
    }

    const handleAssignAll = () => { 
        setAssignedActions([...assignedActions, ...availableActions]);
        setAvailableActions([]);
        setSelectedAvailable([]);
    }

    const handleUnassign = () => {
        setAvailableActions([...availableActions, ...selectedAssigned]);
        setAssignedActions(assignedActions.filter(item => !(selectedAssigned.map((val) => val.id).includes(item?.id))));
        setSelectedAssigned([]);
    }

    const handleUnassignAll = () => {
        setAvailableActions([...availableActions, ...assignedActions]);
        setAssignedActions([]);
        setSelectedAssigned([]);
    }

    const handleSelect = (item, from) => {
        if (from === "available") {
            setSelectedAvailable(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
        } else {
            setSelectedAssigned(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
        }
    }

    const onReset = () => {
        if (selectedUserActionMgmt?.id) {
            form.setFieldsValue(selectedUserActionMgmt);
            setUserActions(actions, selectedUserActionMgmt);
        } else {
            resetFields();
        }
    }

    const resetFields = () => {
        form.resetFields();
        setSelectedAssigned([]);
        setSelectedAvailable([]);
        setAssignedActions([]);
        setAvailableActions([]);
        setWorkCategoriesOpt([]);
        setSelectedUser(null);
        setSelectedWorkCategoryId(null);
        setSelectedUserActionMgmt({});
    }

    const onSaveActions = async (values) => {
        const data = {
            user_id: values.user_id,
            work_category_id: values.work_category_id,
            process_ids: assignedActions.map((val) => val.id),
        };
        const res = await dispatch(saveUserActions(data));
        if (res.error) {
            message.error(res.payload);
        } else {
            message.success(res.payload);
            // resetFields();
        }
    }

    return (
        <div className="user-action-container">
            <h1 className="user-action-title">User Role/Action Management</h1>
            <div className="main-content">
                {/* <Flex horizontal> */}
                <Row gutter={24}>
                    <Col lg={16} md={16} sm={24} xs={24}> 
                    <div className="main-card">
                        <div className="card-body">
                        <Title level={4} className="user-action-title"> User Role/Action Management</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onSaveActions}
                        >
                            <div className="left-content">
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'user_id'}
                                            label={'User'}
                                            rules={[{ required: true, message: 'Please select a user' }]}
                                        >
                                            <Select
                                                size="large"
                                                autoFocus={true}
                                                style={{ width: "100%" }}
                                                options={users.map((val) => ({ label: val.name, value: val.id }))}
                                                placeholder="Select user"
                                                onChange={(val) => {
                                                    setSelectedUser(() => users.find((user) => user.id == val));
                                                    setSelectedWorkCategoryId(null);
                                                    form.setFieldValue('work_category_id', null);
                                                }}
                                                showSearch={true}
                                                filterOption={(input, option) =>
                                                    option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                                }
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={'work_category_id'}
                                            label={'Rights For'}
                                            rules={[{ required: true, message: 'Please select a work category' }]}
                                        >
                                            <Select
                                                size="large"
                                                style={{ width: "100%" }}
                                                placeholder="Select work category"
                                                options={workCategoriesOpt.map((val) => ({ label: val.name, value: val.id }))}
                                                onChange={(val) => {
                                                    setSelectedWorkCategoryId(val);
                                                    setActions([]);
                                                }}
                                                showSearch={true}
                                                filterOption={(input, option) =>
                                                    option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                                }
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item name={'work_to_be_assign'} label={'Work To Be Assign'}>
                                            <TextArea size="large" rows={4} placeholder="Enter work to be assign"/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Flex horizontal>
                                    <div className="card1-div2" style={{ width: "100%" }}>
                                    <Row gutter={24}>
                                        <Col span={11}>
                                        <div className="div2-panal1">
                                            <Title level={5}>Available Actions</Title>
                                            <Flex vertical gap={"small"}>
                                                <Input addonBefore={<SearchOutlined />} placeholder="Search" size="large"/>
                                                <Card className="action-card">
                                                    <div>
                                                        {availableActions.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                className={selectedAvailable.includes(item) ? "selected-action-list" : "action-list"}
                                                                onClick={() => handleSelect(item, "available")}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                    </div>
                                                </Card>
                                            </Flex>
                                        </div>
                                        </Col>

                                        <Col span={2}>
                                            <div className="div2-panal2" style={{ marginTop: "6rem" }}>
                                                <Flex vertical gap={"small"} align="center" justify="center" className="blu-arr-div">
                                                    <Button type="primary" onClick={handleAssign} disabled={selectedAvailable.length === 0}>
                                                        <ArrowRightOutlined/>
                                                    </Button>
                                                    <Button type="primary" onClick={handleAssignAll} disabled={availableActions.length === 0}>
                                                        <VerticalLeftOutlined />
                                                    </Button>
                                                    <Button type="primary" onClick={handleUnassign} disabled={selectedAssigned.length === 0}>
                                                        <ArrowLeftOutlined/>
                                                    </Button>
                                                    <Button type="primary" onClick={handleUnassignAll} disabled={assignedActions.length === 0}>
                                                        <VerticalRightOutlined />
                                                    </Button>
                                                </Flex>
                                            </div>
                                        </Col>

                                        <Col span={11}>
                                        <div className="div2-panal3">
                                            <Title level={5}>Assigned Actions</Title>
                                            <Flex vertical gap={"small"}>
                                                <Input addonBefore={<SearchOutlined />} placeholder="Search" size="large"/>
                                                <Card className="action-card">
                                                    {assignedActions.map((item, index) => (
                                                        <li
                                                            key={index}
                                                            className={selectedAssigned.includes(item) ? "selected-action-list" : "action-list"}
                                                            onClick={() => handleSelect(item, "assigned")}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))}
                                                </Card>
                                            </Flex>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </Flex>
                                <Flex className="save-btn" horizontal gap={"middle"} justify="center">
                                    <Button type="primary" htmlType="submit" size="large"><SaveOutlined/>Save</Button>
                                    <Button type="primary" size="large" onClick={onReset}><UndoOutlined/>Reset</Button>
                                </Flex>
                            </div>
                        </Form>
                        </div>
                    </div>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24} >
                        <AssignedActions
                            userActions={userActions}
                            processes={allProcess}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default UserActionManagement;
