import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, message, Select, Switch, InputNumber, Flex } from "antd";
import { addService, editService } from '../../../features/service/serviceSlice';
import { fetchAllWorkCategories } from '../../../features/workCategory/workCategorySlice';
import { fetchAllVehicalType } from '../../../features/vehicalType/vehicalTypeSlice';
import '../styles/service.css';

const { Item } = Form;
const { Option } = Select;

export const ServiceModal = ({ selectedService, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const workCategories = useSelector(state => state?.workCategory?.allData || []);
    const vehicalType = useSelector(state => state?.vehicalType?.allData || []);

    useEffect(() => {
        dispatch(fetchAllWorkCategories());
        dispatch(fetchAllVehicalType());
    }, []);

    useEffect(() => {
        if (selectedService?.id) {
            form.setFieldsValue(selectedService);
        } else {
            form.resetFields();
        }
    }, [selectedService])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedService?.id) {
                res = await dispatch(editService({ id:selectedService.id, data: values}));
            } else {
                res = await dispatch(addService(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Service');
            } else {
                message.success(res.payload || 'Service saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Service");
        }        
    };

    return (
        <Modal
            title={selectedService?.id ? "Edit Service" : "Add Service"}
            open={visible}
            onOk={form.submit}
            onCancel={onCancel}
            okText="Save"
        >
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSave}
            >
               <Item
                    name="name"
                    label="Service Name"
                    rules={[{ required: true, message: "Service Name is required", whitespace: true }]}
                >
                    <Input placeholder="Enter Service Name" autoFocus />
                </Item>

                <Item
                    name="price"
                    label="Price"
                    rules={[{ required: false }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Enter a valid price' }]}
                >
                    <InputNumber placeholder="Enter Price" style={{ width: '100%' }} min={0} />
                </Item>

                <Item
                    name="work_category_id"
                    label="Work Category"
                    rules={[{ required: true, message: 'Please select a work category' }]}
                >
                    <Select placeholder="Select Work Category">
                        {workCategories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Item>

                <Item
                    name="vehicle_type_id"
                    label="Vehicle Type"
                    rules={[{ required: true, message: 'Please select a vehicle type' }]}
                >
                    <Select placeholder="Select Vehicle Type">
                        {vehicalType.map(type => (
                            <Select.Option key={type.id} value={type.id}>
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Item>

                <Item
                    name="tax"
                    label="Tax (%)"
                    rules={[{ required: false }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Enter valid tax percentage' }]}
                >
                    <InputNumber placeholder="Enter Tax (%)" style={{ width: '100%' }} min={0} max={100} />
                </Item>

                <Flex>
                    <Item
                        name="is_show_work_done"
                        label="Show Work Done"
                        valuePropName="checked"
                        labelCol={{ span: 18 }}
                    >
                        <Switch
                            size="small"
                        />
                    </Item>

                    <Item
                        name="amount_reflect_account"
                        label="Amount Reflect In Account"
                        valuePropName="checked"
                        labelCol={{ span: 22 }}
                    >
                        <Switch
                            size="small"
                        />
                    </Item>
                </Flex>
            </Form>
        </Modal>
    );
};