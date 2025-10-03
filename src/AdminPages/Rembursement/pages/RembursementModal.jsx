import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addRembursement, editRembursement } from '../../../features/rembursement/rembursementSlice';
import '../styles/rembursement.css';

const { Item } = Form;

export const RembursementModal = ({ selectedRembursement, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedRembursement?.id) {
            form.setFieldsValue(selectedRembursement);
        } else {
            form.resetFields();
        }
    }, [selectedRembursement])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedRembursement?.id) {
                res = await dispatch(editRembursement({ id:selectedRembursement.id, data: values}));
            } else {
                res = await dispatch(addRembursement(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Rembursement');
            } else {
                message.success(res.payload || 'Rembursement saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Rembursement");
        }        
    };

    return (
        <Modal
            title={selectedRembursement?.id ? "Edit Rembursement" : "Add Rembursement"}
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
                <Item name={'name'} label="Rembursement Name" rules={[{ required: true, message: "Rembursement name is required", whitespace: true }]}>
                    <Input placeholder="Enter Rembursement name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};