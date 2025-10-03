import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, message } from "antd";
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { fetchAllRemark } from "@/features/remark/remarkSlice";
import { saveFeedback, fetchFeedbackByAppId } from "@/features/feedback/feedbackSlice";
import { fetchAllService } from '@/features/service/serviceSlice';
import { FeedbackEntry } from '@/Components/FeedbackEntry/pages';
import { SaveAndFileMovement } from "@/Components/SaveAndFileMovement/pages";
import { FILE_MOVEMENT_TYPE } from '@/utils';
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const Feedback = ({ application, processes }) => {
  const [answers, setAnswers] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { allData: questions = [] } = useSelector((state)=> (state.remark || []));
  const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});
  const { data } = useSelector((state) => state?.feedback || {});
  const services = useSelector((state) => state?.service?.allData || []);
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(fetchAllRemark());
    dispatch(fetchAllHoldReasons());
  }, []);

  useEffect(() => {
    if (application?.id) {
      dispatch(fetchFeedbackByAppId(application.id));
    }
  }, [application?.id]);

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

  useEffect(() => {
    if (data) {
      const { remark, que_ans, date, ...rest } = data;
      let queAnsObj = {};
      que_ans?.forEach((val) => {
        queAnsObj = { ...queAnsObj, [val.que_id]: val.ans ? 'yes' : 'no' };
      });
      setAnswers(queAnsObj);
      form.setFieldsValue({ ...rest, feedback: remark, date: date && dayjs(date) });
    }
  }, [data]);

  const onSaveFeedback = async (values) => {
    const ques = [];
    _.forIn(answers, (value, key) => {
      ques.push({ que_id: parseInt(key), ans: value === 'yes' });
    });
    const data = { ...values, que_ans: ques, process_id: application?.Process?.id };
    console.log('<<On finish--', values, answers, data);
      try {        
          const res = await dispatch(saveFeedback(
            { 
              id: application?.id,
              data,
            }
          ));
          if (res.error) {
              message.error(res.payload || 'Failed to save feedback');
          } else {
              message.success(res.payload.message || "feedback saved successfully");
              if (values.file_movement) {
                navigate('/home');
              }
          }
      } catch (err) {
          console.log(err);
          message.error(err.message || 'Failed to Save feedback');
      }
    }

  // File Movement handler
  const handleFileMovement = async (fileMovementData, closeDialog) => {
    if (fileMovementData.file_movement_type === FILE_MOVEMENT_TYPE.NEXT) {
      form.validateFields().then(async (res) => {
        const values = {
          ...res,
          ...fileMovementData
        };
        await onSaveFeedback(values);
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
      await onSaveFeedback(values);
      closeDialog && closeDialog();
    }
  };

  return (
    <div className="feedback">
      <Form form={form} onFinish={onSaveFeedback} layout="vertical">
        <FeedbackEntry form={form} application={application} services={services} questions={questions} answers={answers} setAnswers={setAnswers}/>
        <SaveAndFileMovement 
          handleSaveData={form.submit}
          handleFileMovement={handleFileMovement}
          processes={processes}
          holdReasons={holdReasons}
          currProcessId={application?.process_id}
        />
      </Form>
    </div>
  )
};