import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addOwnershipType, editOwnershipType } from '../../../features/ownershipType/ownershipTypeSlice';
import '../styles/ownershipType.css';

const { Item } = Form;

export const OwnershipTypeModal = ({ selectedOwnershipType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedOwnershipType?.id) {
            form.setFieldsValue(selectedOwnershipType);
        } else {
            form.resetFields();
        }
    }, [selectedOwnershipType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedOwnershipType?.id) {
                res = await dispatch(editOwnershipType({ id:selectedOwnershipType.id, data: values}));
            } else {
                res = await dispatch(addOwnershipType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Ownership Type');
            } else {
                message.success(res.payload || 'Ownership Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save Ownership Type");
        }        
    };

    return (
        <Modal
            title={selectedOwnershipType?.id ? "Edit Ownership Type" : "Add Ownership Type"}
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
                <Item name={'name'} label="Ownership Type Name" rules={[{ required: true, message: "Ownership Type name is required", whitespace: true }]}>
                    <Input placeholder="Enter Ownership Type name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};