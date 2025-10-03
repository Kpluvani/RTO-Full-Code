import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addDesignation, editDesignation } from '../../../features/designation/designationSlice';
import '../styles/designation.css';

const { Item } = Form;

export const DesignationModal = ({ selectedDesignation, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedDesignation?.id) {
            form.setFieldsValue(selectedDesignation);
        } else {
            form.resetFields();
        }
    }, [selectedDesignation])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedDesignation?.id) {
                res = await dispatch(editDesignation({ id:selectedDesignation.id, data: values}));
            } else {
                res = await dispatch(addDesignation(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save designation');
            } else {
                message.success(res.payload || 'Designation saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save designation");
        }        
    };

    return (
        <Modal
            title={selectedDesignation?.id ? "Edit Designation" : "Add Designation"}
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
                <Item name={'name'} label="Designation Name" rules={[{ required: true, message: "Designation name is required", whitespace: true }]}>
                    <Input placeholder="Enter designation name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};