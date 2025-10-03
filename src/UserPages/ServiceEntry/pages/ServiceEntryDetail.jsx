import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Table, message, Checkbox, Card } from "antd";
import { fetchAllService } from "@/features/service/serviceSlice";
import { saveServiceEntry } from "@/features/application/applicationSlice";
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";

const { Item } = Form;

const ServiceEntry = ({ application, processes }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // const location = useLocation();
  // const { state } = location;
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  
  const services = useSelector((state) => state?.service?.allData || []);
  const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});

  useEffect(() => {
    dispatch(fetchAllHoldReasons());
  }, [])

  useEffect(() => {
      dispatch(fetchAllService(
          {
              where: {  
                  vehicle_type_id: application?.VehicleDetail?.VehicleType?.id, 
                  work_category_id: application?.work_category_id ? application?.work_category_id : 1 
              }
          }
      ));
  }, [application?.id]);

  // Set initial form values when application data is available
  useEffect(() => {
    form.resetFields();
    if (application?.service_ids) {
      form.setFieldsValue({ service_ids: application?.service_ids || [] });
      setSelectedServices(application?.service_ids || []);
    }
  }, [application, form]);

  const onServiceEntryApplication = async (values) => {
      try {        
          const res = await dispatch(saveServiceEntry(
            { 
              id: application?.id,
              data: {
                ...values,
                process_id: application?.Process?.id,
              },
            }
          ));
          if (res.error) {
              message.error(res.payload || 'Failed to Save application');
          } else {
              message.success(res.payload.message || "Data saved successfully");
              if (values.file_movement) {
                navigate('/home');
              }
          }
      } catch (err) {
          console.log(err);
          message.error(err.message || 'Failed to Save application');
      }
  }
  

  // File Movement handler
  const handleFileMovement = async (fileMovementData) => {
    let values = form.getFieldsValue();
    values = {
      ...values,
      ...fileMovementData
    };
    await onServiceEntryApplication(values);
  };

  const columnsowner = [
    {
      title: 'Changed By',
      dataIndex: 'changedBy',
      key: 'changedBy',
    },
    {
      title: 'Changed Data',
      dataIndex: 'changedData',
      key: 'changedData',
    },
    {
      title: 'Changed On',
      dataIndex: 'changedOn',
      key: 'changedOn',
    },
  ];

  const dataowner = [
    {
      changedBy: 'Test Dealer',
      changedData: 'MHPTR12300000234',
      changedOn: '17-06-2025 11:29 AM',
    }
  ];

  return (
    <div className="p-6 service-entry">
      {/* Top Tabs as Buttons */}
        <div className="mb-4">     
          <Form
            form={form}
            layout="vertical"
            onFinish={onServiceEntryApplication}
            autoComplete="off"
            style={{width: '100%'}}
          >
            <Card title={'Select Services'}>
              <Row gutter={[24, 24]}>
                <Col  xs={24} sm={24} md={24} lg={24}>
                  <Item name="service_ids" rules={[{ required: true, message: "Please select at least one service" }]}>
                    <Checkbox.Group
                      value={selectedServices}
                      onChange={(checkedValues) => {
                        setSelectedServices(checkedValues)
                        form.setFieldsValue({ service_ids: checkedValues });
                      }}
                      className="checkbox-group"
                      style={{ width: '100%' }}
                    >
                      <Row gutter={[24, 24]}>
                        {services?.map((val) => (
                          <Col key={val.id} xs={24} sm={12} md={6} lg={6}>
                            <Checkbox value={val.id} style={{ fontSize: '15px', fontWeight: '400'}}>{val.name}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Item>
                </Col>
              </Row>       
            </Card>
            <SaveAndFileMovement
                handleFileMovement={handleFileMovement}
                handleSaveData={form.submit}
                holdReasons={holdReasons}
                processes={processes}
                currProcessId={application?.process_id}
              />
            
            {/* <Row gutter={16} className="mb-6" style={{ justifyContent: 'center', marginTop: '2rem'}}>
              <Table 
                rowKey='key' 
                className="table" 
                columns={columnsowner} 
                dataSource={dataowner} 
                pagination={false} 
                bordered 
                style={{ width: '100%', marginTop: '1rem', margin: '1rem' }}
                scroll={{ x: 'max-content' }}
              />
            </Row> */}
          </Form>
        </div>
    </div>
  );
};

export default ServiceEntry;
