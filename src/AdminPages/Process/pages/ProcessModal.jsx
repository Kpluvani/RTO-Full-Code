import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message, Select, Switch, InputNumber } from "antd";
import { addProcess, editProcess } from '@/features/process/processSlice';
import '../styles/process.css';

const { Item } = Form;
const { Option } = Select;

export const ProcessModal = ({ selectedProcess, visible, onClose, workCategories = [], workCategoryLoading }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedProcess?.id) {
            form.setFieldsValue(selectedProcess);
        } else {
            form.resetFields();
        }
    }, [selectedProcess]);

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedProcess?.id) {
                res = await dispatch(editProcess({ id:selectedProcess.id, data: values}));
            } else {
                res = await dispatch(addProcess(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Process');
            } else {
                message.success(res.payload || 'Process saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Process");
        }        
    };

    return (
        <Modal
            title={selectedProcess?.id ? "Edit Process" : "Add Process"}
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
                <Item
                    name="name"
                    label="Process Name"
                    rules={[{ required: true, message: "Process Name is required", whitespace: true }]}
                >
                    <Input placeholder="Enter Process Name" autoFocus />
                </Item>

                <Item
                    name="key"
                    label="Key"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Enter Key" />
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

                <Item
                    name="step"
                    label="Step"
                    rules={[
                        { required: true, message: 'Step is required' },
                        { pattern: /^\d+$/, message: 'Step must be a number' }
                    ]}
                >
                    <InputNumber placeholder="Enter Step" min={1} style={{ width: '100%' }} />
                </Item>

                <Item
                    name="icon"
                    label="Icon"
                    rules={[{ required: false }]}
                >
                    <Input placeholder="Enter Icon (SVG / class / text)" />
                </Item>

                <Item
                    name="is_required"
                    label="Is Required"
                    valuePropName="checked"
                >
                    <Switch />
                </Item>
            </Form>
        </Modal>
    );
};