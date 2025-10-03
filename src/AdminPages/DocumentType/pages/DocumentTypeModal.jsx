import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Modal, Form, message } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { addDocumentType, editDocumentType } from '../../../features/documentType/documentTypeSlice';
import '../styles/documentType.css';

const { Item } = Form;

export const DocumentTypeModal = ({ selectedDocumentType, visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedDocumentType?.id) {
            form.setFieldsValue(selectedDocumentType);
        } else {
            form.resetFields();
        }
    }, [selectedDocumentType])

    const onCancel = () => {
        onClose();
        form.resetFields();
    }

    const handleSave = async (values) => {
        try {
            let res;
            if (selectedDocumentType?.id) {
                res = await dispatch(editDocumentType({ id:selectedDocumentType.id, data: values}));
            } else {
                res = await dispatch(addDocumentType(values));
            }
            if (res.error) {
                message.error(res.payload || 'Failed to save document Type');
            } else {
                message.success(res.payload || 'Document Type saved successfully');
                onClose();
                form.resetFields();
            }
        } catch (e) {
            message.error("Failed to save document type");
        }        
    };

    return (
        <Modal
            title={selectedDocumentType?.id ? "Edit Document Type" : "Add Document Type"}
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
                <Item name={'name'} label="Document Type Name" rules={[{ required: true, message: "Document Type name is required", whitespace: true }]}>
                    <Input placeholder="Enter document type name" autoFocus={true}/>
                </Item>
            </Form>
        </Modal>
    );
};