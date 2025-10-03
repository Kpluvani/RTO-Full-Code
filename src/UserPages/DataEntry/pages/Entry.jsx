import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Form, Table, message, Tabs, Badge } from "antd";
import { saveDataEntry } from '@/features/application/applicationSlice';
import { OwnerDetails }  from "@/Components/OwnerDetails/pages";
import { VehicalDetails } from "@/Components/VehicalDetails/pages";
import { DocumentsValidity }  from "@/Components/DocumentsValidity/pages";
import { fetchMasterList } from '@/features/masterList/masterListSlice';
import { convertUTCToIST, convertISTToUTC, NO, YES, ServicesInDataEntry, FILE_MOVEMENT_TYPE } from '@/utils';
import { SaveAndFileMovement } from '@/Components/SaveAndFileMovement/pages';
import * as _ from "lodash";
import dayjs from "dayjs";

const Entry = ({ application, processes, registrationNo }) => {
  const [activeTab, setActiveTab] = useState("2");
  const [documentsValidityTabIndex, setDocumentsValidityTabIndex] = useState(42);
  const [vehicalType, setVehicalType] = useState();
  const [tabFieldMap, setTabFieldMap] = useState({});
  const [errorTabs, setErrorTabs] = useState(new Set());
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    makers = [],
    makerModels = [],
    dealers = [],
    parties: partys = [],
    brokers = [],
    vehicleTypes = [],
    vehicleClasses = [],
    fuels = [],
    noms = [],
    vehicleBodyTypes: vehicalBodyTypes = [],
    rtos = [],
    registrationTypes = [],
    ownershipTypes = [],
    ownerCategories = [],
    states = [],
    districts = [],
    vehicleCategories = [],
    purchaseAses: purchaseAs = [],
    insuranceCompanies = [],
    insuranceTypes = [],
    holdReasons = [],
    months = [],
    years = [],
    manufactureLocations = [],
    financers = [],
    loading,
  } = useSelector((state) => state?.mastersList || {});


  useEffect(() => {
    dispatch(fetchMasterList());

    return () => {
      // clearData()
    }
  }, []);

  useEffect(() => {
    if (application?.id) {
      console.log('<<Application---', application);
      const { OwnerDetail, CurrentAddress, VehicleDetail, InsuranceDetail, PermanentAddress, PucDetail, TaxDetail, FitnessDetail, StatePermit, NationalPermit,
        CNGDetail, official_services = [],  ...rest } = application || {};
      form.resetFields();
      let officialServices = {};
      official_services?.forEach((val) => {
        officialServices = { ...officialServices, [val.key]: parseFloat(val.amount || 0) };
      });
      let formatted_aadhar_no_display;
      if (OwnerDetail?.aadhar_no) {
        formatted_aadhar_no_display = OwnerDetail?.aadhar_no?.replace(/(\d{4})(?=\d)/g, "$1-");
      }
         
      
      form.setFieldsValue({
        ...OwnerDetail,
        ...CurrentAddress,
        ...VehicleDetail,
        ...VehicleDetail?.PurchaseAs,
        ...InsuranceDetail,        
        ...rest,
        application_no: rest?.application_number,
        entry_date: rest?.entry_date && dayjs(rest.entry_date),
        aadhar_no_display: formatted_aadhar_no_display,
        // manufacture_month_id: VehicleDetail?.Month?.id,
        // manufacture_year_id: VehicleDetail?.Year?.id,
        permanant_house_no: PermanentAddress?.house_no,
        permanant_city: PermanentAddress?.city,
        permanant_landmark: PermanentAddress?.landmark,
        permanant_state_id: PermanentAddress?.state_id,
        permanant_district_id: PermanentAddress?.district_id,
        permanant_pincode: PermanentAddress?.pincode,
        purchase_date: VehicleDetail?.purchase_date ? convertUTCToIST(VehicleDetail?.purchase_date) : null,
        insurance_from: InsuranceDetail?.insurance_from ? convertUTCToIST(InsuranceDetail.insurance_from) : null,
        insurance_upto: InsuranceDetail?.insurance_upto ? convertUTCToIST(InsuranceDetail.insurance_upto) : null,
        ac_fitted: VehicleDetail?.ac_fitted ? YES : NO,
        audio_fitted: VehicleDetail?.audio_fitted ? YES : NO,
        video_fitted: VehicleDetail?.video_fitted ? YES : NO,
        is_imported: VehicleDetail?.is_imported ? YES : NO,
        official_services: officialServices,
        services: {
          puc_detail: {
            ...PucDetail,
            valid_from: PucDetail?.valid_from ? convertUTCToIST(PucDetail.valid_from) : null,
            valid_to: PucDetail?.valid_to ? convertUTCToIST(PucDetail.valid_to) : null,
          },
          tax: {
            ...TaxDetail,
            valid_from: TaxDetail?.valid_from ? convertUTCToIST(TaxDetail.valid_from) : null,
            valid_to: TaxDetail?.valid_to ? convertUTCToIST(TaxDetail.valid_to) : null,
          },
          fitness: {
            ...FitnessDetail,
            valid_from: FitnessDetail?.valid_from ? convertUTCToIST(FitnessDetail.valid_from) : null,
            valid_to: FitnessDetail?.valid_to ? convertUTCToIST(FitnessDetail.valid_to) : null,
          },
          state_permit: {
            ...StatePermit,
            valid_from: StatePermit?.valid_from ? convertUTCToIST(StatePermit.valid_from) : null,
            valid_to: StatePermit?.valid_to ? convertUTCToIST(StatePermit.valid_to) : null,
          },
          national_permit: {
            ...NationalPermit,
            valid_from: NationalPermit?.valid_from ? convertUTCToIST(NationalPermit.valid_from) : null,
            valid_to: NationalPermit?.valid_to ? convertUTCToIST(NationalPermit.valid_to) : null,
          },
          cng: {
            ...CNGDetail,
            valid_from: CNGDetail?.valid_from ? convertUTCToIST(CNGDetail.valid_from) : null,
            valid_to: CNGDetail?.valid_to ? convertUTCToIST(CNGDetail.valid_to) : null,
          },
        }
      });
    }
  }, [application]);

  useEffect(() => {
    const value = form.getFieldValue('vehicle_type_id');
    const type = vehicleTypes.find((vehicleType) => parseInt(vehicleType.id) === parseInt(value));
    setVehicalType(type);
  }, [form.getFieldValue('vehicle_type_id'), vehicleTypes]);

  const saveData = async (id, values) => {
    const { services, official_services, ...rest } = values;
    const serviceArray = [];
    _.forIn(services, (value, key) => {
      if (value.puc_no || value.receipt_no || value.certificate_no || value.permit_no || value.kit_no || value.show_in_work_done) {
        serviceArray.push({
          type: key,
          valid_from: application?.valid_from ? convertISTToUTC(application.valid_from) : null,
          valid_to: application?.valid_to ? convertISTToUTC(application.valid_to) : null,
          ...value
        });
      }
    });
    const officialServices = [];
    _.forIn(official_services, (value, key) => {
      if (parseFloat(value || 0)) {
        officialServices.push({
          key: key,
          amount: parseFloat(value || 0),
          name: ServicesInDataEntry.find((val) => val.key == key)?.name || '',
        });
      }
    });
    const data = {
      ...rest,
      tax_type: 'MV Tax',
      process_id: application.process_id,
      purchase_date: rest.purchase_date ? convertISTToUTC(rest.purchase_date) : null,
      insurance_from: rest?.insurance_from ? convertISTToUTC(rest.insurance_from) : null,
      insurance_upto: rest?.insurance_upto ? convertISTToUTC(rest.insurance_upto) : null,
      services: serviceArray,
      registration_no: registrationNo || null,
      vehicle_no: registrationNo || null,
      official_services: officialServices
    };
    const res = await dispatch(saveDataEntry({ id, data }));
    if (res.error) {
        message.error(res.payload || 'Failed to save data');
    } else {
      message.success(res.payload.message || 'Data saved successfully');
      if (data.file_movement) {
        navigate('/home');
      }
    }
  }
   
  // Save button submit handler
  const onSave = async () => {
    try {
      setErrorTabs(new Set());
      const values = form.getFieldsValue();
      await saveData(application.id, values);
    }
    catch (error){
      console.log(error);
      message.error("please fill all required fields");
    }
  }
  // const onFinish = async (values) => {
  //   try {
  //     setErrorTabs(new Set());
  //     await saveData(application.id, values);
  //   }
  //   catch (error){
  //     console.log(error);
  //     message.error("please fill all required fields");
  //   }
  // };

  // File Movement handler
  const handleFileMovement = async (fileMovementData, closeDialog) => {
    if (fileMovementData.file_movement_type === FILE_MOVEMENT_TYPE.NEXT) {
      form.validateFields().then(async (res) => {
        const values = {
          ...res,
          ...fileMovementData
        };
        await saveData(application?.id, values);
        closeDialog && closeDialog();
      }).catch((e) => {
        onFinishFailed(e);
        closeDialog && closeDialog();
      })
    } else {
      let response = form.getFieldsValue();
      const values = {
        ...response,
        ...fileMovementData
      };
      console.log('<<Response-without validation--', values);
      await saveData(application?.id, values);
      closeDialog && closeDialog();
    }
  };

  const renderTab = (title, key) => errorTabs.has(key) ? <Badge dot>{title}</Badge> : title;
  
  const registerFieldsForTab = (tabKey, fields) => {
    setTabFieldMap(prev => ({
      ...prev,
      [tabKey]: Array.from(new Set([...(prev[tabKey] || []), ...fields]))
    }));
  };

  const onFinishFailed = async (errorInfo) => {
    const errorFields = errorInfo.errorFields.map((e) =>
      e.name.join('.')
    );

    const tabsWithErrors = new Set();

    for (const [tabKey, fieldNames] of Object.entries(tabFieldMap)) {
      if (fieldNames.some((name) => errorFields.includes(name))) {
        tabsWithErrors.add(tabKey);
      }
    }
    console.log('<<set finish failed--', tabsWithErrors, errorFields);
    setErrorTabs(tabsWithErrors);

    const firstErrorField = errorFields[0];
    for (const [tabKey, fieldNames] of Object.entries(tabFieldMap)) {
      if (fieldNames.includes(firstErrorField)) {
        setActiveTab(tabKey);
        form.scrollToField(firstErrorField.split('.'), { block: 'end', behavior: 'smooth' });
        break;
      }
    }
  }

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


  const items = [
    {
      label: renderTab('Owner Details', '1'),
      key: '1',
      forceRender: true,
      children: (
        <OwnerDetails
          form={form} 
          // rtos={rtos}
          registrationTypes={registrationTypes}
          ownershipTypes={ownershipTypes}
          states={states}
          districts={districts}
          vehicleClasses={vehicleClasses}
          vehicleTypes={vehicleTypes}
          vehicleCategories={vehicleCategories}
          ownerCategories={ownerCategories}
          registerFields={(fields) => registerFieldsForTab('1', fields)}
        />
      ),
    },
    {
      label: renderTab('Vehicle Details', '2'),
      key: '2',
      forceRender: true,
      children: (
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
          setVehicalType={setVehicalType}
          registerFields={(fields) => registerFieldsForTab('2', fields)}
          months={months}
          years={years}
          manufactureLocations={manufactureLocations}
        />
      ),
    },
    {
      label: (
        <div tabIndex={42} style={{ outline: 'none' }}>
          {renderTab('Documents Validity', '3')}
        </div>
      ),
      key: '3',
      forceRender: true,
      children: (
        <DocumentsValidity 
          form={form}
          insuranceTypes={insuranceTypes}
          insuranceCompanies={insuranceCompanies}
          vehicalType={vehicalType}
          registerFields={(fields) => registerFieldsForTab('3', fields)}
          financers={financers}
          isActive={activeTab === "3"}
          tabIndex={43} // Pass tabIndex to component
        />
      ),
    },
  ];

  return (
    <div className="p-6 data-entry" style={{marginTop: '2rem'}}>
      {/* Top Tabs as Buttons */}
        <div className="mb-4">
        <Form
          form={form}
          layout="vertical"
          // onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{ width: '100%' }}
        >
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0)',borderRadius: '1rem',border: 'none', padding: '0px !important' }} className="top-tabs">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            style={{ marginBottom: '1rem', width: '100%' }}
            items={items}
          />
          </div>
            <SaveAndFileMovement
              formRef={form}
              handleFileMovement={handleFileMovement}
              handleSaveData={onSave}
              onFinishFailed={onFinishFailed}
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

export default Entry;
