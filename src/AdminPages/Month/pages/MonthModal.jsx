import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addMonth, editMonth } from '../../../features/month/monthSlice';
import '../styles/month.css';

const { Item } = Form;

export const MonthModal = ({ selectedMonth, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedMonth?.id) {
            form.setFieldsValue(selectedMonth);
        } else {
            form.resetFields();
        }
    }, [selectedMonth])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedMonth?.id) {
                res = await dispatch(editMonth({ id:selectedMonth.id, data: values}));
            } else {
                res = await dispatch(addMonth(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Month');
            } else {
                message.success(res.payload || 'Month saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save Month", error);
        }        
    };

    return (
        <Modal
            title={selectedMonth?.id ? "Edit Month" : "Add Month"}
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
                <Item name={'name'} label="Month Name" rules={[{ required: true, message: "Month name is required", whitespace: true }]}>
                    <Input placeholder="Enter Month name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};