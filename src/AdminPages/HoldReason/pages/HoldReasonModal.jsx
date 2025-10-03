import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Modal,Form, Input, message, Select } from "antd";
import { addHoldReason, editHoldReason } from '../../../features/HoldReason/HoldReasonSlice';
import { fetchAllWorkCategories } from '../../../features/workCategory/workCategorySlice'; 
import '../style/hold-reason.css';

const { Item } = Form;
const { Option } = Select;

export const HoldReasonModal = ({ selectedHoldReason, visible, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // ✅ Select from correct state key
  const workCategories = useSelector((state) => state.workCategory?.allData || []);

  useEffect(() => {
  if (visible) {
    dispatch(fetchAllWorkCategories());
  }
}, [visible]);

  useEffect(() => {
    if (selectedHoldReason?.id) {
      form.setFieldsValue(selectedHoldReason);
    } else {
      form.resetFields();
    }
  }, [selectedHoldReason, visible]);

  const onCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      let res;
      if (selectedHoldReason?.id) {
        res = await dispatch(editHoldReason({ id: selectedHoldReason.id, data: values }));
      } else {
        res = await dispatch(addHoldReason(values));
      }

      if (res.error) {
        message.error(res.payload || 'Failed to save HoldReason');
      } 
      else {
        message.success(res.payload || 'HoldReason saved successfully');
        onClose();
        form.resetFields();
      }
    }
    
    catch (error) {
      message.error("Failed to save HoldReason");
    }
  };

  return (
    <Modal
      title={selectedHoldReason?.id ? "Edit HoldReason" : "Add HoldReason"}
      open={visible}
      onOk={form.submit}
      onCancel={onCancel}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Item
          name="name"
          label="Hold Reason Name"
          rules={[{ required: true, message: "Hold-Reason name is required", whitespace: true }]}
        >
          <Input placeholder="Enter HoldReason name" autoFocus />
        </Item>

        <Item
          name="work_category_id"
          label="Work Category"
          rules={[{ required: true, message: "Please select a workCategory" }]}
        >
          <Select placeholder="Select workCategory">
            {workCategories.map((workCategory) => (
              <Option key={workCategory.id} value={workCategory.id}>
                {workCategory.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};
