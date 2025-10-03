import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addVehicalPurchaseType, editVehicalPurchaseType } from '../../../features/vehicalPurchaseType/vehicalPurchaseTypeSlice';
import '../styles/vehicalPurchaseType.css';

const { Item } = Form;

export const VehiclePurchaseTypeModal = ({ selectedVehiclePurchaseType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedVehiclePurchaseType?.id) {
            form.setFieldsValue(selectedVehiclePurchaseType);
        } else {
            form.resetFields();
        }
    }, [selectedVehiclePurchaseType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedVehiclePurchaseType?.id) {
                res = await dispatch(editVehicalPurchaseType({ id:selectedVehiclePurchaseType.id, data: values}));
            } else {
                res = await dispatch(addVehicalPurchaseType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save vehical Purchase Type');
            } else {
                message.success(res.payload || 'Vehical Purchase Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save vehical Purchase Type");
        }        
    };

    return (
        <Modal
            title={selectedVehiclePurchaseType?.id ? "Edit Vehical Purchase Type" : "Add Vehical Purchase Type"}
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
                <Item name={'name'} label="Vehical Purchase Type" rules={[{ required: true, message: "Vehical Purchase Type is required", whitespace: true }]}>
                    <Input placeholder="Enter Vehical Purchase Type" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};