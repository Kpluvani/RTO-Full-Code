import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addOwnerCategory, editOwnerCategory } from '../../../features/ownerCategory/ownerCategorySlice';
import '../styles/ownerCategory.css';

const { Item } = Form;

export const OwnerCategoryModal = ({ selectedOwnerCategory, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedOwnerCategory?.id) {
            form.setFieldsValue(selectedOwnerCategory);
        } else {
            form.resetFields();
        }
    }, [selectedOwnerCategory])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedOwnerCategory?.id) {
                res = await dispatch(editOwnerCategory({ id:selectedOwnerCategory.id, data: values}));
            } else {
                res = await dispatch(addOwnerCategory(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Owner Category');
            } else {
                message.success(res.payload || 'Owner Category saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Owner Category");
        }        
    };

    return (
        <Modal
            title={selectedOwnerCategory?.id ? "Edit Owner Category" : "Add Owner Category"}
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
                <Item name={'name'} label="Owner Category Name" rules={[{ required: true, message: "Owner Category name is required", whitespace: true }]}>
                    <Input placeholder="Enter Owner Category name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};