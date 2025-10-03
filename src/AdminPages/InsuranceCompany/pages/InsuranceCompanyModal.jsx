import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addInsuranceCompany, editInsuranceCompany } from '../../../features/insuranceCompany/insuranceCompanySlice';
import '../styles/insuranceCompany.css';

const { Item } = Form;

export const InsuranceCompanyModal = ({ selectedInsuranceCompany, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedInsuranceCompany?.id) {
            form.setFieldsValue(selectedInsuranceCompany);
        } else {
            form.resetFields();
        }
    }, [selectedInsuranceCompany])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedInsuranceCompany?.id) {
                res = await dispatch(editInsuranceCompany({ id:selectedInsuranceCompany.id, data: values}));
            } else {
                res = await dispatch(addInsuranceCompany(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save insurance company');
            } else {
                message.success(res.payload || 'Insurance company saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save insurance company");
        }        
    };

    return (
        <Modal
            title={selectedInsuranceCompany?.id ? "Edit Insurance Company" : "Add Insurance Company"}
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
                <Item name={'name'} label="Insurance Company Name" rules={[{ required: true, message: "Insurance Company name is required", whitespace: true }]}>
                    <Input placeholder="Enter Insurance Company name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};