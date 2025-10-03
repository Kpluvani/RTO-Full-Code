import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addUserCategory, editUserCategory } from '../../../features/userCategory/userCategorySlice';
import '../styles/userCategory.css';

const { Item } = Form;

export const UserCategoryModal = ({ selectedUserCategory, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedUserCategory?.id) {
            form.setFieldsValue(selectedUserCategory);
        } else {
            form.resetFields();
        }
    }, [selectedUserCategory])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedUserCategory?.id) {
                res = await dispatch(editUserCategory({ id:selectedUserCategory.id, data: values}));
            } else {
                res = await dispatch(addUserCategory(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save User Category');
            } else {
                message.success(res.payload || 'User Category saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save User Category");
        }        
    };

    return (
        <Modal
            title={selectedUserCategory?.id ? "Edit User Category" : "Add User Category"}
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
                <Item name={'name'} label="User Category" rules={[{ required: true, message: "User Category is required", whitespace: true }]}>
                    <Input placeholder="Enter User Category" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};