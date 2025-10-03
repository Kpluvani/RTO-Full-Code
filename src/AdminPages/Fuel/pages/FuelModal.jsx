import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addFuel, editFuel } from '../../../features/fuel/fuelSlice';
import '../styles/fuel.css';

const { Item } = Form;

export const FuelModal = ({ selectedFuel, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedFuel?.id) {
            form.setFieldsValue(selectedFuel);
        } else {
            form.resetFields();
        }
    }, [selectedFuel])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedFuel?.id) {
                res = await dispatch(editFuel({ id:selectedFuel.id, data: values}));
            } else {
                res = await dispatch(addFuel(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save fuel');
            } else {
                message.success(res.payload || 'Fuel saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save fuel");
        }        
    };

    return (
        <Modal
            title={selectedFuel?.id ? "Edit Fuel" : "Add Fuel"}
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
                <Item name={'name'} label="Fuel Name" rules={[{ required: true, message: "Fuel name is required", whitespace: true }]}>
                    <Input placeholder="Enter fuel name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};