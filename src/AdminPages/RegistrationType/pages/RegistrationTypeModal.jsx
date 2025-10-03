import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addRegistrationType, editRegistrationType } from '../../../features/registrationType/registrationTypeSlice';
import '../styles/registrationType.css';

const { Item } = Form;

export const RegistrationTypeModal = ({ selectedRegistrationType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedRegistrationType?.id) {
            form.setFieldsValue(selectedRegistrationType);
        } else {
            form.resetFields();
        }
    }, [selectedRegistrationType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedRegistrationType?.id) {
                res = await dispatch(editRegistrationType({ id:selectedRegistrationType.id, data: values}));
            } else {
                res = await dispatch(addRegistrationType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Registration Type');
            } else {
                message.success(res.payload || 'Registration Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Registration Type");
        }        
    };

    return (
        <Modal
            title={selectedRegistrationType?.id ? "Edit Registration Type" : "Add Registration Type"}
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
                <Item name={'name'} label="Registration Type Name" rules={[{ required: true, message: "Registration Type name is required", whitespace: true }]}>
                    <Input placeholder="Enter Registration Type name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};