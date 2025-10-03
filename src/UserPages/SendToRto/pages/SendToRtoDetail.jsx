import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, message, Card, Select, Typography } from "antd";
import { saveSendToRTOEntry } from "@/features/application/applicationSlice";
import { SaveAndFileMovement } from "@/Components/SaveAndFileMovement/pages";
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { fetchAllSendRtoType } from "@/features/sendRtoType/sendRtoTypeSlice";
import { FILE_MOVEMENT_TYPE } from '@/utils';

const { Item } = Form;
const { Title } = Typography;

const SendToRtoDetail = ({ application, processes }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { allData: holdReasons = [] } = useSelector(
    (state) => state?.holdReason || {}
  );
  const { allData : SendToRtoTypes = [] }= useSelector((state)=>state.sendRtoType || {});

  useEffect(() => {
    dispatch(fetchAllSendRtoType());
    dispatch(fetchAllHoldReasons());
  }, []);

useEffect(()=>{
    if(application?.id){
      form.setFieldsValue({
        ...application,
        send_rto_type_id:application?.SendRtoType?.id,
      });
    }
  })

  // Set initial form values when application data is available

  const onServiceEntryApplication = async (values) => {
    try {
      const res = await dispatch(
        saveSendToRTOEntry({
          id: application?.id,
          data: {
            ...values,
            process_id: application?.process_id,
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
        await onServiceEntryApplication(values);
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
      await onServiceEntryApplication(values);
      closeDialog && closeDialog();
    }
  };

  return(
        <Form form={form} onFinish={onServiceEntryApplication} className="form-wrapper">
            <Card className={'form-card'}>
              <Title level={4} className={'title'}>
                {application?.Process?.name}
              </Title>

              <Row gutter={16}>
                <Col className="w-full">
                  <Item name="send_rto_type_id" initialValue="Select" rules={[{ required: true, message: 'Select send to RTO!'}]}>
                    <Select
                      placeholder="Select"
                      options={SendToRtoTypes.map((val)=>({ value:val.id , label:val.name }))}
                      showSearch={true}
                      filterOption={(input, option) =>
                          option.label?.toLowerCase()?.includes(input?.toLowerCase())
                      }
                    />
                  </Item>
                </Col>
              </Row>
            </Card>
            <SaveAndFileMovement 
              handleSaveData={form.submit}
              handleFileMovement={handleFileMovement}
              processes={processes}
              holdReasons={holdReasons}
              currProcessId={application?.process_id}
            />
        </Form>
    );
};

export default SendToRtoDetail;
 