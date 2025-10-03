import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addPurchaseAs, editPurchaseAs } from '../../../features/purchaseAs/purchaseAsSlice';
import '../styles/purchaseAs.css';

const { Item } = Form;

export const PurchaseAsModal = ({ selectedPurchaseAs, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedPurchaseAs?.id) {
            form.setFieldsValue(selectedPurchaseAs);
        } else {
            form.resetFields();
        }
    }, [selectedPurchaseAs])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedPurchaseAs?.id) {
                res = await dispatch(editPurchaseAs({ id:selectedPurchaseAs.id, data: values}));
            } else {
                res = await dispatch(addPurchaseAs(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Purchase As');
            } else {
                message.success(res.payload || 'Purchase As saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Purchase As");
        }        
    };

    return (
        <Modal
            title={selectedPurchaseAs?.id ? "Edit Purchase As" : "Add Purchase As"}
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
                <Item name={'name'} label="Purchase As Name" rules={[{ required: true, message: "Purchase As name is required", whitespace: true }]}>
                    <Input placeholder="Enter Purchase As name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};