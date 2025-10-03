import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addFinancer, editFinancer } from '../../../features/financer/financerSlice';
import '../styles/financer.css';

const { Item } = Form;

export const FinancerModal = ({ selectedFinancer, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedFinancer?.id) {
            form.setFieldsValue(selectedFinancer);
        } else {
            form.resetFields();
        }
    }, [selectedFinancer])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedFinancer?.id) {
                res = await dispatch(editFinancer({ id:selectedFinancer.id, data: values}));
            } else {
                res = await dispatch(addFinancer(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Financer');
            } else {
                message.success(res.payload || 'Financer saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save Financer", error);
        }        
    };

    return (
        <Modal
            title={selectedFinancer?.id ? "Edit Financer" : "Add Financer"}
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
                <Item name={'name'} label="Financer Name" rules={[{ required: true, message: "Financer name is required", whitespace: true }]}>
                    <Input placeholder="Enter Financer name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};