import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addManufactureLocation, editManufactureLocation } from '../../../features/manufactureLocation/manufactureLocationSlice';
import '../styles/manufactureLocation.css';

const { Item } = Form;

export const ManufactureLocationModal = ({ selectedManufactureLocation, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedManufactureLocation?.id) {
            form.setFieldsValue(selectedManufactureLocation);
        } else {
            form.resetFields();
        }
    }, [selectedManufactureLocation])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedManufactureLocation?.id) {
                res = await dispatch(editManufactureLocation({ id:selectedManufactureLocation.id, data: values}));
            } else {
                res = await dispatch(addManufactureLocation(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Manufacture Location');
            } else {
                message.success(res.payload || 'Manufacture Location saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save ManufactureLocation", error);
        }        
    };

    return (
        <Modal
            title={selectedManufactureLocation?.id ? "Edit Manufacture Location" : "Add Manufacture Location"}
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
                <Item name={'name'} label="Manufacture Location Name" rules={[{ required: true, message: "Manufacture Location name is required", whitespace: true }]}>
                    <Input placeholder="Enter Manufacture Location name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};