import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, message, Select } from "antd";
import { addAction, editAction } from '@/features/action/actionSlice';
import '../styles/action.css';

const { Item } = Form;
const { Option } = Select;

export const ActionModal = ({ selectedAction, visible, onClose, workCategories = [], workCategoryLoading }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedAction?.id) {
            form.setFieldsValue(selectedAction);
        } else {
            form.resetFields();
        }
    }, [selectedAction])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedAction?.id) {
                res = await dispatch(editAction({ id:selectedAction.id, data: values}));
            } else {
                res = await dispatch(addAction(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Action');
            } else {
                message.success(res.payload || 'Action saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Action");
        }        
    };

    return (
        <Modal
            title={selectedAction?.id ? "Edit Action" : "Add Action"}
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
                <Item name={'name'} label="Action Name" rules={[{ required: true, message: "Action Name is required", whitespace: true }]}> 
                    <Input placeholder="Enter Action Name" autoFocus={true}/>
                </Item>
                <Item name={'slug'} label="Slug" rules={[{ required: true, message: "Slug is required", whitespace: true }]}> 
                    <Input placeholder="Enter Slug"/>
                </Item>
                <Item name={'work_category_id'} label="Work Category" rules={[{ required: true, message: "Work Category is required" }]}> 
                    <Select
                        placeholder="Select Work Category"
                        loading={workCategoryLoading}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {workCategories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                        ))}
                    </Select>
                </Item>
            </Form>
        </Modal>
    );
};