import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addSubAgent, editSubAgent } from '../../../features/subAgent/subAgentSlice';
import '../styles/subAgent.css';

const { Item } = Form;

export const SubAgentModal = ({ selectedSubAgent, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedSubAgent?.id) {
            form.setFieldsValue(selectedSubAgent);
        } else {
            form.resetFields();
        }
    }, [selectedSubAgent])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedSubAgent?.id) {
                res = await dispatch(editSubAgent({ id:selectedSubAgent.id, data: values}));
            } else {
                res = await dispatch(addSubAgent(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save SubAgent');
            } else {
                message.success(res.payload || 'SubAgent saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save SubAgent");
        }        
    };

    return (
        <Modal
            title={selectedSubAgent?.id ? "Edit SubAgent" : "Add SubAgent"}
            open={visible}
            onOk={form.submit}
            onCancel={onCancel}
            okText="Save"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Item name={'name'} label="SubAgent Name" rules={[{ required: true, message: "SubAgent name is required", whitespace: true }]}>
                    <Input placeholder="Enter SubAgent name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};