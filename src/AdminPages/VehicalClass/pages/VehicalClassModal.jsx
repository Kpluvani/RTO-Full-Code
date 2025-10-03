import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addVehicalClass, editVehicalClass } from '../../../features/vehicalClass/vehicalClassSlice';
import '../styles/vehicalClass.css';

const { Item } = Form;

export const VehicalClassModal = ({ selectedVehicalClass, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedVehicalClass?.id) {
            form.setFieldsValue(selectedVehicalClass);
        } else {
            form.resetFields();
        }
    }, [selectedVehicalClass])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedVehicalClass?.id) {
                res = await dispatch(editVehicalClass({ id:selectedVehicalClass.id, data: values}));
            } else {
                res = await dispatch(addVehicalClass(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Vehical Class');
            } else {
                message.success(res.payload || 'Vehical Class saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Vehical Class");
        }        
    };

    return (
        <Modal
            title={selectedVehicalClass?.id ? "Edit Vehical Class" : "Add Vehical Class"}
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
                <Item name={'name'} label="Vehical Class" rules={[{ required: true, message: "Vehical Class is required", whitespace: true }]}>
                    <Input placeholder="Enter Vehical Class" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};