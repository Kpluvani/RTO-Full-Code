import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Typography, Card, Form, Input, Button, DatePicker, message, Row, Col } from "antd";
import dayjs from "dayjs";

import { fetchSendToRtoApplications, saveBulkSendToRtoEntry, resetApplications } from "@/features/bulkSendToRtoApplication/getBulkSendToRtoApplicationSlice";
const { Title } = Typography;
const { Item } = Form;

const BulkSendtoRto = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedType = location.state;

  const [applicationDetail, setApplicationDetail] = useState(null);

  const dateInputRef = useRef(null);
  const submitBtnRef = useRef(null);

  const pageTitle = selectedType?.name || "Send To RTO";

  // reset when route changes
  useEffect(() => {
    form.resetFields();
    setApplicationDetail(null);
    dispatch(resetApplications());
  }, [location?.state]);

  // handle Enter key on File No
  const handleFileNoEnter = async () => {
    const fileNo = form.getFieldValue("fileno");
    if (!fileNo) {
      message.warning("Please enter a File No.");
      return;
    }

    try {
      const res = await dispatch(fetchSendToRtoApplications({ where: { file_number: fileNo } })).unwrap();
      if (res?.data?.length > 0) {
        const app = res.data[0]; // take first record
        setApplicationDetail(app);
        form.setFieldsValue({ date: dayjs() }); // set default date = today
        setTimeout(() => dateInputRef.current?.focus(), 300); // move focus to date field
      } else {
        message.info("No application found for this File No.");
        setApplicationDetail(null);
      }
    } catch (err) {
      message.error(err.message || "Failed to fetch application details");
      setApplicationDetail(null);
    }
  };

  // handle form submit
  const handleSubmit = async () => {
    if (!applicationDetail) {
      message.warning("No application details to submit.");
      return;
    }
    const values = form.getFieldsValue();
    const payload = {
        id: applicationDetail.id,
        data: {
          send_rto_type_id: selectedType?.id,
          process_id: applicationDetail.Process?.id,
          remark: "",
          file_movement_type: "next",
          file_movement: true,
          date: values.date?.format("YYYY-MM-DD"),
        },
      };

    try {
      const res = await dispatch(saveBulkSendToRtoEntry(payload)).unwrap();
      if (res?.result?.length > 0) {
        const successCount = res.result.filter((r) => r.success).length;
        if (successCount > 0) {
          message.success(`Application sent to RTO successfully`);
        }
      } else {
        message.success(res?.message || "Application sent to RTO successfully");
      }
      form.resetFields();
      setApplicationDetail(null);
    } catch (error) {
      message.error(error.message || "Failed to send Application to RTO");
    }
  };

  return (
    <>
      <Title level={2} className="str-blu-titl">
        {pageTitle}
      </Title>

      <Card>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {/* File No Input */}
            <Col span={8}>
              <Item name="fileno" label="File No">
                <Input
                  size="large"
                  placeholder="Enter File No"
                  onPressEnter={handleFileNoEnter}
                />
              </Item>
            </Col>
          </Row>

          {applicationDetail && (
            <>
              {/* Show fetched details */}
              <Row gutter={16}>
                <Col span={6}>
                  <Item label="Application No">
                    <Input value={applicationDetail.application_number} disabled />
                  </Item>
                </Col>
                <Col span={6}>
                  <Item label="Party Name">
                    <Input value={applicationDetail?.Party?.name || "_"} disabled />
                  </Item>
                </Col>
                <Col span={6}>
                  <Item label="Chassis No">
                    <Input value={applicationDetail?.VehicleDetail?.chassis_no || "_"} disabled />
                  </Item>
                </Col>
                <Col span={6}>
                  <Item label="Engine No">
                    <Input value={applicationDetail?.VehicleDetail?.engine_no || "_"} disabled />
                  </Item>
                </Col>
              </Row>

              {/* Date Picker */}
              <Row gutter={16}>
                <Col span={6}>
                  <Item name="date" label="Date" initialValue={dayjs()}>
                    <DatePicker
                      ref={dateInputRef}
                      size="large"
                      style={{ width: "100%" }}
                      format="DD-MM-YYYY"
                      // onPressEnter={() => submitBtnRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // stop form submit
                          document.getElementById("submit-btn")?.focus(); // move focus
                        }
                      }}
                    />
                  </Item>
                </Col>
              </Row>

              {/* Submit Button */}
              <Row>
                <Col>
                  <Button ref={submitBtnRef} type="primary" id="submit-btn" onClick={(e) => {
                      if (document.activeElement === submitBtnRef.current) {
                        // ✅ only submit if button is focused
                        handleSubmit();
                      }
                    }} size="large">
                    Submit
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Card>
    </>
  );
};

export default BulkSendtoRto;
