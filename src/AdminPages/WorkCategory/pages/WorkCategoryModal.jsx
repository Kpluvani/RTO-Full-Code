import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addWorkCategory, editWorkCategory } from '../../../features/workCategory/workCategorySlice';
import '../styles/workCategory.css';

const { Item } = Form;

export const WorkCategoryModal = ({ selectedWorkCategory, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedWorkCategory?.id) {
            form.setFieldsValue(selectedWorkCategory);
        } else {
            form.resetFields();
        }
    }, [selectedWorkCategory])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedWorkCategory?.id) {
                res = await dispatch(editWorkCategory({ id:selectedWorkCategory.id, data: values}));
            } else {
                res = await dispatch(addWorkCategory(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Work Category');
            } else {
                message.success(res.payload || 'Work Category saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Work Category");
        }        
    };

    return (
        <Modal
            title={selectedWorkCategory?.id ? "Edit Work Category" : "Add Work Category"}
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
                <Item name={'name'} label="Work Category Name" rules={[{ required: true, message: "Work Category name is required", whitespace: true }]}>
                    <Input placeholder="Enter Work Category name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};