import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addVehicalBodyType, editVehicalBodyType } from '../../../features/vehicalBodyType/vehicalBodyTypeSlice';
import '../styles/vehicalBodyType.css';

const { Item } = Form;

export const VehicalBodyTypeModal = ({ selectedVehicalBodyType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedVehicalBodyType?.id) {
            form.setFieldsValue(selectedVehicalBodyType);
        } else {
            form.resetFields();
        }
    }, [selectedVehicalBodyType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedVehicalBodyType?.id) {
                res = await dispatch(editVehicalBodyType({ id:selectedVehicalBodyType.id, data: values}));
            } else {
                res = await dispatch(addVehicalBodyType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save vehical Body Type');
            } else {
                message.success(res.payload || 'Vehical Body Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save vehical Body Type");
        }        
    };

    return (
        <Modal
            title={selectedVehicalBodyType?.id ? "Edit Vehical Body Type" : "Add Vehical Body Type"}
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
                <Item name={'name'} label="Vehical Body Type" rules={[{ required: true, message: "Vehical Body Type is required", whitespace: true }]}>
                    <Input placeholder="Enter Vehical Body Type" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};