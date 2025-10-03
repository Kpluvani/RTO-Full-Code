import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from "antd";
import { addRemark, editRemark } from '../../../features/remark/remarkSlice';
import '../styles/Remark.css';

const { Item } = Form;

export const RemarkModal = ({ selectedRemark, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedRemark?.id) {
            form.setFieldsValue(selectedRemark);
        } else {
            form.resetFields();
        }
    }, [selectedRemark])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedRemark?.id) {
                res = await dispatch(editRemark({ id:selectedRemark.id, data: values}));
            } else {
                res = await dispatch(addRemark(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save Remark');
            } else {
                message.success(res.payload || 'Remark saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to save Remark", error);
        }        
    };

    return (
        <Modal
            title={selectedRemark?.id ? "Edit Remark" : "Add Remark"}
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
                <Item name={'name'} label="Remark Question" rules={[{ required: true, message: "Remark name is required", whitespace: true }]}>
                    <Input placeholder="Enter Remark name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};