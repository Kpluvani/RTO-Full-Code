import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addState, editState } from '../../../features/state/stateSlice';
import '../styles/state.css';

const { Item } = Form;

export const StateModal = ({ selectedState, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedState?.id) {
            form.setFieldsValue(selectedState);
        } else {
            form.resetFields();
        }
    }, [selectedState])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            const data = { ...values, state_code: (values.state_code || '').toString() };
            if (selectedState?.id) {
                res = await dispatch(editState({ id: selectedState.id, data }));
            } else {
                res = await dispatch(addState(data));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save State');
            } else {
                message.success(res.payload || 'State saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save State");
        }        
    };

    return (
        <Modal
            title={selectedState?.id ? "Edit State" : "Add State"}
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
                <Item name={'name'} label="State Name" rules={[{ required: true, message: "State name is required", whitespace: true }]}>
                    <Input placeholder="Enter state name" autoFocus={true}/>
                </Item>
                <Item name={'state_code'} label="State Code" rules={[{ required: true, message: "State code is required" }]}>
                    <Input type="number" placeholder="Enter state code" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};