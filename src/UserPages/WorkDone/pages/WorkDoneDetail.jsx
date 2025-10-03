import React, { useEffect, useState } from "react";
import { Col, Card, Form, Row, Button, message, Typography, Table, Upload } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Input from '@/CustomComponents/CapitalizedInput';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllService } from "@/features/service/serviceSlice";
import { saveWorkDoneUpload } from "@/features/application/applicationSlice";
import { FILE_MOVEMENT_TYPE } from '@/utils';
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import dayjs from "dayjs";
import axiosInstance from '@/config/axiosConfig';


const WorkDoneDetail = ({ application, processes }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { state } = location;
  // const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filesByService, setFilesByService] = useState({});

  const services = useSelector((state) => state?.service?.allData || []);
  const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});

  useEffect(() => {
    dispatch(fetchAllHoldReasons());
  }, [dispatch])

  useEffect(() => {
      dispatch(fetchAllService(
          {
              where: {  
                  vehicle_type_id: state?.VehicleDetail?.VehicleType?.id, 
                  work_category_id: state?.work_category_id ? state?.work_category_id : 1 
              }
          }
      ));
  }, [dispatch, state?.applicationId, state?.VehicleDetail?.VehicleType?.id, state?.work_category_id]);

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockServicesData = services;
        const mockApplicationData = application?.service_ids || [];
        const selectedServices = services
          .filter(svc => application?.service_ids?.includes(svc.id))
          .filter(svc => svc?.is_show_work_done);

        const existingWorkDones = application?.workDones || application?.work_dones || [];

        const workDoneData = selectedServices.map((svc, index) => {
          const existing = existingWorkDones.find(wd => wd?.service_id === svc.id);
          return {
            key: index + 1,
            sr_no: index + 1,
            app_date: dayjs(application?.application_date).format('DD/MM/YYYY') || '',
            rg_no: application?.VehicleDetail?.vehicle_no || '',
            remark: existing?.remark || '',
            service: svc.name,
            status: existing?.document_path 
              ? <CheckCircleFilled style={{ fontSize: '1.5rem', color: '#28a745' }} />
              : '',
            action: null
          };
        });
        setDataSource(workDoneData);
      } catch {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [application, services]);


  const handleRemarkChange = (key, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      newData[index].remark = value;
      setDataSource(newData);
    }
  };

  const handleSave = async () => {
    try {
      const work_done = dataSource.map((row) => ({
        service_id: services.find(s => s.name === row.service)?.id,
        remark: row.remark || '',
        purpose: row.purpose || null,
        status: 'completed',
      })).filter(Boolean);

      // Build files map keyed by service_id
      const files = {};
      Object.entries(filesByService).forEach(([serviceId, file]) => {
        if (file) files[serviceId] = file;
      });

      const data = {
        work_done,
        process_id: application?.Process?.id,
        file_number: application?.file_number,
      };

      const resp = await dispatch(saveWorkDoneUpload({ id: application?.id, data, files }));
      if (resp.error) {
        message.error(resp.payload || 'Failed to save Work Done');
      } else {
        message.success(resp.payload?.message || 'Work Done saved');
      }
    } catch (e) {
      message.error(e.message || 'Failed to save');
    }
  };

  const uploadProps = (serviceId) => ({
    multiple: false,
    beforeUpload: (file) => {
      setFilesByService(prev => ({ ...prev, [serviceId]: file }));
      message.success('File selected. It will be uploaded on Save.');
      return false; // prevent auto upload
    },
    onRemove: () => {
      setFilesByService(prev => {
        const copy = { ...prev };
        delete copy[serviceId];
        return copy;
      });
    },
    fileList: filesByService[serviceId] ? [filesByService[serviceId]] : [],
  });

  const handleShowDocument = (serviceId) => {
    const selectedFile = filesByService[serviceId];
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
      return;
    }
    const existingWorkDones = application?.workDones || application?.work_dones || [];
    const found = existingWorkDones.find(wd => wd?.service_id === serviceId && wd?.document_path);
    if (found?.document_path) {
      const apiBase = axiosInstance.getUri() || 'http://localhost:5000/api';
      let origin;
      try {
        origin = new URL(apiBase).origin;
      } catch {
        origin = apiBase.replace(/\/api$/, '');
      }
      const path = found.document_path.startsWith('/') ? found.document_path : `/${found.document_path}`;
      const href = `${origin}${path}`;
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      message.info('No document available to show.');
    }
  };

  const columns = [
    {
      title: 'SR No',
      dataIndex: 'sr_no',
      key: 'sr_no',
      align: 'start',
      width: 80,
    },
    {
      title: 'Application Date',
      dataIndex: 'app_date',
      key: 'app_date',
      align: 'start',
    },
    {
      title: 'Registration No',
      dataIndex: 'rg_no',
      key: 'rg_no',
      align: 'start',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      width:'15%',
      align: 'start',
      render: (_, record) => (
        <Input 
        tabIndex={1} 
          value={record.remark}
          onChange={(e) => handleRemarkChange(record.key, e.target.value)}
          placeholder="Edit remark"
          style={{ width: '100%', borderRadius: '5px' }}
        />
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      align: 'start',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'start',
      width:'12%',
      render: (_, record) => {
        const serviceId = services.find(s => s.name === record.service)?.id;
        const hasSelectedFile = Boolean(filesByService[serviceId]);
        const existingWorkDones = application?.workDones || application?.work_dones || [];
        const hasUploadedDoc = existingWorkDones.some(wd => wd?.service_id === serviceId && wd?.document_path);
        const canShow = hasSelectedFile || hasUploadedDoc;
        if (canShow) {
          return (
            <Button type="primary" onClick={() => handleShowDocument(serviceId)}>Show</Button>
          );
        }
        return (
          <Upload {...uploadProps(serviceId)}>
            <Button type="primary">Upload Document</Button>
          </Upload>
        );
      },
    }
  ];

  // Handle form submission
  const onFinish = async () => {
    try {
      await handleSave();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // File Movement handler
  const handleFileMovement = async (fileMovementData, closeDialog) => {
    if (fileMovementData.file_movement_type === FILE_MOVEMENT_TYPE.NEXT) {
     // check registration number requirement
      if (!application?.VehicleDetail?.registration_no) {
        message.error("Registration number is required before moving to next process");
        closeDialog && closeDialog();
        return;
     }
      form.validateFields().then(async (res) => {
        const work_done = dataSource.map((row) => ({
          service_id: services.find(s => s.name === row.service)?.id,
          remark: row.remark || '',
          purpose: row.purpose || null,
          status: 'completed',
        })).filter(Boolean);

        // Build files map keyed by service_id
        const files = {};
        Object.entries(filesByService).forEach(([serviceId, file]) => {
          if (file) files[serviceId] = file;
        });

        const data = {
          work_done,
          process_id: application?.Process?.id,
          file_number: application?.file_number,
          ...fileMovementData
        };

        const result = await dispatch(saveWorkDoneUpload({ id: application?.id, data, files }));
        
        if (result.error) {
            message.error(result.payload || 'Failed to save data');
        } else {
          message.success(result.payload.message || 'Data saved successfully');
          
          if (data.file_movement) {
            navigate('/home');
          }
        }
        closeDialog && closeDialog();
      }).catch((e) => {
        console.log('Validation failed:', e);
        onFinishFailed(e);
        closeDialog && closeDialog();
      })
    } else {
      const work_done = dataSource.map((row) => ({
          service_id: services.find(s => s.name === row.service)?.id,
          remark: row.remark || '',
          purpose: row.purpose || null,
          status: 'completed',
        })).filter(Boolean);

        // Build files map keyed by service_id
        const files = {};
        Object.entries(filesByService).forEach(([serviceId, file]) => {
          if (file) files[serviceId] = file;
        });

        const data = {
          work_done,
          process_id: application?.Process?.id,
          file_number: application?.file_number,
          ...fileMovementData
        };

        const result = await dispatch(saveWorkDoneUpload({ id: application?.id, data, files }));
        
        if (result.error) {
            message.error(result.payload || 'Failed to save data');
        } else {
          message.success(result.payload.message || 'Data saved successfully');
          
          if (data.file_movement) {
            navigate('/home');
          }
        }
      closeDialog && closeDialog();
    }
  };

  const onFinishFailed = (errorInfo) => {
      console.log('Form validation failed:', errorInfo);
      message.error('Please fill in all required fields');
  };


  return (
    <Card style={{ marginTop: "2rem" }}>
      <Typography style={{ fontSize: '1.5rem', color: '#2259e3' }}>Work Done</Typography>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{width: '100%'}}
        >
          <Table
            style={{ marginTop: '1rem' }}
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            size="middle"
            loading={loading}
          />

          <Row justify="center" style={{ display: 'flex', flexDirection: 'row', marginTop: "1rem" }} gutter={16}>
            <Col>
                <SaveAndFileMovement
                  handleFileMovement={handleFileMovement}
                  handleSaveData={form.submit}
                  holdReasons={holdReasons}
                  processes={processes}
                  currProcessId={application?.process_id}
                />
            </Col>
          </Row>
        </Form>
    </Card>
  );
};

export default WorkDoneDetail;
