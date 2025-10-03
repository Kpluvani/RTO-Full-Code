import React, { useEffect, useState, useRef } from "react";
import { Card, Row, Col, Select, Form, DatePicker, Checkbox, Typography } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { InsurancePeriods, DateFormat, ServicesInDataEntry, PucPeriods, FitneesPeriods, TaxModeOptions } from '@/utils';
import dayjs from "dayjs";
import * as _ from 'lodash';
import "../styles/documentsValidity.css";
import moment from 'moment';

const { Text } = Typography;
export const DocumentsValidity = ({
  form,
  insuranceTypes,
  insuranceCompanies,
  vehicalType,
  registerFields,
  isReadOnly = false,
  financers,
  tabIndex,
  isActive
}) => {
  const [Hypothecated, setHypothecated] = useState(false);
  const [disableUpTo, setDisableUpTo] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [sPermitReq, setSPermitReq] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  
  // refs for focus
  const insuranceTypeRef = useRef(null);
  let currentTabIndex = tabIndex || 0;

  // Function to get next tabIndex
  const getNextTabIndex = () => {
    return currentTabIndex++;
  };

 const parseRawDateInput = (input) => {
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.length === 8) {
    const day = digitsOnly.substring(0, 2);
    const month = digitsOnly.substring(2, 4);
    const year = digitsOnly.substring(4, 8);

    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);

    if (dayInt < 1 || dayInt > 31 || monthInt < 1 || monthInt > 12) {
      return null;
    }

    const formatted = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    const parsedDate = moment(formatted, 'DD/MM/YYYY', true);

    if (parsedDate.isValid()) {
      return parsedDate;
    }
  }

  return null;
};


  // auto focus first input when tab becomes active
  useEffect(() => {
    if (isActive && insuranceTypeRef.current) {
      setTimeout(() => {
        insuranceTypeRef.current.focus();
      }, 100);
    }
  }, [isActive]);

  // Reset currentTabIndex when component re-renders
  useEffect(() => {
    currentTabIndex = tabIndex || 0;
  });

  // sync total
  useEffect(() => {
    form.setFieldValue("total_amount", totalAmount);
  }, [totalAmount]);

  // show/hide services
  useEffect(() => {
    setShowServices(!!form.getFieldValue("is_official_service"));
  }, [form.getFieldValue("is_official_service")]);

  // watch work_done toggles
  const pucShowInWorkDone = Form.useWatch(["services", "puc_detail", "show_in_work_done"], form);
  const taxShowInWorkDone = Form.useWatch(["services", "tax", "show_in_work_done"], form);
  const fitnessShowInWorkDone = Form.useWatch(["services", "fitness", "show_in_work_done"], form);
  const statePermitShowInWorkDone = Form.useWatch(["services", "state_permit", "show_in_work_done"], form);
  const nationalPermitShowInWorkDone = Form.useWatch(["services", "national_permit", "show_in_work_done"], form);
  const cngShowInWorkDone = Form.useWatch(["services", "cng", "show_in_work_done"], form);

  // register fields
  useEffect(() => {
    if (registerFields) {
      const serviceFees = ServicesInDataEntry.map((val) => `official_services.${val.key}`);
      registerFields([
        "insurance_type_id",
        "insurance_company_id",
        "insurance_detail_follow_up",
        "policy_no",
        "insurance_from",
        "insurance_period",
        "insurance_upto",
        "is_hypothecated",
        "financer_id",
        // services fields...
        "services.puc_detail.follow_up",
        "services.puc_detail.puc_no",
        "services.puc_detail.puc_period",
        "services.puc_detail.valid_from",
        "services.puc_detail.valid_to",
        "services.tax.follow_up",
        "services.tax.receipt_no",
        "services.tax.tax_amount",
        "services.tax.valid_from",
        "services.tax.valid_to",
        "services.fitness.follow_up",
        "services.fitness.certificate_no",
        "services.fitness.fitness_period",
        "services.fitness.valid_from",
        "services.fitness.valid_to",
        "services.state_permit.follow_up",
        "services.state_permit.permit_no",
        "services.state_permit.valid_from",
        "services.state_permit.valid_to",
        "services.national_permit.follow_up",
        "services.national_permit.permit_no",
        "services.national_permit.valid_from",
        "services.national_permit.valid_to",
        "services.cng.follow_up",
        "services.cng.kit_no",
        "services.cng.tank_no",
        "services.cng.manufacturer_name",
        "services.cng.valid_from",
        "services.cng.valid_to",
        "reflect_in_account",
        "is_official_service",
        "total_amount",
        ...serviceFees
      ]);
    }
  }, []);

  // handle hypothecation
  useEffect(() => {
    const val = form.getFieldValue("is_hypothecated");
    setHypothecated(val);
  }, [form.getFieldValue("is_hypothecated")]);

  // transport type
  useEffect(() => {
    setSPermitReq(vehicalType?.name?.toLowerCase() === "transport");
  }, [vehicalType]);

  // utility functions
  const getInsuranceUpToDate = (fromDate, yearCount) =>
    dayjs(fromDate).add(yearCount, "year").subtract(1, "day");

  const setUpToInsuranceDate = (fromDate, year) => {
    if (fromDate && year) {
      const to = getInsuranceUpToDate(fromDate, year);
      form.setFieldValue("insurance_upto", to);
      setDisableUpTo(true);
    }
  };

  const getTaxUpToDate = (fromDate) => {
    const taxMode = form.getFieldValue("tax_mode");
    if (taxMode === TaxModeOptions[0]) return dayjs(fromDate).add(15, "year").subtract(1, "day");
    if (taxMode === TaxModeOptions[1]) return dayjs(fromDate).add(1, "month").subtract(1, "day");
    if (taxMode === TaxModeOptions[2]) return dayjs(fromDate).add(3, "month").subtract(1, "day");
    if (taxMode === TaxModeOptions[3]) return dayjs(fromDate).add(6, "month").subtract(1, "day");
  };

  const setUpToTaxDate = (fromDate) => {
    const taxMode = form.getFieldValue("tax_mode");
    if (fromDate && taxMode) {
      const to = getTaxUpToDate(fromDate);
      form.setFieldValue(["services", "tax", "valid_to"], to);
    }
  };

  const setUpToPucDate = (fromDate, year) => {
    if (fromDate && year) {
      const to =
        year === 0.5
          ? dayjs(fromDate).add(6, "month").subtract(1, "day")
          : dayjs(fromDate).add(year, "year").subtract(1, "day");
      form.setFieldValue(["services", "puc_detail", "valid_to"], to);
    }
  };

  const setUpToFitnessDate = (fromDate, year) => {
    if (fromDate && year) {
      const to = dayjs(fromDate).add(year, "year").subtract(1, "day");
      form.setFieldValue(["services", "fitness", "valid_to"], to);
    }
  };

  // follow up check all
  const getValue = () => {
    const values = form.getFieldsValue();
    let all = true;
    _.forIn(values.services, (value, key) => {
      all = all && form.getFieldValue(["services", key, "follow_up"]);
    });
    all = all && form.getFieldValue("insurance_detail_follow_up");
    return all;
  };

  const onCheckFollowedUp = (e) => {
    setCheckAll(e.target.checked);
    const values = form.getFieldsValue();
    _.forIn(values.services, (value, key) => {
      form.setFieldValue(["services", key, "follow_up"], e.target.checked);
    });
    form.setFieldValue("insurance_detail_follow_up", e.target.checked);
  };

  useEffect(() => {
    let all = getValue();
    setCheckAll(all);
  }, [form]);

  const onChangeChecked = () => {
    let all = getValue();
    setCheckAll(all);
  };

  const onChangeAmount = () => {
    const values = form.getFieldsValue();
    const { official_services, services } = values;
    let total = parseFloat(services?.tax?.tax_amount || 0);
    _.forIn(official_services, (value) => {
      total += parseFloat(value || 0);
    });
    setTotalAmount(total);
  };

  // --- UI Render ---
  return (
    <div className="documents-validity">
      {/* Follow Up All */}
      <Row gutter={16} className="followup-all">
        <Checkbox checked={checkAll} onChange={onCheckFollowedUp} disabled={isReadOnly}>
          Followed Up All
        </Checkbox>
      </Row>

      {/* Insurance */}
      <Card
        className="labels"
        title="Insurance Details"
        extra={
          <Form.Item noStyle name="insurance_detail_follow_up" valuePropName="checked">
            <Checkbox onChange={onChangeChecked} disabled={isReadOnly}>
              Followed Up
            </Checkbox>
          </Form.Item>
        }
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name="insurance_type_id"
              label="Insurance Type"
              rules={[{ required: true, message: "Please select Insurance Type" }]}
            >
              <Select
                ref={insuranceTypeRef}
                tabIndex={getNextTabIndex()}
                placeholder="Select"
                style={{ minWidth: "100%" }}
                options={insuranceTypes?.map((val) => ({ value: val.id, label: val.name }))}
                showSearch
                filterOption={(input, option) =>
                  option.label?.toLowerCase()?.startsWith(input.toLowerCase())
                }
                disabled={isReadOnly}
                onFocus={() => console.log('Insurance Type focused')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={"insurance_company_id"}
              label={'Insurance Company'}
              rules={[{ required: true, message: "Please enter Insurance Company" }]}
            >
              <Select
                tabIndex={getNextTabIndex()}
                placeholder="Select"
                style={{ minWidth: '100%' }}
                options={insuranceCompanies?.map((val) => ({ value: val.id, label: val.name }))}
                showSearch={true}
                filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                disabled={isReadOnly}
                
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={"policy_no"}
              label={'Policy/Cover/Note No'} 
              rules={[{ required: true, message: "Please enter Policy/Cover/Note No" }]}
            >
              <Input 
                placeholder="Enter Policy/Cover/Note No" 
                disabled={isReadOnly} 
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={'insurance_from'}
              label={'Insurance Form'}
              rules={[{ required: true, message: "Please select Insurance Form" }]}
            >
            <DatePicker
  format={DateFormat}
  placeholder={DateFormat}
  style={{ minWidth: '100%' }}
  inputReadOnly={false}
  disabled={isReadOnly}
  tabIndex={getNextTabIndex()}
  onChange={(date, dateString) => {
    const year = form.getFieldValue('insurance_period');
    setUpToInsuranceDate(date, year || 0);
    console.log('<<date string--', date, dateString);
  }}
  onInput={(e) => {
    const input = e.target;
    const rawValue = input.value.replace(/\D/g, '');

    let formattedValue = rawValue;

    if (rawValue.length >= 5 && rawValue.length <= 8) {
      formattedValue = `${rawValue.substring(0, 2)}/${rawValue.substring(2, 4)}/${rawValue.substring(4, 8)}`;
    } else if (rawValue.length > 2) {
      formattedValue = `${rawValue.substring(0, 2)}/${rawValue.substring(2)}`;
    }

    input.value = formattedValue;
  }}
  onKeyDown={(e) => {
    // Allow only numbers and control keys
    if (!/[0-9]|\/|Backspace|Delete|Tab|ArrowLeft|ArrowRight|Enter/.test(e.key)) {
      e.preventDefault();
    }

    // Handle Enter key to parse and set the date
    if (e.key === 'Enter') {
      const raw = e.target.value;
      const parsed = parseRawDateInput(raw);

      if (parsed?.isValid()) {
        const year = form.getFieldValue('insurance_period');
        form.setFieldsValue({ insurance_from: parsed });
        setUpToInsuranceDate(parsed, year || 0);
      }
    }
  }}
  // Optional: remove blur handler if you only want Enter to trigger parsing
  onBlur={() => {}}
/>

            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={'insurance_period'}              
              label={'Insurance Period'}
              rules={[{ required: true, message: "Please enter Insurance Period" }]}
            >
              <Select
                placeholder="Select"
                style={{ minWidth: '100%' }}
                options={InsurancePeriods.map((val) => ({ value: val, label: `${val} Year`}))}
                showSearch={true}
                filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                onChange={(year) => {
                  const from = form.getFieldValue('insurance_from');
                  setUpToInsuranceDate(from, year || 0);
                }}
                disabled={isReadOnly}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
        
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={'insurance_upto'}
              label={'Insurance Upto'}
              rules={[{ required: true, message: "Please select Insurance Upto" }]}
            >
              <DatePicker format={DateFormat} placeholder={DateFormat} style={{ minWidth: '100%' }} disabled={disableUpTo || isReadOnly} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Row gutter={16} className="hypotheticate">
        <Form.Item name={'is_hypothecated'} noStyle={true} valuePropName="checked">
          <Checkbox onChange={(e) => setHypothecated(e.target.checked)} disabled={isReadOnly}>
            <Text style={{ color: 'red' }} strong>Is Vehical Hypothecated ?</Text>
          </Checkbox>
        </Form.Item>
      </Row>
      {Hypothecated &&
      (
        <Card className="hypotheticate-box" title={"Hypothecation Details"}>
          <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name={'financer_id'}
                label={'Financer Name'}
                rules={[{ required: true, message: "Please Select Financer Name" }]}
              >
                  <Select
                      placeholder={"Select Financer Name"}
                      options={financers?.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                      disabled={isReadOnly}
                      tabIndex={getNextTabIndex()}
                  />
              </Form.Item>
          </Col>
        </Card>
      )}
      
      <Card
      className="labels"
      title={"PUC Details"}
      extra={(
        <>
          <Form.Item noStyle name={['services', 'puc_detail', 'show_in_work_done']} valuePropName="checked">
            <Checkbox disabled={isReadOnly} tabIndex={getNextTabIndex()}> Show In Work Done </Checkbox>
          </Form.Item>
          <Form.Item noStyle name={['services', 'puc_detail', 'follow_up']} valuePropName="checked">
            <Checkbox disabled={isReadOnly} tabIndex={getNextTabIndex()}> Followed Up </Checkbox>
          </Form.Item>
        </>
      )}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Form.Item
            name={['services', 'puc_detail', 'puc_no']}
            label={'PUC No'}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (pucShowInWorkDone) return Promise.resolve(); // skip validation
                  if (!value) return Promise.reject(new Error("Please enter PUC No"));
                  return Promise.resolve();
                }
              })
            ]}
          >
            <Input placeholder="Enter PUC No" disabled={isReadOnly || pucShowInWorkDone} tabIndex={getNextTabIndex()}/>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item
            label={'Valid From'}
            name={['services', 'puc_detail', 'valid_from']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const toDate = getFieldValue(['services', 'puc_detail', 'valid_to']);
                  if (pucShowInWorkDone) return Promise.resolve(); 
                  if (!value) return Promise.reject(new Error("Please select Valid From"));
                  if (!value || !toDate || dayjs(value).isBefore(toDate)) return Promise.resolve();
                  return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                },
              }),
            ]}
          >
            <DatePicker
              format={"DD-MM-YYYY"}
              placeholder={"DD-MM-YYYY"}
              style={{ minWidth: '100%' }}
              onChange={(date) => {
                const period = form.getFieldValue(['services', 'puc_detail', 'puc_period']);
                setUpToPucDate(date, period || 0);
                form.getFieldValue(['services', 'puc_detail', 'valid_to']) && 
                  form.validateFields([['services', 'puc_detail', 'valid_to']])
              }}
              disabled={isReadOnly || pucShowInWorkDone}
              tabIndex={getNextTabIndex()}              
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item
            label={'PUC Period'}
            name={['services', 'puc_detail', 'puc_period']}
            rules={[{ required: true, message: "Please enter PUC Period" }]}
          >
            <Select
              placeholder="Select"
              style={{ minWidth: '100%' }}
              options={[{ value: 0.5, label: '6 Months' }, ...PucPeriods.map((val) => ({ value: val, label: `${val} Year`}))]}
              showSearch
              filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
              onChange={(year) => {
                const from = form.getFieldValue(['services', 'puc_detail', 'valid_from']);
                setUpToPucDate(from, year || 0);
              }}
              disabled={isReadOnly || pucShowInWorkDone}
              tabIndex={getNextTabIndex()}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Form.Item
            label={'Valid To'}
            name={['services', 'puc_detail', 'valid_to']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const fromDate = getFieldValue(['services', 'puc_detail', 'valid_from']);
                  if (pucShowInWorkDone) return Promise.resolve(); 
                  if (!value) return Promise.reject(new Error("Please select Valid To"));
                  if (!value || !fromDate || dayjs(value).isAfter(fromDate)) return Promise.resolve();
                  return Promise.reject(new Error('Valid To must be later than Valid From'));
                },
              }),
            ]}
          >
            <DatePicker
              format={"DD-MM-YYYY"}
              placeholder={"DD-MM-YYYY"}
              style={{ minWidth: '100%' }}
              onChange={() => form.getFieldValue(['services', 'puc_detail', 'valid_from']) && 
                form.validateFields([['services', 'puc_detail', 'valid_from']])}
              disabled={true} // stays read-only
              tabIndex={getNextTabIndex()}
              />
          </Form.Item>
        </Col>
      </Row>
    </Card>
      <Card
        className="labels"
        title={'Tax'}
        extra={(
          <Form.Item noStyle={true} name={['services', 'tax', 'follow_up']} valuePropName="checked">
            <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()}> Followed Up </Checkbox>
          </Form.Item>
        )}
      > 
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'tax', 'receipt_no']}
              label={'Receipt No'} 
              rules={[{ required: true, message: "Please enter Receipt No" }]}
            >
              <Input placeholder="Enter Receipt No" disabled={isReadOnly} tabIndex={getNextTabIndex()}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'tax', 'tax_amount']}
              label={'Tax Amount'}
              rules={[{ required: true, message: "Please enter Tax Amount" }]}
            >
              <Input placeholder="Enter Tax Amount" type="number" onChange={onChangeAmount} disabled={isReadOnly} tabIndex={getNextTabIndex()}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'tax', 'valid_from']}
              label={'Valid From'}
              rules={[
                { required: true, message: "Please select Valid From" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const toDate = getFieldValue(['services', 'tax', 'valid_to']);
                    if (!value || !toDate || dayjs(value).isBefore(toDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={(date) => {
                  setUpToTaxDate(date);
                  form.getFieldValue(['services', 'tax', 'valid_to']) && form.validateFields([['services', 'tax', 'valid_to']])
                }}
                disabled={isReadOnly}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name={['services', 'tax', 'valid_to']}
                label={'Valid To'}
                rules={[
                  { required: true, message: "Please select Valid To" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const fromDate = getFieldValue(['services', 'tax', 'valid_from']);
                      if (!value || !fromDate || dayjs(value).isAfter(fromDate)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Valid To must be later than Valid From'));
                    },
                  }),
                ]}
              >
                <DatePicker
                  format={DateFormat}
                  placeholder={DateFormat}
                  style={{ minWidth: '100%' }}
                  onChange={() => form.getFieldValue(['services', 'tax', 'valid_from']) && form.validateFields([['services', 'tax', 'valid_from']])}
                  disabled={isReadOnly}
                  tabIndex={getNextTabIndex()}
                />
              </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={'total_amount'}
              label={'Total Amount'}
              rules={[{ required: true, message: "Please enter Tax Amount" }]}
              initialValue={0}
            >
              <Input placeholder="Enter Total Amount" type="number" value={totalAmount} readOnly={true}  disabled={isReadOnly} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item name={'is_official_service'} label={' '} valuePropName="checked">
              <Checkbox onChange={(e) => setShowServices(e.target.checked)}  disabled={isReadOnly} tabIndex={getNextTabIndex()} > Show Official Services </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {showServices ? (
          <Card
            title={'Official Service Fees'}
            className="official-service-card mt-10"
            extra={(
              <Form.Item noStyle={true} name={'reflect_in_account'} valuePropName="checked">
                <Checkbox  disabled={isReadOnly} tabIndex={getNextTabIndex()} > Reflect in Chargable Amount </Checkbox>
              </Form.Item>
            )}
          >
            {ServicesInDataEntry.map((service, index) => {
              return (
                <div key={index}>
                  <Form.Item
                    name={['official_services', service.key]}
                    label={service.name}
                    layout="horizontal"
                    labelCol={{ offset: 0, span: 8 }}
                    wrapperCol={{ offset: 0, span: 16 }}
                    rules={[{ required: service.required, message: 'Amount is required!' }]}
                  >
                    <Input placeholder="Enter fees" type="number" onChange={onChangeAmount}  disabled={isReadOnly} tabIndex={getNextTabIndex()} />
                  </Form.Item>
                </div>
              );
            })}
          </Card>
        ) : null}
      </Card>
      <Card
        className="labels"
        title={'Fitness'}
        extra={(
          <>
            <Form.Item noStyle={true} name={['services', 'fitness', 'show_in_work_done']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()} > Show In Work Done </Checkbox>
            </Form.Item>
            <Form.Item noStyle={true} name={['services', 'fitness', 'follow_up']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked}  disabled={isReadOnly} tabIndex={getNextTabIndex()} > Followed Up </Checkbox>
            </Form.Item>
          </>
        )}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item
              name={['services', 'fitness', 'certificate_no']}
              label={'Certificate No'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (fitnessShowInWorkDone) return Promise.resolve();
                    if (!value) return Promise.reject(new Error("Please enter PUC No"));
                    return Promise.resolve();
                  }
                })
              ]}
              // rules={[{ required: true, message: "Please enter Fitness Certificate No" }]}
            >
              <Input placeholder="Enter Fitness Certificate No" disabled={isReadOnly || fitnessShowInWorkDone} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item
              name={['services', 'fitness', 'valid_from']}
              label={'Valid From'}
              rules={[
                // { required: true, message: "Please select Valid From" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (fitnessShowInWorkDone) return Promise.resolve();
                    if (!value) {
                      return Promise.reject(new Error("Please select Valid From"));
                    }
                    const toDate = getFieldValue(['services', 'fitness', 'valid_to']);
                    if (!value || !toDate || dayjs(value).isBefore(toDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={(date) => {
                  const period = form.getFieldValue(['services', 'fitness', 'fitness_period']);
                  setUpToFitnessDate(date, period || 0);
                  form.getFieldValue(['services', 'fitness', 'valid_to']) && form.validateFields([['services', 'fitness', 'valid_to']])
                }}
                disabled={isReadOnly || fitnessShowInWorkDone}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>  
          <Col xs={24} sm={12} lg={6}>
            <Form.Item
              name={['services', 'fitness', 'fitness_period']}
              label={'Fitness Period'}
              rules={[{ required: true, message: 'Please enter Fitness Period' }]}
            >
              <Select
                placeholder="Select"
                style={{ minWidth: '100%' }}
                options={FitneesPeriods.map((val) => ({ value: val, label: `${val} Year`}))}
                showSearch={true}
                filterOption={(input, option) => (option.label?.toLowerCase()?.startsWith(input?.toLowerCase()))}
                onChange={(year) => {
                  const from = form.getFieldValue(['services', 'fitness', 'valid_from']);
                  setUpToFitnessDate(from, year || 0);
                }}
                disabled={isReadOnly || fitnessShowInWorkDone}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Form.Item
              name={['services', 'fitness', 'valid_to']}
              label={'Valid To'} 
              rules={[
                // { required: true, message: "Please select Valid To" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (fitnessShowInWorkDone) return Promise.resolve();
                    if (!value) {
                      return Promise.reject(new Error("Please select Valid To"));
                    }
                    const fromDate = getFieldValue(['services', 'fitness', 'valid_from']);
                    if (!value || !fromDate || dayjs(value).isAfter(fromDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid To must be later than Valid From'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={() => form.getFieldValue(['services', 'fitness', 'valid_from']) && form.validateFields([['services', 'fitness', 'valid_from']])}
                disabled={true}
                // tabIndex={69}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
          </Row>
      </Card>
      <Card
        className="labels"
        title={'Gujarat Permit'}
        extra={(
          <>
            <Form.Item noStyle={true} name={['services', 'state_permit', 'show_in_work_done']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()}     > Show In Work Done </Checkbox>
            </Form.Item>
            <Form.Item noStyle={true} name={['services', 'state_permit', 'follow_up']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()} > Followed Up </Checkbox>
            </Form.Item>
          </>
        )}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'state_permit', 'permit_no']}
              label={'Permit No'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const showInWorkDone = getFieldValue(['services', 'state_permit', 'show_in_work_done']);
                    if (showInWorkDone && sPermitReq) {
                      return Promise.resolve(); // skip validation
                    }
                    if (!value) {
                      return Promise.reject(new Error("Please enter Permit No"));
                    }
                    return Promise.resolve();
                  }
                })
              ]}
              // rules={[{ required: sPermitReq, message: "Please enter Permit No" }]}
            >
              <Input placeholder="Enter Permit No" disabled={isReadOnly || statePermitShowInWorkDone} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'state_permit', 'valid_from']}
              label={'Valid From'}
              rules={[
                // { required: sPermitReq, message: "Please select Valid From" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (statePermitShowInWorkDone) return Promise.resolve();
                    if (!value) {
                      return Promise.reject(new Error("Please select Valid From"));
                    }
                    const toDate = getFieldValue(['services', 'state_permit', 'valid_to']);
                    if (!value || !toDate || dayjs(value).isBefore(toDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={(date) => {
                  setUpToStateDate(date);
                  form.getFieldValue(['services', 'state_permit', 'valid_to']) && form.validateFields([['services', 'state_permit', 'valid_to']])
                }}
                disabled={isReadOnly || statePermitShowInWorkDone}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>  
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'state_permit', 'valid_to']}
              label={'Valid To'}
              rules={[
                // { required: sPermitReq, message: "Please select Valid To" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const fromDate = getFieldValue(['services', 'state_permit', 'valid_from']);
                    const showInWorkDone = getFieldValue(['services', 'state_permit', 'show_in_work_done']);
                    if (showInWorkDone) {
                      return Promise.resolve(); // skip validation
                    }
                    if (!value) {
                      return Promise.reject(new Error("Please select Valid From"));
                    }
                    if (!value || !fromDate || dayjs(value).isAfter(fromDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid To must be later than Valid From'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={() => form.getFieldValue(['services', 'state_permit', 'valid_from']) && form.validateFields([['services', 'state_permit', 'valid_from']])}
                disabled={isReadOnly || statePermitShowInWorkDone}
                // tabIndex={74}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card
        className="labels"
        title={'National Permit'}
        extra={(
          <>
            <Form.Item noStyle={true} name={['services', 'national_permit', 'show_in_work_done']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()} > Show In Work Done </Checkbox>
            </Form.Item>
            <Form.Item noStyle={true} name={['services', 'national_permit', 'follow_up']} valuePropName="checked">
              <Checkbox onChange={onChangeChecked} disabled={isReadOnly} tabIndex={getNextTabIndex()} > Followed Up </Checkbox>
            </Form.Item>
          </>
        )}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'national_permit', 'permit_no']}
              label={'National Permit No'}
            >
              <Input placeholder="Enter National Permit No" disabled={isReadOnly || nationalPermitShowInWorkDone} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'national_permit', 'valid_from']}
              label={'Valid From'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const toDate = getFieldValue(['services', 'national_permit', 'valid_to']);
                    if (!value || !toDate || dayjs(value).isBefore(toDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={(date) => {
                  setUpToNationalPermitDate(date);
                  form.getFieldValue(['services', 'national_permit', 'valid_to']) && form.validateFields([['services', 'national_permit', 'valid_to']])
                }}
                disabled={isReadOnly || nationalPermitShowInWorkDone}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>  
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'national_permit', 'valid_to']}
              label={'Valid To'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const fromDate = getFieldValue(['services', 'national_permit', 'valid_from']);
                    if (!value || !fromDate || dayjs(value).isAfter(fromDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid To must be later than Valid From'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={() => form.getFieldValue(['services', 'national_permit', 'valid_from']) && form.validateFields([['services', 'national_permit', 'valid_from']])}
                disabled={isReadOnly || nationalPermitShowInWorkDone}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
          </Row>
      </Card>
      <Card
        className="labels"
        title={'CNG'}
        extra={(
          <Form.Item noStyle={true} name={['services', 'cng', 'follow_up']} valuePropName="checked">
            <Checkbox onChange={onChangeChecked} disabled={isReadOnly}   > Followed Up </Checkbox>
          </Form.Item>
        )}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'cng', 'kit_no']}
              label={'Kit No'}
            >
              <Input placeholder="Enter Kit No" disabled={isReadOnly} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'cng', 'tank_no']}
              label={'Tank No'}
            >
              <Input placeholder="Enter Tank No" disabled={isReadOnly} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'cng', 'manufacturer_name']}
              label={'Manufacturer Name'}
            >
              <Input placeholder="Enter Manufacturer Name" disabled={isReadOnly} tabIndex={getNextTabIndex()} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'cng', 'valid_from']}
              label={'Valid From'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const toDate = getFieldValue(['services', 'cng', 'valid_to']);
                    if (!value || !toDate || dayjs(value).isBefore(toDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid From must be earlier than Valid To'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={() => form.getFieldValue(['services', 'cng', 'valid_to']) && form.validateFields([['services', 'cng', 'valid_to']])}
                disabled={isReadOnly}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name={['services', 'cng', 'valid_to']}
              label={'Valid To'}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const fromDate = getFieldValue(['services', 'cng', 'valid_from']);
                    if (!value || !fromDate || dayjs(value).isAfter(fromDate)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Valid To must be later than Valid From'));
                  },
                }),
              ]}
            >
              <DatePicker
                format={DateFormat}
                placeholder={DateFormat}
                style={{ minWidth: '100%' }}
                onChange={() => form.getFieldValue(['services', 'cng', 'valid_from']) && form.validateFields([['services', 'cng', 'valid_from']])}
                disabled={isReadOnly}
                tabIndex={getNextTabIndex()}
              />
            </Form.Item>
            </Col>
        </Row>
      </Card>
    </div>
  )
};

// In DocumentsValidity component, add this function to count dynamically
const countFocusableElements = () => {
  let count = 0;
  
  // Count each tabIndex={getNextTabIndex()} call
  count += 1; // Followed Up All checkbox
  count += 1; // Insurance Details Followed Up checkbox
  count += 6; // Insurance Details fields
  count += 1; // Is Vehicle Hypothecated checkbox
  count += 1; // Financer Name select
  count += 4; // PUC Details
  count += 8; // Tax
  count += 1; // Show Official Services checkbox
  count += 8; // Fitness
  count += 6; // Gujarat Permit
  count += 6; // National Permit
  count += 7; // CNG
  
  return count;
};

export const DOCUMENTS_VALIDITY_FOCUSABLE_COUNT = countFocusableElements();