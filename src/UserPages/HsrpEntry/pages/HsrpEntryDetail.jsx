import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Form, message, Card, DatePicker, Typography, Select } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { saveHsrpEntry } from "@/features/application/applicationSlice";
import { SaveAndFileMovement } from "@/Components/SaveAndFileMovement/pages";
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { DateFormat, FILE_MOVEMENT_TYPE } from '@/utils';
import "../styles/hsrpEntry.css";
import dayjs from "dayjs";

const { Item } = Form;
const { Title } = Typography;

const HsrpEntry = ({ application, processes, parties, employees }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { allData: holdReasons = [] } = useSelector(
    (state) => state?.holdReason || {}
  );

  useEffect(() => {
    dispatch(fetchAllHoldReasons());
  }, []);

useEffect(() => {
  if (application?.Hsrp) {
    form.setFieldsValue({
      ...application.Hsrp,
      order_date: application.Hsrp.order_date ? dayjs(application.Hsrp.order_date) : null,
      fixation_date: application.Hsrp.fixation_date ? dayjs(application.Hsrp.fixation_date) : null,
      received_date: application.Hsrp.received_date ? dayjs(application.Hsrp.received_date) : null,
      given_date: application.Hsrp.given_date ? dayjs(application.Hsrp.given_date) : null,
    });
  }
}, [application]);

  // Set initial form values when application data is available

  const onHsrpEntryApplication = async (values) => {
    try {
      const res = await dispatch(
        saveHsrpEntry({
          id: application?.id,
          data: {
            ...values,
            process_id: application?.Process?.id,
          },
        })
      );
      if (res.error) {
        message.error(res.payload || "Failed to Save application");
      } else {
        message.success(res.payload.message || "Data saved successfully");
        if (values.file_movement) {
          navigate("/home");
        }
      }
    } catch (err) {
      console.log(err);
      message.error(err.message || "Failed to Save application");
    }
  };

  // File Movement handler
  const handleFileMovement = async (fileMovementData, closeDialog) => {
    if (fileMovementData.file_movement_type === FILE_MOVEMENT_TYPE.NEXT) {
      form.validateFields().then(async (res) => {
        const values = {
          ...res,
          ...fileMovementData
        };
        console.log('<<Response---', values);
        await onHsrpEntryApplication(values);
        closeDialog && closeDialog();
      }).catch((e) => {
        closeDialog && closeDialog();
      })
    } else {
      let response = form.getFieldsValue();
      const values = {
        ...response,
        ...fileMovementData
      };
      await onHsrpEntryApplication(values);
      closeDialog && closeDialog();
    }
  };
  

  return (
    <div className="hsrp-entry">
      <Form form={form} onFinish={onHsrpEntryApplication} layout="vertical">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="HSRP Order">
              <Row gutter={16}>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item
                    label="Company Name"
                    name="company_name"
                    rules={[{ required: true, message: "Enter Company Name" }]}
                  >
                    <Input placeholder=" Enter Your Company Name" type="text" 
                    onChange={(e) => handleInputChange(e.target.value, 'company_name', 'alphabet')} />
                  </Item>
                </Col>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item
                    label="Order Date"
                    name="order_date"
                    rules={[{ required: true, message: "Select Date" }]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      format={DateFormat}
                      style={{ minWidth: "100%" }}
                    />
                  </Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24}>
              <Card title="HSRP Recieved">
              <Title
                level={5}
                style={{ color: "#2259e3" }}
                className="left-text"
              >
                LID
              </Title>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Front Laser Code"
                    name="front_laser_code"
                    rules={[
                      { required: true, message: "Enter Front Laser Code" },
                    ]}
                  >
                    <Input placeholder=" Enter Your Front Laser Code" 
                    onChange={(e) => handleInputChange(e.target.value, 'front_laser_code', 'alphabet')} />
                  </Item>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Rear Laser Code"
                    name="rear_lase_code"
                    rules={[
                      { required: true, message: "Enter Rear Laser Code" },
                    ]}
                  >
                    <Input placeholder=" Enter Your Rear Laser Code" 
                    onChange={(e) => handleInputChange(e.target.value, 'rear_lase_code', 'alphabet')}/>
                  </Item>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Fixation Date"
                    name="fixation_date"
                    rules={[
                      { required: true, message: "Select Fixation Date" },
                    ]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      format={DateFormat}
                      style={{ minWidth: "100%" }}
                    />
                  </Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Recieved By"
                    name="received_by_id"
                    rules={[{ required: true, message: "Select Reciever Name" }]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }} 
                      options={employees.map((val) => ({ value: val.id, label: val.name }))} 
                      placeholder={"Received By"}
                      showSearch={true}
                      filterOption={(input, option) =>
                          option.label?.toLowerCase()?.includes(input?.toLowerCase())
                      }
                    />
                  </Item>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Date"
                    name="received_date"
                    rules={[{ required: true, message: "Select Date" }]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      format={DateFormat}
                      style={{ minWidth: "100%" }}
                    />
                  </Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Given Name"
                    name="given_by_id"
                    rules={[{ required: true, message: "Enter Given Name" }]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }} 
                      options={parties.map((val) => ({ value: val.id, label: val.name }))} 
                      placeholder={"Given By"}
                      showSearch={true}
                      filterOption={(input, option) =>
                          option.label?.toLowerCase()?.includes(input?.toLowerCase())
                      }
                    />
                  </Item>
                </Col>
                <Col xs={24} sm={12} md={10} lg={8}>
                  <Item
                    label="Date"
                    name="given_date"
                    rules={[{ required: true, message: "Select Date" }]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      format={DateFormat}
                      style={{ minWidth: "100%" }}
                    />
                  </Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <SaveAndFileMovement
          handleFileMovement={handleFileMovement}
          handleSaveData={form.submit}
          holdReasons={holdReasons}
          processes={processes}
          currProcessId={application?.process_id}
        />
      </Form>
    </div>
  );
};

export default HsrpEntry;
