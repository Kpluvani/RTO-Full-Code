import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Row, Col, Form, Button, Dropdown, Menu, Table, message, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
// import '../App.css';
import { LuSave } from "react-icons/lu";
import { RiArrowGoBackFill } from "react-icons/ri";
import { BiTransferAlt } from "react-icons/bi";
import { BiHomeCircle } from "react-icons/bi";
import { fetchAllService } from "@/features/service/serviceSlice";
import { saveServiceEntry } from "@/features/application/applicationSlice";

const { Item } = Form;

const ServiceApproval = ({ application }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { state } = location;
  const [selectedServices, setSelectedServices] = useState([]);
  const [isReadonly, setIsReadonly] = useState(true); 
  
  const services = useSelector((state) => state?.service?.allData || []);

  useEffect(() => {
      dispatch(fetchAllService(
          {
              where: {  
                  vehicle_type_id: state?.VehicleDetail?.VehicleType?.id, 
                  work_category_id: state?.work_category_id ? state?.work_category_id : 1 
              }
          }
      ));
  }, [state?.applicationId]);

  // Set initial form values when application data is available
  useEffect(() => {
    form.resetFields();
    // Assuming service_ids is an array of service IDs that should be checked
    if (application?.service_ids) {
      form.setFieldsValue({ service_ids: application?.service_ids || [] });
      setSelectedServices(application?.service_ids || []);
    }
    // form.setFieldsValue({ service_ids: [11, 10, 6] });
    // setSelectedServices([11, 10, 6]);
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
              message.success("Data saved successfully");
          }
      } catch (err) {
          console.log(err);
          message.error(err.message || 'Failed to Save application');
      }
  }
  
   
  // Save button submit handler
  // const onFinish = (values) => {
  //   try {
  //     console.log(values);
  //     message.success("Data saved successfully");
  //   } catch (error){
  //     console.log(error);
  //     message.error("please fill all required fields")
  //   }
  // };

  // File Movement handler (does not submit form)
  const handleFileMovement = () => {
    message.info("File Movement clicked");
    // You can add your file movement logic here
  };
  
  const menu = (
    <Menu>
      <Menu.Item 
        key="file-movement" 
        onClick={handleFileMovement}
        icon={<BiTransferAlt style={{ fontSize: '1.2rem' }} />}
        style={{fontSize:'1rem'}}
      >
        File Movement
      </Menu.Item>
    
      {/* <Menu.Item 
        key="save" 
        onClick={() => form?.submit()}
        icon={<LuSave style={{ fontSize: '1.2rem' }} />}
        style={{fontSize:'1rem'}}
      >
        Save
      </Menu.Item> */}
    
      <Menu.Divider />
    
      <Menu.Item 
        key="home" 
        icon={<BiHomeCircle style={{ fontSize: '1.2rem' }} />}
        style={{fontSize:'1rem'}}
      >
        Home Page
      </Menu.Item>
  </Menu>
  );

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
    <div className="p-6" style={{marginTop: '2rem'}}>
      {/* Top Tabs as Buttons */}
        <div className="mb-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onServiceEntryApplication}
          autoComplete="off"
          style={{width: '100%'}}
        >
          <Row gutter={[24, 24]}>
            <Col  xs={24} sm={24} md={24} lg={24}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "700", fontSize: '17px' }}>Select Services</label>
              <Item
                // label="Select Service"
                name="service_ids"
                rules={[{ required: true, message: "Please select at least one service" }]}
              >
            <Checkbox.Group
                value={selectedServices}
                onChange={(checkedValues) => {
                  if (!isReadonly) {
                    setSelectedServices(checkedValues);
                    form.setFieldsValue({ service_ids: checkedValues });
                  }
                }}
                className="checkbox-group"
                style={{ width: '100%' }}
              >
                <Row gutter={[24, 24]}>
                  {services?.map((val) => (
                    <Col key={val.id} xs={24} sm={12} md={6} lg={6}>
                      <div
                        onClick={(e) => isReadonly && e.stopPropagation()}
                        onMouseDown={(e) => isReadonly && e.preventDefault()}
                      >
                        <Checkbox
                          value={val.id}
                          style={{ fontSize: '15px', fontWeight: '400', pointerEvents: isReadonly ? 'none' : 'auto' }}
                        >
                          {val.name}
                        </Checkbox>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>

              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mb-6" style={{ justifyContent: 'center', marginTop: '2rem'}}>
            <Col >
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="primary" className="save-button" style={{width: '100%'}}>
                  <LuSave style={{fontSize: '1rem'}}/> Save & File Movement <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
            <Col>
              <Button className="back-button" type="primary"><RiArrowGoBackFill style={{fontSize: '1rem'}} /> Back</Button>
            </Col>
          </Row>
          
          <Row gutter={16} className="mb-6" style={{ justifyContent: 'center', marginTop: '2rem'}}>
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
          </Row>
        </Form>
        </div>
    </div>
  );
};

export default ServiceApproval;
