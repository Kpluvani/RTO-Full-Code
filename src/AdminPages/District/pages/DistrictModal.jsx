import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message, Select } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addDistrict, editDistrict } from '../../../features/district/districtSlice';
import '../styles/district.css';

const { Item } = Form;

export const DistrictModal = ({ selectedDistrict, visible, onClose, states }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedDistrict?.id) {
            form.setFieldsValue(selectedDistrict);
        } else {
            form.resetFields();
        }
    }, [selectedDistrict])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            console.log('<<values--', values);
            const data = { ...values };
            if (selectedDistrict?.id) {
                res = await dispatch(editDistrict({ id: selectedDistrict.id, data }));
            } else {
                res = await dispatch(addDistrict(data));
            }
            console.log('<<res---', res);
            if (res.error) {
                message.error(res.payload || 'Failed to save District');
            } else {
                message.success(res.payload || 'District saved successfully');
                onCancel();
            }
        } catch (e) {
            message.error("Failed to save District");
        }        
    };

    return (
        <Modal
            title={selectedDistrict?.id ? "Edit District" : "Add District"}
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
                <Item name={'name'} label="District Name" rules={[{ required: true, message: "District name is required", whitespace: true }]}>
                    <Input placeholder="Enter district name" autoFocus={true}/>
                </Item>
                <Item name={'state_id'} label="State" rules={[{ required: true, message: "State is required" }]}>
                    <Select
                        placeholder="Select state"
                        options={states.map((state) => ({ value: state.id, label: state.name }))}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.label?.toLowerCase()?.includes(input?.toLowerCase())
                        }
                    />
                </Item>
            </Form>
        </Modal>
    );
};