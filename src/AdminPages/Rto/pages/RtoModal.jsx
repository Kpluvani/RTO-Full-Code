import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message, Select } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addRto, editRto } from '../../../features/rto/rtoSlice';
import '../styles/rto.css';

const { Item } = Form;

export const RtoModal = ({ selectedRto, visible, onClose, states = [], districts = [] }) => {
    const [selectedState, setSelectedState] = useState(null);
    const [filterDistricts, setFilterDistricts] = useState([]);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedRto?.id) {
            form.setFieldsValue(selectedRto);
            setSelectedState(selectedRto.state_id);
            setFilterDistricts(districts.filter((val) => val.state_id == selectedRto.state_id));
        } else {
            form.resetFields();
        }
    }, [selectedRto, districts]);

    useEffect(() => {
        if (selectedState) {
            setFilterDistricts(districts.filter((val) => val.state_id == selectedState));
        }
    }, [selectedState])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedRto?.id) {
                res = await dispatch(editRto({ id: selectedRto.id, data: values}));
            } else {
                res = await dispatch(addRto(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save RTO');
            } else {
                message.success(res.payload || 'RTO saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save RTO");
        }        
    };

    return (
        <Modal
            title={selectedRto?.id ? "Edit RTO" : "Add RTO"}
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
                <Item name={'name'} label="RTO Name" rules={[{ required: true, message: "RTO name is required", whitespace: true }]}>
                    <Input placeholder="Enter RTO name" autoFocus={true}/>
                </Item>
                <Item name={'state_id'} label="State" rules={[{ required: true, message: "State is required" }]}>
                    <Select
                        showSearch
                        placeholder="Select state"
                        options={states.map((state) => ({ value: state.id, label: state.name }))}
                        filterOption={(input, option) =>
                            option.label?.toLowerCase()?.includes(input?.toLowerCase())
                        }
                        onChange={(val) => {
                            setSelectedState(val);
                            form.setFieldValue('district_id', null);
                        }}
                    />
                </Item>
                <Item name={'district_id'} label="District" rules={[{ required: true, message: "District is required" }]}>
                    <Select
                        showSearch
                        placeholder="Select District"
                        options={filterDistricts.map((district) => ({ value: district.id, label: district.name }))}
                        filterOption={(input, option) =>
                            option.label?.toLowerCase()?.includes(input?.toLowerCase())
                        }
                    />
                </Item>
            </Form>
        </Modal>
    );
};