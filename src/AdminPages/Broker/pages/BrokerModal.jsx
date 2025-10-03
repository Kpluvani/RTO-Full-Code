import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addBroker, editBroker } from '../../../features/broker/brokerSlice';
import '../styles/broker.css';

const { Item } = Form;

export const BrokerModal = ({ selectedBroker, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedBroker?.id) {
            form.setFieldsValue(selectedBroker);
        } else {
            form.resetFields();
        }
    }, [selectedBroker])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedBroker?.id) {
                res = await dispatch(editBroker({ id:selectedBroker.id, data: values}));
            } else {
                res = await dispatch(addBroker(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save broker');
            } else {
                message.success(res.payload || 'Broker saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save broker");
        }        
    };

    return (
        <Modal
            title={selectedBroker?.id ? "Edit Broker" : "Add Broker"}
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
                <Item name={'name'} label="Broker Name" rules={[{ required: true, message: "Broker name is required", whitespace: true }]}>
                    <Input placeholder="Enter broker name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};