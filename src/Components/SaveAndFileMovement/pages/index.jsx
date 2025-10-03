import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button, Dropdown, Divider, message, Modal, Radio, Select, AutoComplete } from "antd";
import TextArea from '@/CustomComponents/CapitalizedTextArea';
import { DownOutlined } from "@ant-design/icons";
import { LuSave } from "react-icons/lu";
import { GrCompare } from "react-icons/gr";
import { RiArrowGoBackFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BiHomeCircle } from "react-icons/bi";
import { FILE_MOVEMENT_TYPE } from '@/utils';
import * as _ from 'lodash';
import "../styles/fileMovement.css";

export const SaveAndFileMovement = ({ formRef, handleSaveData, handleFileMovement, onFinishFailed, holdReasons = [], processes = [], currProcessId ,tabIndex = 40}) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('next');
    const [currProcess, setCurrProcess] = useState(null);
    const [revertProcesses, setRevertProcesses] = useState(null);
    const saveButtonTabIndex = tabIndex;
    const backButtonTabIndex = tabIndex + 1;
    const modalFirstFieldTabIndex = tabIndex + 2;
    // const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        if (currProcessId && processes?.length) {
            const curr = processes.find((val) => val.id == currProcessId);
            setCurrProcess(curr);
            const steps = _.sortBy(processes, 'step').filter((val) => parseInt(val.step) < parseInt(curr.step)).map((val) => ({ label: val.name, value: val.id }));
            setRevertProcesses(steps);
        }
    }, [processes, currProcessId]);

    const menuItems = [
        {

          key: 'file-movement',
          icon: <BiTransferAlt style={{ fontSize: '1.2rem' }} />,
          label: "File Movement",
        },
        {
          key: 'save',
          icon: <LuSave style={{ fontSize: '1.2rem' }} />,
          label: "Save",
        },
        { type: 'divider' },
        {
          key: 'home',
          icon: <BiHomeCircle style={{ fontSize: '1.2rem' }} />,
          label: "Home Page",
        },
    ];

    const onOpenModal = () => setOpen(true);
    const onClose = () => setOpen(false);

    // const handleButtonKeyDown = (e) => {
    //     if (e.key === 'Enter' || e.key === ' ') {
    //         e.preventDefault();
    //         setDropdownOpen(true); // open dropdown on Enter/Space
    //     }
    // };

    // const onDropdownOpenChange = (open) => {
    //     setDropdownOpen(open);
    // };

    const onSaveFileMovement = (values) => {        
        let nextObj = {
            file_movement_type: FILE_MOVEMENT_TYPE.NEXT,
            file_movement: true,
            remark: values.remark,
        }
        if (values.status === FILE_MOVEMENT_TYPE.HOLD) {
            nextObj = {
                ...nextObj,
                file_movement_type: FILE_MOVEMENT_TYPE.HOLD,
                hold_reason: values.hold_reason
            };
        } else if (values.status === FILE_MOVEMENT_TYPE.REVERT) {
            nextObj = {
                ...nextObj,
                file_movement_type: FILE_MOVEMENT_TYPE.REVERT,
                revert_process_id: values.revert_process_id
            };
        } else if (values.status === FILE_MOVEMENT_TYPE.SKIP) {
            nextObj = {
                ...nextObj,
                file_movement_type: FILE_MOVEMENT_TYPE.SKIP,
                revert_process_id: values.revert_process_id
            };
        }
        handleFileMovement(nextObj, onClose);
    }

    const showFileMovementDialog = (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={"File Movement"}
            centered
            width={750}
        >
            <Form
                form={form}
                layout={'vertical'}
                onFinish={onSaveFileMovement}
            >
                <Row gutter={[16, 16]} style={{ rowGap: 0 }}>
                    <Col span={14}>
                        <Form.Item label={'Office Remarks'} name={'remark'}>
                            <TextArea
                                placeholder="Office Remark?"
                                rows={3}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={10}>
                        <Form.Item noStyle name={'status'} initialValue={status}>
                            <Radio.Group
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}
                            >
                                <Radio value={FILE_MOVEMENT_TYPE.NEXT}>Proceed To Next Seat</Radio>
                                <Radio value={FILE_MOVEMENT_TYPE.HOLD}>Hold Due To Incomplete Application</Radio>
                                <Radio value={FILE_MOVEMENT_TYPE.REVERT} disabled={!(currProcess?.step > 1)}>Revert Back For Rectification</Radio>
                                {currProcess?.is_required === false && (
                                    <Radio value={FILE_MOVEMENT_TYPE.SKIP}>Skip</Radio>
                                )}
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    {status === FILE_MOVEMENT_TYPE.HOLD && (
                        <Col span={24}>
                            <Form.Item name={'hold_reason'} label={'Reason For Hold'} className='mb-0'>
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    placeholder="Select"
                                    options={holdReasons.map((val) => ({ value: val.name, label: val.name }))}
                                    showSearch={true}
                                    filterOption={(input, option) =>
                                        option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    )}
                    {status === FILE_MOVEMENT_TYPE.REVERT && (
                        <Col span={24}>
                            <Form.Item
                                name={'revert_process_id'}
                                label={'Revert Back On'}
                                className='mb-0'
                                rules={[{ required: true, message: 'Please select a process' }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Select"
                                    options={revertProcesses}
                                    showSearch
                                    filterOption={(input, option) => {
                                        console.log('<<onSerach--', input, option, option.label?.toLowerCase()?.includes(input?.toLowerCase()))
                                        return option.label?.toLowerCase()?.includes(input?.toLowerCase())
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Divider/>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType='submit'>
                            <LuSave style={{ fontSize: '1rem' }}/> Save 
                        </Button>
                        <Button type="primary" style={{ marginLeft: 8 }}>
                            <GrCompare style={{ fontSize: '1rem' }}/> Compare Changes
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )

    const onClickSaveMenu = async (item) => {
        if (item.key === 'save') {
            await handleSaveData();
        } else if (item.key === 'file-movement') {
            if (formRef) {
                // formRef.validateFields().then(async (res) => {
                    onOpenModal();
                // }).catch((e) => {
                //     onFinishFailed && onFinishFailed(e);
                // })
            } else {
                onOpenModal();
            }
        } else if (item.key === 'home') {
            navigate('/home');
        }
    }

    return (
        <Row gutter={16} className="mb-6" style={{ justifyContent: 'center', marginTop: '2rem'}}>
            {showFileMovementDialog}
            <Col>
                <Dropdown
                    menu={{
                        items: menuItems,
                        // .map((item) =>
                        // item.type === "divider"
                        //     ? { type: "divider", key: `divider-${Math.random()}` }
                        //     : { ...item, tabIndex: 0 }
                        // ),
                        onClick: onClickSaveMenu,
                        // defaultSelectedKeys: ['file-movement'], // ✅ set "File Movement" as active
                    }}
                    trigger={["click"]}
                    // open={dropdownOpen} // controlled, remains false until user clicks
                    // onOpenChange={(open) => setDropdownOpen(open)}
                    >
                    <Button
                        type="primary"
                        className="save-button"
                        style={{ width: '100%' }}
                        tabIndex={40}// focusable via tab
                    >
                        <LuSave style={{ fontSize: '1rem' }} /> Save & File Movement <DownOutlined />
                    </Button>
                </Dropdown>
            </Col>
            <Col>
                <Button
                    className="back-button"
                    type="primary"
                    onClick={() => navigate('/home')}
                    tabIndex={41}
                >
                    <RiArrowGoBackFill style={{fontSize: '1rem'}} /> Back
                </Button>
            </Col>
        </Row>
    )
}

