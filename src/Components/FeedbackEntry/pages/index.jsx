import React from "react";
import { Card, Row, Col, Form, Radio, DatePicker, Rate, Flex } from "antd";
import TextArea from '@/CustomComponents/CapitalizedTextArea';
import "../styles/feedback.css";

const { Item } = Form;

export const FeedbackEntry = ({ form, application, services = [], questions = [], answers = {}, setAnswers, isReadOnly = false }) => {

  const onChangeQuestions = (value, queId) => {
    setAnswers((prevVal) => {
      return ({ ...prevVal, [queId]: value });
    });
  }

  const getAddress = (addr) => {
    const getAdr = (val) => (val?.trim() ? `${val?.trim()}, ` : '')
    return (`${getAdr(addr?.house_no)}${getAdr(addr?.landmark)}${getAdr(addr?.city)}${getAdr(addr?.District?.name)}${getAdr(addr?.State?.name)}${addr?.pincode || ''}`);
  }
  const getServices = (ids = []) => {
    const nameArray = (ids || []).map((id) => (services.find((val) => parseInt(val.id) === parseInt(id))?.name)).filter(data => data);
    return nameArray.join(', ');
  }

  return(
    <div className="feedback-entry">
        <Card className="labels" title={'Remarks'}>
          <Row gutter={16}>
            <Col xs={32} sm={16} md={14} lg={12}>
              <Item label='Address :' className="address-wrapper">
                  <Flex gap={'small'}>
                    <div className="adr-label">Current Address:</div>
                    <div>{getAddress(application?.CurrentAddress)}</div>
                  </Flex>
                  <Flex gap={'small'}>
                    <div className="adr-label">Permenant Address:</div>
                   <div>{getAddress(application?.PermanentAddress)}</div>
                  </Flex>
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={32} sm={16} md={14} lg={12}>
              <Item label='Mobile No.' layout="horizontal" className="bottom-0">
                <div>{application?.OwnerDetail?.mobile_number || ''}</div>
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={32} sm={16} md={14} lg={12}>
              <Item label='Services' layout="horizontal" className="bottom-0">
                <div>{getServices(application?.service_ids)}</div>
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={32} sm={16} md={14} lg={12}>
              <Item label='RTO' layout="horizontal">
                <div>{application?.Rto?.name || ''}</div>
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
              <Col xs={32} sm={16} md={14} lg={12}>
                <Item label='Date' name='date' rules={[{ required:true, message:"Select date" }]}>
                    <DatePicker placeholder="dd-mm-yyyy" disabled={isReadOnly} />
                </Item>
              </Col>
          </Row>
          <Row gutter={16}>
              <Col xs={32} sm={16} md={14} lg={12}>
                <Item label='Rating' name='rating' rules={[{ required: true, message:"Select Rating" }]}>
                    <Rate className="rate" disabled={isReadOnly}/>
                </Item>
              </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={32} sm={16} md={14} lg={12}>
              {questions.map((val, index) => (
                <div key={val.id} className="question-wrapper">
                  <div className="question">
                    {`${index + 1}.  ${val.name}`}
                  </div>
                  <Radio.Group value={answers[val.id]} onChange={(e) => onChangeQuestions(e.target.value, val.id)}>
                    <Radio value="yes" disabled={isReadOnly}>Yes</Radio>
                    <Radio value="no" disabled={isReadOnly}>No</Radio>
                  </Radio.Group>
                </div>
              ))}
            </Col>
          </Row>

          <Row gutter={16} className="remark">
              <Col xs={46} sm={28} md={26} lg={24}>
                <Item
                  label='Remark'
                  name="feedback"
                  rules={[{ required: true , message: 'Please Enter Remark' }]}
                >
                    <TextArea rows={5} placeholder="Enter Your Renark"  disabled={isReadOnly} />
                </Item>
              </Col>
          </Row>
        </Card>
    </div>
  );
}
