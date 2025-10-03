import {
  Typography,
  Button,
  Row,
  Col,
  Table,
  Space,
  Tabs,
  Form,
  Spin
} from "antd";
import { RiArrowGoBackFill } from "react-icons/ri";
import { fetchAllService } from "../../../features/service/serviceSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OwnerDetails } from "@/Components/OwnerDetails/pages";
import { VehicalDetails } from "@/Components/VehicalDetails/pages";
import { DocumentsValidity } from "@/Components/DocumentsValidity/pages";
import dayjs from "dayjs";
import { fetchApplicationById, setApplicationId } from '@/features/application/applicationSlice';
import DocumentUpload from "@/UserPages/DocumentUpload/pages/DocumentUpload";
import { fetchAllMaker } from '@/features/maker/makerSlice';
import { fetchAllMakerModel } from '@/features/MakerModel/MakerModelSlice';
import { fetchAllDealer } from '@/features/dealer/dealerSlice';
import { fetchAllParty } from '@/features/party/partySlice';
import { fetchAllBrokers } from '@/features/broker/brokerSlice';
import { fetchAllVehicalType } from '@/features/vehicalType/vehicalTypeSlice';
import { fetchAllVehicalClasses } from '@/features/vehicalClass/vehicalClassSlice';
import { fetchAllFuel } from '@/features/fuel/fuelSlice';
import { fetchAllNom } from '@/features/nom/nomSlice';
import { fetchAllVehicalBodyTypes } from "@/features/vehicalBodyType/vehicalBodyTypeSlice";
import { fetchAllOwnerCategories } from '@/features/ownerCategory/ownerCategorySlice';
import { fetchAllVehicalCategories } from '@/features/vehicalCategory/vehicalCategorySlice';
import { fetchAllRtos } from '@/features/rto/rtoSlice';
import { fetchAllRegistrationTypes } from '@/features/registrationType/registrationTypeSlice';
import { fetchAllOwnershipTypes } from '@/features/ownershipType/ownershipTypeSlice';
import { fetchAllStates } from '@/features/state/stateSlice';
import { fetchAllDistricts } from '@/features/district/districtSlice';
import { fetchAllPurchaseAses } from '@/features/purchaseAs/purchaseAsSlice';
import { fetchAllInsuranceTypes } from "@/features/insuranceType/insuranceTypeSlice";
import { fetchAllInsuranceCompanies } from "@/features/insuranceCompany/insuranceCompanySlice";
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import { fetchAllDocumentTypes } from "@/features/documentType/documentTypeSlice";
import { fetchAllRemark } from "@/features/remark/remarkSlice";
import { fetchFeedbackByAppId } from "@/features/feedback/feedbackSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { convertUTCToIST, NO, YES, } from "@/utils";
import '../styles/registerapplication.css';
import { FeedbackEntry } from "@/Components/FeedbackEntry/pages";
import FormPages from "@/UserPages/FormPages/pages";
import Form18 from "@/UserPages/FormPages/pages/Form18";
import Form19 from "@/UserPages/FormPages/pages/Form19";
import FormAB from "@/UserPages/FormPages/pages/FormAB";
import Form68 from "@/UserPages/FormPages/pages/Form68";
import Form67 from "@/UserPages/FormPages/pages/Form67";
import Form66 from "@/UserPages/FormPages/pages/Form66";
import Form65 from "@/UserPages/FormPages/pages/Form65";
import Form20 from "@/UserPages/FormPages/pages/Form20";
import Form20B from "@/UserPages/FormPages/pages/Form20B";
import Form21 from "@/UserPages/FormPages/pages/Form21";
import Form22 from "@/UserPages/FormPages/pages/Form22";
import Form22A from "@/UserPages/FormPages/pages/Form22A";
import Form22B from "@/UserPages/FormPages/pages/Form22B";
import Form22C from "@/UserPages/FormPages/pages/Form22C";
import Form22D from "@/UserPages/FormPages/pages/Form22d";

const { Title, Text } = Typography;

const RegisteredVehicalDetailsPage = () => {
  const [answers, setAnswers] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { state } = useLocation();
  const { currApplication, loading } = useSelector((state) => state.application || {});

  // const services = useSelector((state) => state?.service?.allData || []);
  const { allData: Questions = [] } = useSelector((state) => state.remark || []);
  const { allData: makers = [] } = useSelector((state) => state?.maker || {});
  const { allData: makerModels = [] } = useSelector((state) => state?.makerModel || {});
  const { allData: dealers = [] } = useSelector((state) => state?.dealer || {});
  const { allData: partys = [] } = useSelector((state) => state?.party || {});
  const { allData: brokers = [] } = useSelector((state) => state?.broker || {});
  const { allData: vehicleTypes = [] } = useSelector((state) => state?.vehicalType || {});
  const { allData: vehicleClasses = [] } = useSelector((state) => state?.vehicalClass || {});
  const { allData: noms = [] } = useSelector((state) => state?.nom || {});
  const { allData: vehicalBodyTypes = [] } = useSelector((state) => state?.vehicalBodyType || {});

  const { allData: rtos = [] } = useSelector((state) => state?.rto || {});
  const { allData: registrationTypes = [] } = useSelector((state) => state?.registrationType || {});
  const { allData: ownershipTypes = [] } = useSelector((state) => state?.ownershipType || {});
  const { allData: states = [] } = useSelector((state) => state?.state || {});
  const { allData: districts = [] } = useSelector((state) => state?.district || {});
  const { allData: vehicleCategories = [] } = useSelector((state) => state?.vehicleCategory || {});
  const { allData: fuels = [] } = useSelector((state) => state?.fuel || {});
  const { allData: ownerCategories = [] } = useSelector((state) => state?.ownerCategory || {});
  const { allData: purchaseAs = [] } = useSelector((state) => state?.purchaseAs || {});
  const { allData: insuranceTypes = [] } = useSelector((state) => state?.insuranceType || {});
  const { allData: insuranceCompanies = [] } = useSelector((state) => state?.insuranceCompany || {});
  const { allData: documentTypes = [] } = useSelector(state => state?.documentType || {});
  const { data: feedbackData } = useSelector((state) => state?.feedback || {});

  const isReadOnly = true;

  useEffect(() => {
    dispatch(fetchAllService());
    dispatch(fetchAllRemark());
    dispatch(fetchAllMaker());
    dispatch(fetchAllMakerModel());
    dispatch(fetchAllDealer());
    dispatch(fetchAllParty());
    dispatch(fetchAllBrokers());
    dispatch(fetchAllVehicalType());
    dispatch(fetchAllVehicalClasses());
    dispatch(fetchAllFuel());
    dispatch(fetchAllNom());
    dispatch(fetchAllVehicalBodyTypes());
    dispatch(fetchAllRtos());
    dispatch(fetchAllRegistrationTypes());
    dispatch(fetchAllOwnershipTypes());
    dispatch(fetchAllOwnerCategories());
    dispatch(fetchAllStates());
    dispatch(fetchAllDistricts());
    dispatch(fetchAllVehicalCategories());
    dispatch(fetchAllPurchaseAses());
    dispatch(fetchAllInsuranceCompanies());
    dispatch(fetchAllInsuranceTypes());
    dispatch(fetchAllHoldReasons());
    dispatch(fetchAllDocumentTypes());

    return () => {
      // clearData()
    }
  }, []);

  useEffect(() => {
      if (state?.applicationId) {
          setApplicationId(state?.applicationId);
          dispatch(fetchApplicationById(state?.applicationId));
          dispatch(fetchFeedbackByAppId(state?.applicationId));
      }
  }, [state?.applicationId]);

  useEffect(() => {
    if (currApplication?.id) {
      const questionMap = {};
      if (currApplication.Feedback?.answers?.length) {
        currApplication.Feedback.answers.forEach((ans) => {
          const matchedQuestion = Questions.find((q) => q.name === ans.question);
          if (matchedQuestion) {
            questionMap[matchedQuestion.id] = ans.answer;
          }
        });
      }
      const { OwnerDetail, CurrentAddress, VehicleDetail, InsuranceDetail, PermanentAddress, PucDetail, TaxDetail, FitnessDetail, StatePermit, NationalPermit,
        CNGDetail, official_services = [],  ...rest } = currApplication || {};
      form.resetFields();
      let officialServices = {};
      official_services?.forEach((val) => {
        officialServices = { ...officialServices, [val.key]: parseFloat(val.amount || 0) };
      });
      
      if (feedbackData) {
        const { remark, que_ans, date, ...rest } = feedbackData;
        let queAnsObj = {};
        que_ans?.forEach((val) => {
          queAnsObj = { ...queAnsObj, [val.que_id]: val.ans ? 'yes' : 'no' };
        });
        setAnswers(queAnsObj);
        form.setFieldsValue({ ...rest, feedback: remark, date: date && dayjs(date) });
      }

      form.setFieldsValue({
        ...currApplication,
        ...currApplication?.OwnerDetail,
        ...currApplication?.CurrentAddress,
        ...currApplication?.VehicleDetail,
        ...currApplication?.VehicleDetail?.PurchaseAs,
        ...currApplication?.InsuranceDetail,
        ...rest,
        application_no: rest?.application_number,
        entry_date: rest?.entry_date && dayjs(rest.entry_date),
        // aadhar_no_display: formatted_aadhar_no_display,
        policy_no: currApplication?.InsuranceDetail?.policy_no,
        insurance_period: currApplication?.InsuranceDetail?.insurance_period,
        permanant_house_no: currApplication?.PermanentAddress?.house_no,
        permanant_city:  currApplication?.PermanentAddress?.city,
        permanant_landmark:  currApplication?.PermanentAddress?.landmark,
        permanant_state_id:  currApplication?.PermanentAddress?.state_id,
        permanant_district_id:  currApplication?.PermanentAddress?.district_id,
        permanant_pincode:  currApplication?.PermanentAddress?.pincode,
        purchase_date: currApplication?.VehicleDetail?.purchase_date ? convertUTCToIST(currApplication?.VehicleDetail?.purchase_date) : null,
        insurance_from: currApplication?.InsuranceDetail?.insurance_from ? convertUTCToIST(currApplication?.InsuranceDetail.insurance_from) : null,
        insurance_upto: currApplication?.InsuranceDetail?.insurance_upto ? convertUTCToIST(currApplication?.InsuranceDetail.insurance_upto) : null,
        ac_fitted: currApplication?.VehicleDetail?.ac_fitted ? YES : NO,
        audio_fitted: currApplication?.VehicleDetail?.audio_fitted ? YES : NO,
        video_fitted: currApplication?.VehicleDetail?.video_fitted ? YES : NO,
        is_imported: currApplication?.VehicleDetail?.is_imported ? YES : NO,
        official_services: officialServices,
        application_date: currApplication.application_date
          ? dayjs(currApplication.application_date)
          : "",
        services: {
          puc_detail: {
            ...currApplication.PucDetail,
            valid_from: currApplication.PucDetail?.valid_from
              ? dayjs(currApplication.PucDetail.valid_from)
              : null,
            valid_to: currApplication.PucDetail?.valid_to
              ? dayjs(currApplication.PucDetail.valid_to)
              : null,
          },
          tax: {
            ...currApplication.TaxDetail,
            valid_from: currApplication.TaxDetail?.valid_from
              ? dayjs(currApplication.TaxDetail.valid_from)
              : null,
            valid_to: currApplication.TaxDetail?.valid_to
              ? dayjs(currApplication.TaxDetail.valid_to)
              : null,
          },
          fitness: {
            ...currApplication.FitnessDetail,
            valid_from: currApplication.FitnessDetail?.valid_from
              ? dayjs(currApplication.FitnessDetail.valid_from)
              : null,
            valid_to: currApplication.FitnessDetail?.valid_to
              ? dayjs(currApplication.FitnessDetail.valid_to)
              : null,
          },
          state_permit: {
            ...currApplication.StatePermit,
            valid_from: currApplication.StatePermit?.valid_from
              ? dayjs(currApplication.StatePermit.valid_from)
              : null,
            valid_to: currApplication.StatePermit?.valid_to
              ? dayjs(currApplication.StatePermit.valid_to)
              : null,
          },
          national_permit: {
            ...currApplication.NationalPermit,
            valid_from: currApplication.NationalPermit?.valid_from
              ? dayjs(currApplication.NationalPermit.valid_from)
              : null,
            valid_to: currApplication.NationalPermit?.valid_to
              ? dayjs(currApplication.NationalPermit.valid_to)
              : null,
          },
          cng: {
            ...currApplication.CNGDetail,
            valid_from: currApplication.CNGDetail?.valid_from
              ? dayjs(currApplication.CNGDetail.valid_from)
              : null,
            valid_to: currApplication.CNGDetail?.valid_to
              ? dayjs(currApplication.CNGDetail.valid_to)
              : null,
          },
        },
      });
    }
  }, [currApplication, feedbackData]);

  const items = [
    {
      label: "Owner Details",
      key: "1",
      children: 
          <OwnerDetails
            form={form} 
            registrationTypes={registrationTypes}
            ownershipTypes={ownershipTypes}
            states={states}
            districts={districts}
            vehicleClasses={vehicleClasses}
            vehicleTypes={vehicleTypes}
            vehicleCategories={vehicleCategories}
            ownerCategories={ownerCategories}
            isReadOnly={isReadOnly}
          />
    },
    {
      label: "Vehicle Details",
      key: "2",
      children: 
            <VehicalDetails 
                form={form}
                makers={makers}
                makerModels={makerModels}
                dealers={dealers}
                partys={partys}
                brokers={brokers}
                vehicleTypes={vehicleTypes}
                vehicleClasses={vehicleClasses}
                fuels={fuels}
                noms={noms}
                vehicalBodyTypes={vehicalBodyTypes}
                rtos={rtos}
                purchaseAs={purchaseAs}
                ownershipTypes={ownershipTypes}
                states={states}
                districts={districts}
                vehicleCategories={vehicleCategories}
                isReadOnly={isReadOnly}
            />,
    },
    {
      label: "Document Validity",
      key: "3",
      children: 
            <DocumentsValidity 
              form={form}
              insuranceTypes={insuranceTypes}
              insuranceCompanies={insuranceCompanies}
              isReadOnly={isReadOnly}
            />,
    },
    {
      label: "Document",
      key: "4",
      children: 
            <DocumentUpload 
              form={form}
              application={currApplication} 
              documentTypes={documentTypes} 
              isReadOnly={isReadOnly}
            />,
    },
    {
      label: "Remark",
      key: "5",
      children: 
            <FeedbackEntry 
              form={form} 
              questions={Questions} 
              answers={answers} 
              setAnswers={setAnswers}
              isReadOnly={isReadOnly}
            />,
    },
    {
      label: "Form",
      key: "6",
      children: 
            <div style={{ padding: 10 }}>
            <Table
              pagination={false}
              bordered
              columns={[
                {
                  title: "Form No.",
                  dataIndex: "formNo",
                  key: "formNo",
                  render: (text) => (
                    <Typography.Text level={5} style={{ margin: 0 }}>
                      {text}
                    </Typography.Text>
                  ),
                },
                { title: "Action",
                  dataIndex: "action",
                  key: "action", },
              ]}
              dataSource={[
                { key: "1",
                  formNo: "Form No. 18",
                  action: <Form18
                            application={currApplication}
                          />, 
                },
                { key: "2",
                  formNo: "Form No. 19",
                  action: <Form19 
                            application={currApplication}
                          />, 
                },
                { key: "3",
                  formNo: "Form A & B",
                  action: <FormAB 
                            application={currApplication}
                          />, 
                },
                { key: "4",
                  formNo: "Form 20",
                  action: <Form20 
                            application={currApplication}
                          />, 
                },
                { key: "21",
                  formNo: "Form 20 B",
                  action: <Form20B 
                            application={currApplication}
                          />, 
                },
                { key: "22",
                  formNo: "Form 21",
                  action: <Form21 
                            application={currApplication}
                          />, 
                },
                { key: "23",
                  formNo: "Form 22",
                  action: <Form22 
                            application={currApplication}
                          />, 
                },
                { key: "24",
                  formNo: "Form 22 A",
                  action: <Form22A 
                            application={currApplication}
                          />, 
                },
                { key: "25",
                  formNo: "Form 22 B",
                  action: <Form22B
                            application={currApplication}
                          />, 
                },
                { key: "26",
                  formNo: "Form 22 C",
                  action: <Form22C
                            application={currApplication}
                          />, 
                },
                { key: "27",
                  formNo: "Form 22 D",
                  action: <Form22D
                            application={currApplication}
                          />, 
                },
                { key: "65",
                  formNo: "Form No. 65",
                  action: <Form65 
                            application={currApplication}
                          />,  
                },
                { key: "66",
                  formNo: "Form No. 66",
                  action: <Form66 
                            application={currApplication}
                          />, 
                },
                { key: "67",
                  formNo: "Form No. 67",
                  action: <Form67 
                            application={currApplication}
                          />, 
                },
                { key: "68",
                  formNo: "Form No. 68",
                  action: <Form68 
                            application={currApplication}
                          />,
                },
              ]}
            />
          </div>

            // <FormPages
            //   form={form} 
            //   isReadOnly={isReadOnly}
            // />,
    },
  ];

  const isExpired = (validTo) => {
    if (!validTo) return true; 
    return dayjs(validTo).isBefore(dayjs(), "day");
  };

  const followUpServices = [
    { key: "InsuranceDetail", label: "Insurance" },
    { key: "PucDetail", label: "PUC" },
    { key: "StatePermit", label: "State Permit" },
    { key: "TaxDetail", label: "Tax" },
    { key: "CNGDetail", label: "CNG" },
    { key: "NationalPermit", label: "National Permit" },
    { key: "FitnessDetail", label: "Fitness" },
  ];

  const activeFollowUps = followUpServices
    .filter((item) => currApplication?.[item.key]?.follow_up === true)
    .map((item) => ({
      ...item,
      valid_to: currApplication?.[item.key]?.valid_to,
      isExpired: isExpired(currApplication?.[item.key]?.valid_to),
    }));

  return (
     <Spin spinning={loading}>
      <div>
        <Title level={3} className="page-title" style={{ textAlign: "center", color: "#1890ff", marginBottom: "20px" }}>
          Registered Vehicle Details
        </Title>

        <Text className="reg-number-text" style={{ textAlign: "center", width: "100%", display: "block", fontSize: 17, marginBottom: "20px" }}>
          Registration No:{" "}
          <span className="reg-number" style={{ color: '#20C997', fontWeight: 500 }}>{currApplication?.VehicleDetail?.vehicle_no || ''}</span>
        </Text>

        <div className="action-buttons" style={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
          <Space>
            <Button type="primary" icon={<RiArrowGoBackFill />} onClick={() => navigate('/register-application')}>
              Back
            </Button>
          </Space>
        </div>

        <Row justify="center" gutter={[24, 24]} className="followup-row" style={{ width: '100%' }}>
          <Col span={24} align="center">
            {activeFollowUps?.map((service, idx) => (
              <Button 
                type="primary" 
                style={{ 
                  margin: '0 8px',
                  backgroundColor: service.isExpired ? '#DC3545' : '#20C997',
                  borderColor: service.isExpired ? '#DC3545' : '#20C997',
                  fontWeight: '500',
                }}
              >
                {service.label}
              </Button>
            ))}
          </Col>
        </Row>

        <Row style={{ width: '100%' }}>
          <div className="top-tabs-register-app" style={{ width: '100%' }}>
            <Form form={form} layout="vertical">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                type="card"
                items={items}
              />
            </Form>
          </div>
        </Row>
      </div>
     </Spin>
  );
};

export default RegisteredVehicalDetailsPage;
