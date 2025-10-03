import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addNom, editNom } from '../../../features/nom/nomSlice';
import '../styles/nom.css';

const { Item } = Form;

export const NomModal = ({ selectedNom, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedNom?.id) {
            form.setFieldsValue(selectedNom);
        } else {
            form.resetFields();
        }
    }, [selectedNom])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedNom?.id) {
                res = await dispatch(editNom({ id:selectedNom.id, data: values}));
            } else {
                res = await dispatch(addNom(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save nom');
            } else {
                message.success(res.payload || 'Nom saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save nom");
        }        
    };

    return (
        <Modal
            title={selectedNom?.id ? "Edit Nom" : "Add Nom"}
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
                <Item name={'name'} label="Nom Name" rules={[{ required: true, message: "Nom name is required", whitespace: true }]}>
                    <Input placeholder="Enter nom name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};