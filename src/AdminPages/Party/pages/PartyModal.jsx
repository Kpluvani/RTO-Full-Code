import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addParty, editParty } from '../../../features/party/partySlice';
import '../styles/party.css';

const { Item } = Form;

export const PartyModal = ({ selectedParty, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedParty?.id) {
            form.setFieldsValue(selectedParty);
        } else {
            form.resetFields();
        }
    }, [selectedParty])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedParty?.id) {
                res = await dispatch(editParty({ id:selectedParty.id, data: values}));
            } else {
                res = await dispatch(addParty(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save party');
            } else {
                message.success(res.payload || 'Party saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save party");
        }        
    };

    return (
        <Modal
            title={selectedParty?.id ? "Edit Party" : "Add Party"}
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
                <Item name={'name'} label="Party Name" rules={[{ required: true, message: "Party name is required", whitespace: true }]}>
                    <Input placeholder="Enter party name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};