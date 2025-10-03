import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addYear, editYear } from '../../../features/year/yearSlice';
import '../styles/year.css';

const { Item } = Form;

export const YearModal = ({ selectedYear, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedYear?.id) {
            form.setFieldsValue(selectedYear);
        } else {
            form.resetFields();
        }
    }, [selectedYear])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedYear?.id) {
                res = await dispatch(editYear({ id:selectedYear.id, data: values}));
            } else {
                res = await dispatch(addYear(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Year');
            } else {
                message.success(res.payload || 'Year saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save Year", error);
        }        
    };

    return (
        <Modal
            title={selectedYear?.id ? "Edit Year" : "Add Year"}
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
                <Item name={'name'} label="Year Name" rules={[{ required: true, message: "Year name is required", whitespace: true }]}>
                    <Input placeholder="Enter Year name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};