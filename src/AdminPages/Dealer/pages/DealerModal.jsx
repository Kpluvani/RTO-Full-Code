import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import { addDealer, editDealer } from '../../../features/dealer/dealerSlice';
import Input from '@/CustomComponents/CapitalizedInput';
import '../styles/dealer.css';

const { Item } = Form;

export const DealerModal = ({ selectedDealer, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedDealer?.id) {
            form.setFieldsValue(selectedDealer);
        } else {
            form.resetFields();
        }
    }, [selectedDealer])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedDealer?.id) {
                res = await dispatch(editDealer({ id:selectedDealer.id, data: values}));
            } else {
                res = await dispatch(addDealer(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save dealer');
            } else {
                message.success(res.payload || 'Dealer saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save dealer");
        }        
    };

    return (
        <Modal
            title={selectedDealer?.id ? "Edit Dealer" : "Add Dealer"}
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
                <Item name={'name'} label="Dealer Name" rules={[{ required: true, message: "Dealer name is required", whitespace: true }]}>
                    <Input placeholder="Enter dealer name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};