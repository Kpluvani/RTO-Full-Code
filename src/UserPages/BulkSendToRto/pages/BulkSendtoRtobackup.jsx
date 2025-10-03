import React from 'react'
import { fetchSendToRtoApplications, saveBulkSendToRtoEntry, resetApplications } from '@/features/bulkSendToRtoApplication/getBulkSendToRtoApplicationSlice';
import { fetchAllBrokers } from '@/features/broker/brokerSlice';
import { fetchAllDealer } from '@/features/dealer/dealerSlice';
import { fetchAllParty } from '@/features/party/partySlice';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import '../styles/bulkSendtoRto.css';

import { Typography, Card, Col, Row, Form, Table, Input, Flex, Button, Select, Checkbox, message} from 'antd';
const { Title } = Typography;
const { Item } = Form;

const BulkSendtoRto = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch ();
  const location = useLocation();
  const selectedType = location.state;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const pageTitle = selectedType?.name || "Send To RTO";
  
  useEffect(() => {
    form.resetFields();
    dispatch(resetApplications()) ;
  }, [location?.state]);

  const { allData : broker = [] } = useSelector((state)=>state.broker || {});
  const { allData : dealer = [] } = useSelector((state)=>state.dealer || {});
  const { allData : party = [] } = useSelector((state)=>state.party || {});
  const { data : applicationData = []} = useSelector((state)=>state.bulkSendToRtoApplication || {});

  useEffect(() => {
    dispatch(fetchAllBrokers());
    dispatch(fetchAllDealer());
    dispatch(fetchAllParty());
  }, [dispatch]);

  const partyOptions = party.map((item) => ({ value: item.id, label: item.name }));
  const brokerOptions = broker.map((item) => ({ value: item.id, label: item.name}));
  const dealerOptions = dealer.map((item) => ({ value: item.id, label: item.name}));

  const handleInputChange = (value, name, key = '', type = 'alphanumeric') => {
    let cleanValue = value
    if (type === 'numeric') { cleanValue = value.replace(/[^0-9]/g, '')
    } else if (type === 'alphanumeric') {
      cleanValue = value.replace(/[^a-zA-Z0-9\s]/g, '')
    } else if (type === 'uppercase') {
      cleanValue = value?.toUpperCase();
    }
    form.setFieldValue(name, cleanValue)
  };

  const handleSearch = (triggeredByUser = true) =>{
    const values = form.getFieldsValue()
    const where = {}
    if (values.fileno) where.file_number = values.fileno;
    if (values.vehicleno) where.vehicle_no = values.vehicleno;
    if (values.chassisno) where.chassis_no = values.chassisno;
    if (values.party) where.party_id = values.party;
    if (values.dealer) where.dealer_id = values.dealer;
    if (values.broker) where.broker_id = values.broker;
    if (Object.keys(where).length === 0) {
      if (triggeredByUser) message.warning('Please enter a search field');
      return
    }

    dispatch(fetchSendToRtoApplications({ where })).unwrap().then(res => {
      setSelectedRows([]);
      setSelectAll(false);
      if (triggeredByUser && (!res || !res.data || (res?.data?.length || 0) === 0)) {
        message.info(res?.message || 'No applications found.');
      }
    })
    .catch(err => {
      if (triggeredByUser) message.error(err.message || 'Failed to fetch applications');
    })
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
        setSelectedRows(data.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (index) => (e) => {
    const checked = e.target.checked;
    const newSelectedRows = checked ? [...selectedRows, index] : selectedRows.filter(i => i !== index);
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
  };

  const handleSendToRto = async() => {
    if (selectedRows.length === 0) {
      message.warning(' please select a Application to send');
      return;
    }
    const selectedApplication = selectedRows.map(index => applicationData[index]);
    const payload = selectedApplication.map(app => ({
      id: app.id,
      data: {
        send_rto_type_id: selectedType?.id,
        process_id: app.Process?.id,
        remark: '',
        file_movement_type: "next",
      }
    }));
    try {
      const res = await dispatch(saveBulkSendToRtoEntry(payload)).unwrap();
      if (res?.result?.length > 0) {
        const successCount = res.result.filter(r => r.success).length;
        const failCount = res.result.length - successCount;
        if (successCount > 0) {
          message.success(`${successCount} Application moved successfully`);
        }
        if (failCount > 0) {
          message.error(`${failCount} Application failed to move`);
        }
      } else {
        message.success(res?.message || 'Applications sent to RTO successfully');
      }
      handleSearch(false);
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || 'Failed to send Application to rto');
    }
  };

  const data = applicationData.map((item, index) => ({
    key: item.id,
    srno: index + 1,
    appno: item.application_number || '_',
    pname: item?.Party?.name || '_',
    chano: item?.VehicleDetail?.chassis_no || '_',
    engno: item?.VehicleDetail?.engine_no || '_',
    class: item?.VehicleDetail?.VehicleClass?.name || '_',
    // smc: item?.smc || '_',
    // addprf: item?.address_proof || '_',
    vehlno: item?.VehicleDetail?.vehicle_no || '_',
  }));

  console.log('application data>>>', applicationData);
  

  const columns = [
    { title: 'SR No', dataIndex: 'srno', key: 'srno', width:'6%', align: 'start', },
    { title: 'Application No', dataIndex: 'appno', key: 'appno', width:'14%', align: 'start', },
    { title: "Party's Name", dataIndex: 'pname', key: 'pname', width:'', align: 'start', },
    { title: 'Chassis No', dataIndex: 'chano', key: 'chano', width:'', align: 'start', },
    { title: 'Engine No', dataIndex: 'engno', key: 'engno', width:'', align: 'start', },
    { title: 'Class', dataIndex: 'class', key: 'class', width:'', align: 'start', },
    // { title: 'SMC', dataIndex: 'smc', key: 'smc', width:'', align: 'start', },
    // { title: 'Address Proof', dataIndex: 'addprf', key: 'addprf', width:'', align: 'start', },
    { title: 'Vehicle No', dataIndex: 'vehlno', key: 'vehlno', width:'', align: 'start', },
    { title: ( <>
      <Checkbox checked={selectAll} onChange={handleSelectAllChange} style={{ marginRight:'8px'}} /> 
        Action&nbsp;
      </>),
      dataIndex:'actn',
      key:'actn',
      width:'',
      align:'start',
      render: (text, record, index ) => (
        <Checkbox
          checked={selectedRows.includes(index)}
          onChange={handleCheckboxChange(index)}
        />
      )
    },
  ];


  return (
  <>
    <Title level={2} className='str-blu-titl'>{pageTitle}</Title>

    <Card>
      <Title level={3} className='str-blu-titl'>Send To RTO</Title>
      <Form form={form}>
        <Row gutter={[16,32]}>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="fileno" label="File No" 
              rules={[{ pattern: /^[a-zA-Z0-9\-]+$/, message: 'enter valid file no' }]}>
              <Input size='large' placeholder='Enter file No'
                value={form.getFieldValue('fileno')}
                onChange={(e) => handleInputChange(e.target.value, 'fileno', '' ,'alphanumeric') } />   
            </Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="vehicleno" label="Vehicle No" 
              rules={[
                { required: true, message: 'Please enter vehicle no' },
                { pattern: /^[a-zA-Z0-9\-]+$/, message: 'Enter valid vehicle no'}]}>
              <Input size='large' placeholder='Enter vehicle No' 
                value={form.getFieldValue('vehicleno')}
                onChange={(e) => handleInputChange(e.target.value, 'vehicleno', '', 'uppercase')} />  
            </Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="chassisno" label="Chassis No" 
              rules={[
                { required: true, message: 'Please enter chassis no' },
                { pattern: /^[a-zA-Z0-9]+$/, message: 'Enter valid chassis no'}]}>
              <Input size='large' placeholder='Enter chassis No'
                value={form.getFieldValue('chassisno')}
                onChange={(e) => handleInputChange(e.target.value, 'chassisno', '', 'uppercase')} />
            </Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="party" label="Party">
              <Select size='large' placeholder='Select party' options={partyOptions} allowClear />
            </Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="dealer" label="Dealer">
              <Select size='large' placeholder='Select dealer' options={dealerOptions} allowClear />
            </Item>
          </Col>

          <Col lg={8} md={12} sm={24} xs={24}>
            <Item layout='vertical' name="broker" label="Broker">
              <Select size='large' placeholder='Select broker' options={brokerOptions} allowClear />  
            </Item>
          </Col>

        </Row>

        <Flex className='str-srhc-btn' horizontal justify='center'>
          <Button className='srt-blu-srhc-btn' size='large' type='primary' onClick={handleSearch} >Search</Button>
        </Flex>

      </Form>
    </Card>

    <div className="H2-heading"><Title level={2} className='str-blu-titl'>Result</Title></div>

    <Table style={{width:'100%'}} columns={columns} dataSource={data} pagination={false} bordered scroll={{ x: 'max-content' }} />

    <Flex className='str-str-btn' horizontal justify='center'>
      <Button className='str-blu-str-btn' size='large' type='primary' onClick={handleSendToRto} >Send To RTO</Button>
    </Flex>
  </>
  )
}

export default BulkSendtoRto;