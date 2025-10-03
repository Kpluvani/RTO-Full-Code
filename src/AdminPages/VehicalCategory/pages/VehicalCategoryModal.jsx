import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addVehicalCategory, editVehicalCategory } from '../../../features/vehicalCategory/vehicalCategorySlice';
import '../styles/vehicalCategory.css';

const { Item } = Form;

export const VehicalCategoryModal = ({ selectedVehicalCategory, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedVehicalCategory?.id) {
            form.setFieldsValue(selectedVehicalCategory);
        } else {
            form.resetFields();
        }
    }, [selectedVehicalCategory])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedVehicalCategory?.id) {
                res = await dispatch(editVehicalCategory({ id:selectedVehicalCategory.id, data: values}));
            } else {
                res = await dispatch(addVehicalCategory(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Vehical Category');
            } else {
                message.success(res.payload || 'Vehical Category saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Vehical Category");
        }        
    };

    return (
        <Modal
            title={selectedVehicalCategory?.id ? "Edit Vehical Category" : "Add Vehical Category"}
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
                <Item name={'name'} label="Vehical Category" rules={[{ required: true, message: "Vehical Category is required", whitespace: true }]}>
                    <Input placeholder="Enter Vehical Category" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};