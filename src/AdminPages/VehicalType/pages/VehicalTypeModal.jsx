import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addVehicalType, editVehicalType } from '../../../features/vehicalType/vehicalTypeSlice';
import '../styles/vehicalType.css';

const { Item } = Form;

export const VehicalTypeModal = ({ selectedVehicalType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedVehicalType?.id) {
            form.setFieldsValue(selectedVehicalType);
        } else {
            form.resetFields();
        }
    }, [selectedVehicalType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedVehicalType?.id) {
                res = await dispatch(editVehicalType({ id:selectedVehicalType.id, data: values}));
            } else {
                res = await dispatch(addVehicalType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Vehical Type');
            } else {
                message.success(res.payload || 'Vehical Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Vehical Type");
        }        
    };

    return (
        <Modal
            title={selectedVehicalType?.id ? "Edit Vehical Type" : "Add Vehical Type"}
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
                <Item name={'name'} label="Vehical Type" rules={[{ required: true, message: "Vehical Type is required", whitespace: true }]}>
                    <Input placeholder="Enter Vehical Type" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};