import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Modal,Form, Input, message, Select, InputNumber, Row, Col  } from "antd";
import { addMakerModel, editMakerModel } from '../../../features/MakerModel/MakerModelSlice';
import { fetchAllMaker } from '../../../features/maker/makerSlice'; 
import { fetchAllVehicalBodyTypes } from "@/features/vehicalBodyType/vehicalBodyTypeSlice";
import { fetchAllFuel } from "@/features/fuel/fuelSlice";
import '../styles/makermodel.css';

const { Item } = Form;
const { Option } = Select;

export const MakerModelModal = ({ selectedMakerModel, visible, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // ✅ Select from correct state key
  const makers = useSelector((state) => state.maker?.allData || []);
  const vehicleBodyTypes = useSelector((state) => state.vehicalBodyType?.allData || []);
  const fuels = useSelector((state) => state.fuel?.allData || []);

  useEffect(() => {
  if (visible) {
    dispatch(fetchAllMaker());
    dispatch(fetchAllVehicalBodyTypes());
    dispatch(fetchAllFuel());
  }
}, [visible]);

  useEffect(() => {
    if (selectedMakerModel?.id) {
      form.setFieldsValue(selectedMakerModel);
    } else {
      form.resetFields();
    }
  }, [selectedMakerModel, visible]);

  const onCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleSave = async (values) => {
    try {
      let res;
      if (selectedMakerModel?.id) {
        res = await dispatch(editMakerModel({ id: selectedMakerModel.id, data: values }));
      } else {
        res = await dispatch(addMakerModel(values));
      }

      if (res.error) {
        message.error(res.payload || 'Failed to save MakerModel');
      } 
      else {
        message.success(res.payload || 'MakerModel saved successfully');
        onClose();
        form.resetFields();
      }
    }
    
    catch (error) {
      message.error("Failed to save MakerModel");
    }
  };

  return (
    <Modal
      title={selectedMakerModel?.id ? "Edit MakerModel" : "Add MakerModel"}
      open={visible}
      onOk={form.submit}
      onCancel={onCancel}
      okText="Save"
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Row gutter={16}>
        <Col span={12}>
          <Item
            name="name"
            label="MakerModel Name"
            rules={[{ required: true, message: "MakerModel name is required", whitespace: true }]}
          >
            <Input placeholder="Enter MakerModel name" autoFocus />
          </Item>
        </Col>

        <Col span={12}>
          <Item
            name="maker_id"
            label="Maker"
            rules={[{ required: true, message: "Please select a Maker" }]}
          >
            <Select placeholder="Select Maker">
              {makers.map((maker) => (
                <Option key={maker.id} value={maker.id}>
                  {maker.name}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>

        <Col span={12}>
          <Item name="seating_capacity" label="Seating Capacity">
            <InputNumber placeholder="Enter seating capacity" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="standing_capacity" label="Standing Capacity">
            <InputNumber placeholder="Enter standing capacity" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="sleeping_capacity" label="Sleeping Capacity">
            <InputNumber placeholder="Enter sleeping capacity" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="cubic_capacity" label="Cubic Capacity (CC)">
            <InputNumber placeholder="Enter cubic capacity" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="cylinders" label="Number of Cylinders">
            <InputNumber placeholder="Enter number of cylinders" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="unladen_weight" label="Unladen Weight (kg)">
            <InputNumber placeholder="Enter unladen weight" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="laden_weight" label="Laden Weight (kg)">
            <InputNumber placeholder="Enter laden weight" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="horse_power" label="Horse Power (HP)">
            <InputNumber placeholder="Enter horse power" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="wheelbase" label="Wheelbase (mm)">
            <InputNumber placeholder="Enter wheelbase" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>

        <Col span={12}>
          <Item name="vehicle_body_type_id" label="Vehicle Body Type">
            <Select placeholder="Select body type">
              {vehicleBodyTypes.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>
        <Col span={12}>
          <Item name="fuel_id" label="Fuel">
            <Select placeholder="Select fuel">
              {fuels.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Item>
        </Col>
        <Col span={12}>
          <Item name="length" label="Length">
            <InputNumber placeholder="Enter length" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>
        <Col span={12}>
          <Item name="width" label="Width">
            <InputNumber placeholder="Enter width" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>
        <Col span={12}>
          <Item name="height" label="Height">
            <InputNumber placeholder="Enter height" min={0} style={{ width: '100%' }} />
          </Item>
        </Col>
      </Row>
      </Form>
    </Modal>
  );
};
