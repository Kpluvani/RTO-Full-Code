import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addInsuranceType, editInsuranceType } from '../../../features/insuranceType/insuranceTypeSlice';
import '../styles/insuranceType.css';

const { Item } = Form;

export const InsuranceTypeModal = ({ selectedInsuranceType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedInsuranceType?.id) {
            form.setFieldsValue(selectedInsuranceType);
        } else {
            form.resetFields();
        }
    }, [selectedInsuranceType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedInsuranceType?.id) {
                res = await dispatch(editInsuranceType({ id:selectedInsuranceType.id, data: values}));
            } else {
                res = await dispatch(addInsuranceType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save insurance type');
            } else {
                message.success(res.payload || 'Insurance Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save insurance type");
        }        
    };

    return (
        <Modal
            title={selectedInsuranceType?.id ? "Edit Insurance Type" : "Add Insurance Type"}
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
                <Item name={'name'} label="Insurance Type Name" rules={[{ required: true, message: "Insurance Type name is required", whitespace: true }]}>
                    <Input placeholder="Enter insurance type name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};