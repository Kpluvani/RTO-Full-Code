import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addSendRtoType, editSendRtoType } from '../../../features/sendRtoType/sendRtoTypeSlice';
import '../styles/sendRtoType.css';

const { Item } = Form;

export const SendRtoTypeModal = ({ selectedSendRtoType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedSendRtoType?.id) {
            form.setFieldsValue(selectedSendRtoType);
        } else {
            form.resetFields();
        }
    }, [selectedSendRtoType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedSendRtoType?.id) {
                res = await dispatch(editSendRtoType({ id:selectedSendRtoType.id, data: values}));
            } else {
                res = await dispatch(addSendRtoType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Send Rto Type');
            } else {
                message.success(res.payload || 'Send Rto Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Send Rto Type");
        }        
    };

    return (
        <Modal
            title={selectedSendRtoType?.id ? "Edit Send Rto Type" : "Add Send Rto Type"}
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
                <Item name={'name'} label="Send Rto Type Name" rules={[{ required: true, message: "Send Rto Type name is required", whitespace: true }]}>
                    <Input placeholder="Enter Send Rto Type name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};