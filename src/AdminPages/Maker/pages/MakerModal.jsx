import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addMaker, editMaker } from '../../../features/maker/makerSlice';
import '../styles/maker.css';

const { Item } = Form;

export const MakerModal = ({ selectedMaker, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedMaker?.id) {
            form.setFieldsValue(selectedMaker);
        } else {
            form.resetFields();
        }
    }, [selectedMaker])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedMaker?.id) {
                res = await dispatch(editMaker({ id:selectedMaker.id, data: values}));
            } else {
                res = await dispatch(addMaker(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Maker');
            } else {
                message.success(res.payload || 'Maker saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save Maker", error);
        }        
    };

    return (
        <Modal
            title={selectedMaker?.id ? "Edit Maker" : "Add Maker"}
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
                <Item name={'name'} label="Maker Name" rules={[{ required: true, message: "Maker name is required", whitespace: true }]}>
                    <Input placeholder="Enter Maker name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};