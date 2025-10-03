import React, { useState, useEffect, useCallback,useRef } from "react";
import { Card, Row, Col, Select, Form, Typography, Table, Checkbox } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { ToWords } from 'to-words';
import { BoolActions, ApplicableActions, NO, NUMERIC_PATTERN, ALPHABETIC_PATTERN, ALPHA_NUMERIC_PATTERN, TaxModeOptions } from '@/utils';
import "../styles/VehicalDetails.css";


const { Item } = Form;

export const VehicalDetails = ({ form, makers = [], makerModels = [], dealers = [], purchaseAs = [], partys = [], brokers = [], vehicleTypes = [],
    vehicleClasses = [], fuels= [], noms = [], vehicalBodyTypes = [], months = [], years = [], manufactureLocations = [], setVehicalType, registerFields, isReadOnly=false
 }) => {
  const [mvTaxMode, setMvTaxMode] = useState();
  const [makerId, setMakerId] = useState();
  const [amount, setAmount] = useState(0);
  const [amountWord, setAmountWord] = useState();

  useEffect(() => {
    if (registerFields) {
        registerFields([
          "maker_id",
          "maker_modal_id",
          "dealer_id",
          "vehicle_color_id",
          "fuel_type",
          "body_type_id",
          "vehicle_class_id",
          "vehicle_category_id",
          "owner_category_id",
          "ownership_type_id",
          "gross_vehicle_weight",
          "unladen_weight",
          "cubic_capacity",
          "no_of_cylinders",
          "seat_capacity",
          "standing_capacity",
          "wheel_base",
          "body_type_description",
          "length",
          "party_id",
          "broker_id",
          "vehicle_type_id",
          "fuel_id",
          "engine_no",
          "seating_capacity",
          "sleeping_capacity",
          "cylinders",
          "laden_weight",
          "horse_power",
          "noms_id",
          "purchase_as_id",
          "color",
          "wheelbase",
          "floor_area",
          "ac_fitted",
          "audio_fitted",
          "video_fitted",
          "manufacture_month",
          "manufacture_year",
          "width",
          "height",
          "garage_address",
          "annual_income",
          "sell_amount",
          "other_criteria",
          "is_imported",
          "vehicle_body_type_id",
          "model_manufactured_location",
          "tax_mode"
        ]);
      }
  }, []);


  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ac_fitted: NO,
      audio_fitted: NO,
      video_fitted: NO,
      is_imported: NO,
      seating_capacity: 0,
      standing_capacity: 0,
      sleeping_capacity: 0,
      cylinders: 0,
      unladen_weight: 0,
      laden_weight: 0,
      horse_power: 0,
      wheelbase: 0,
      cubic_capacity: 0,
      floor_area: 0
    })
  }, []);

  useEffect(() => {
      setAmount(parseFloat(form.getFieldValue('sell_amount') || 0));
  }, [form.getFieldValue('sell_amount')]);

  useEffect(() => {
      setMakerId(form.getFieldValue('maker_id'));
  }, [form.getFieldValue('maker_id')]);

  useEffect(() => {
    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
          currency: true,
          ignoreDecimal: true,
          ignoreZeroCurrency: false,
          doNotAddOnly: false,
          currencyOptions: {
            name: 'Rupee',
            plural: 'Rupees',
            symbol: '₹',
            fractionalUnit: {
              name: 'Paisa',
              plural: 'Paise',
              symbol: '',
            },
          },
        },
    });
    
    let word = toWords.convert(parseFloat(amount || 0));
    setAmountWord(word.charAt(0).toUpperCase() + word.slice(1));
  }, [amount]);
  
  const columnsVehical = [
    { title: 'Tax Type', dataIndex: 'taxType', key: 'taxType' },
    {
      title: 'Tax Mode',
      dataIndex: 'taxMode',
      key: 'taxMode',
      render: () => (
        <Form.Item noStyle={true} name={'tax_mode'} rules={[{ required: true, message: "Please select tax mode" }]}>
          <Select
            value={mvTaxMode}
            onChange={setMvTaxMode}
            placeholder="Select"
            style={{ width: 200 }}
            options={TaxModeOptions.map((val) => ({ label: val, value: val }))}
            disabled={isReadOnly}
            showSearch={true}
            tabIndex={39}
            filterOption={(input, option) =>
                option.label?.toLowerCase()?.includes(input?.toLowerCase())
            }
          />
        </Form.Item>
      ),
    },
  ];
  // Table Data 
  const dataVehical = [{ key: 'mvTax', taxType: 'MV Tax' }];

  const handleInputChange = useCallback((value, name, type = 'alphanumeric') => {
      let cleanValue = value
      if (type === 'numeric') {
          cleanValue = value.replace(NUMERIC_PATTERN, '')
      } else if (type === 'alphabet') {
          cleanValue = value.replace(ALPHABETIC_PATTERN, '')
      } else if (type === 'alphanumeric') {
          cleanValue = value.replace(ALPHA_NUMERIC_PATTERN, '')
      }
      form.setFieldValue(`${name}`, cleanValue);
      if (name === 'sell_amount') {
        setAmount(parseFloat(cleanValue || 0));
      }
  }, [form]);

  const onChangeMakerModel = (value) => {
    const model = makerModels.find((val) => val.id == value);
    form.setFieldsValue({
      cubic_capacity: model.cubic_capacity || 0,
      cylinders: model.cylinders || 0,
      horse_power: model.horse_power || 0,
      laden_weight: model.laden_weight || 0,
      seating_capacity: model.seating_capacity || 0,
      sleeping_capacity: model.sleeping_capacity || 0,
      standing_capacity: model.standing_capacity || 0,
      unladen_weight: model.unladen_weight || 0,
      vehicle_body_type_id: model.vehicle_body_type_id,
      wheelbase: model.wheelbase || 0,
      fuel_id: model.fuel_id,
      length: model.length,
      width: model.width,
      height: model.height,
    });
  }

  return(
    <div className="vehical-details">
      <Card className="labels" title={'Vehicle Details'}>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                  label="Maker"
                  name="maker_id"
                  rules={[{ required: true, message: "Please select Maker" }]}
              >
                  <Select
                      placeholder={"Select Maker"}
                      options={makers.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      onChange={(val) => {
                        setMakerId(val);
                        form.resetFields(['maker_modal_id'])
                      }}
                      disabled={isReadOnly}
                      tabIndex={2}
                  />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                  label="Maker Model"
                  name="maker_modal_id"
                  rules={[{ required: true, message: "Please select Maker's Model" }]}
              >
                  <Select
                      placeholder={"Select Maker's Model"}
                      options={makerModels.filter((val) => val.maker_id == makerId).map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      onChange={onChangeMakerModel}
                      disabled={isReadOnly}
                      tabIndex={3}
                  />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                  label="Dealer"
                  name="dealer_id"
                  rules={[{ required: true, message: "Please select Dealer" }]}
              >
                  <Select
                      placeholder={"Select Dealer"}
                      options={dealers.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      disabled={isReadOnly}
                      tabIndex={4}
                  />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Party'
                name='party_id'
                rules={[{ required: true, message: 'Please select Party' }]}
              >
                <Select
                  placeholder='Select Party'
                  options={partys.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={5}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item 
                label='Broker'
                name='broker_id'
                rules={[{ required: true, message: 'Please select Broker' }]}
              >
                <Select
                  placeholder='Select Broker'
                  options={brokers.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={6}
                />
              </Item>
            </Col>
            
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Vehicle Type'
                name='vehicle_type_id'
                rules={[{ required: true, message: 'Please select Vehicle Type' }]}
              >
                <Select
                  placeholder='Select Vehicle Type'
                  options={vehicleTypes.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  onChange={(value) => {
                    if (setVehicalType) {
                      const type = vehicleTypes.find((vehicleType) => parseInt(vehicleType.id) === parseInt(value));
                      setVehicalType(type);
                    }
                  }}
                  disabled={isReadOnly}
                  tabIndex={7}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Vehicle Class'
                name='vehicle_class_id'
                rules={[{ required: true, message: 'Please select Vehicle Class' }]}
              >
                <Select
                  placeholder='Select Vehicle Class'
                  options={vehicleClasses.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={true}
                  tabIndex={8}
                />
              </Item>
              
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Fuel'
                name='fuel_id'
                rules={[{ required: true, message: 'Please select Fuel' }]}
              >
                <Select
                  placeholder='Select Fuel'
                  options={fuels.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={true}
                  tabIndex={9}
                />
              </Item>
            </Col>
            {/* <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Engine / Motor No'
                name="engine_no"
                rules={[{ required: true, message: "Please enter Engine / Motor No" }]}
              >
                <Input placeholder="Enter Engine / Motor No" disabled={isReadOnly} />
              </Item>
            </Col> */}
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Seating Capacity'
                name="seating_capacity"
                rules={[{ required: true, message: "Please enter seating capacity" }]}
              >
                <Input 
                  
                  placeholder="Enter Seating Capacity" 
                  onChange={(e) => handleInputChange(e.target.value, 'seating_capacity', 'numeric')}
                  disabled={true}
                  maxLength={6}
                  tabIndex={10}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Standing Capacity'
                name="standing_capacity"
                rules={[{ required: true, message: "Please enter standing capacity" }]}
              >
                <Input 
                  placeholder="Enter Standing Capacity"
                  onChange={(e) => handleInputChange(e.target.value, 'standing_capacity', 'numeric')}
                  disabled={true}
                  maxLength={6}
                  tabIndex={11}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Sleeping Capacity'
                name="sleeping_capacity"
                rules={[{ required: true, message: "Please enter sleeping capacity" }]}
                >
                <Input 
                  placeholder="Enter Sleeping Capacity" 
                  onChange={(e) => handleInputChange(e.target.value, 'sleeping_capacity', 'numeric')}
                  disabled={true}
                  maxLength={6}
                  tabIndex={12}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='No of Cylinders'
                name="cylinders"
                rules={[{ required: true, message: "Please enter no. of cylinders" }]}
              >
                <Input 
                  placeholder="Enter No of Cylinders" 
                  onChange={(e) => handleInputChange(e.target.value, 'cylinders', 'numeric')}
                  disabled={true}
                  maxLength={6}
                  tabIndex={13}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Unladen Weight (Kg)'
                rules={[{ required: true, message: "Please enter Unladen Weight" }]}
                name="unladen_weight"
              >
                <Input 
                  placeholder="Enter Unladen Weight (Kg)" 
                  onChange={(e) => handleInputChange(e.target.value, 'unladen_weight', 'numeric')}
                  disabled={true}
                  tabIndex={14}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='laden Weight (Kg)'
                name="laden_weight"
                rules={[{ required: true, message: "Please enter laden Weight" }]}
              >
                <Input
                  placeholder="Enter laden Weight (Kg)"
                  onChange={(e) => handleInputChange(e.target.value, 'laden_weight', 'numeric')}
                  disabled={true}
                  tabIndex={15}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Horse Power (BHL)'
                name="horse_power"
                rules={[ { required: true, message: "Please enter Horse Power" }]}
              >
                <Input
                  placeholder="Enter Horse Power"
                  onChange={(e) => handleInputChange(e.target.value, 'horse_power', 'numeric')}
                  disabled={true}
                  tabIndex={16}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Norms'
                name="noms_id"
                rules={[{ required: true, message: "Please select Norms" }]}
              >
                <Select 
                  placeholder="Select Norms"
                  options={noms.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={17}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Purchase As'
                name="purchase_as_id"
                rules={[{ required: true, message: "Please select Purchase As" }]}
              >
                <Select
                  placeholder="Select Purchase As"
                  options={purchaseAs.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={18}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Color'
                name="color"
                rules={[{ required: true, message: "Please enter Color" }]}
              >
                <Input placeholder="Enter Color" disabled={isReadOnly} tabIndex={19}/>
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                name="wheelbase"
                label='Wheelbase'
              >
                <Input
                  placeholder="Enter Wheelbase"
                  onChange={(e) => handleInputChange(e.target.value, 'wheelbase', 'numeric')}
                  disabled={true}
                  tabIndex={20}
                  />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Cubic capacity'
                name="cubic_capacity"
                rules={[{ required: true, message: "Please enter Cubic Capacity" }]}
              >
                <Input
                  placeholder="Enter Cubic Capacity"
                  onChange={(e) => handleInputChange(e.target.value, 'cubic_capacity', 'numeric')}
                  disabled={true}
                  tabIndex={21}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>  
              <Item
                label='Floor Area (sqm)' 
                name="floor_area"
              >
                <Input
                  placeholder="Enter Floor Area"
                  onChange={(e) => handleInputChange(e.target.value, 'floor_area', 'numeric')}
                  disabled={isReadOnly}
                  tabIndex={22}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='AC Fitted (Yes/No)' 
                name="ac_fitted"
              >
                <Select
                  placeholder="Select"
                  options={BoolActions.map((val) => ({ label: val, value: val }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={23}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Audio Fitted (Yes/No)' 
                name="audio_fitted"
                initialValue={NO}
              >
                <Select
                  placeholder="Select"
                  options={BoolActions.map((val) => ({ label: val, value: val }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={24}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Video Fitted (Yes/No)' 
                name="video_fitted"
                initialValue={NO}
              >
                <Select
                  placeholder="Select"
                  options={BoolActions.map((val) => ({ label: val, value: val }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={25}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                  label='Manufacture Month' 
                  name="manufacture_month_id"
                  rules={[{ required: true, message: "Please enter Manufacture Month" }]}
              >
                  <Select
                      placeholder={"Select Manufacture Month"}
                      options={months?.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      disabled={isReadOnly}
                      tabIndex={26}
                  />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Manufacture Year' 
                name="manufacture_year_id"
                rules={[{ required: true, message: "Please enter Manufacture Year" }]}
              >
                  <Select
                      placeholder={"Select Manufacture Year"}
                      options={years?.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      disabled={isReadOnly}
                      tabIndex={27}
                  />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Length (mm)' 
                name="length"
                rules={[{ required: true, message: "Please enter length" }]}
              >
                <Input
                  placeholder="Enter Length (mm)"
                  onChange={(e) => handleInputChange(e.target.value, 'length', 'numeric')}
                  disabled={true}
                  tabIndex={28}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Width (mm)' 
                name='width'
                rules={[{ required: true, message: "Please enter width" }]}
              >
                <Input
                  placeholder="Enter Width (mm)"
                  onChange={(e) => handleInputChange(e.target.value, 'width', 'numeric')}
                  disabled={true}
                  tabIndex={29}
                />
              </Item>
            </Col>  
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Height (mm)' 
                name='height'
                rules={[{ required: true, message: "Please enter height" }]}
              >
                <Input
                  placeholder="Enter Height (mm)"
                  onChange={(e) => handleInputChange(e.target.value, 'height', 'numeric')}
                  disabled={true}
                  tabIndex={30}
                />
              </Item>
            </Col>  
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Garage Address'
                name='garage_address'
              >
                <Input placeholder="Enter Garage' Address" disabled={isReadOnly} tabIndex={31}/>
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Annual Income' 
                name='annual_income'
              >
                <Input
                  placeholder="Enter Annual Income" 
                  onChange={(e) => handleInputChange(e.target.value, 'annual_income', 'numeric')}
                  disabled={isReadOnly}
                  tabIndex={32}
                />
              </Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Item
                label='Sales Amount'
                name='sell_amount' 
                rules={[{ required: true, message: "Please enter Sales Amount" }]}
              >
                <Input
                  placeholder="Enter Sales Amount" 
                  onChange={(e) => handleInputChange(e.target.value, 'sell_amount', 'numeric')}
                  disabled={isReadOnly}
                  tabIndex={33}
                />
              </Item>
            </Col>
            <Col lg={2} md={2} sm={24} xs={24}>
              <Item label={' '} name='smc' valuePropName="checked">
                <Checkbox tabIndex={34}>SMC</Checkbox>
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{justifyContent: 'center', margin: 16 }}>
            <Typography className="amount-words">
              {amountWord}
            </Typography>
          </Row>
          <Row gutter={[24, 24]}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item label='Other Criteria' name={'other_criteria'}>
                <Select
                  placeholder="Select"
                  options={ApplicableActions.map((val) => ({ label: val, value: val }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={35}
                />
              </Item>
            </Col>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item label='Imported Vehicle' name={'is_imported'} initialValue={NO}>
                <Select
                  placeholder="Select"
                  options={BoolActions.map((val) => ({ label: val, value: val }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={36}
                />
              </Item>
            </Col>
        
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item label='Vehical Body Type' name={'vehicle_body_type_id'} rules={[{ required: true, message: "Please enter vehical body type" }]}>
                <Select 
                  placeholder="Select Vehical Body Type"
                  options={vehicalBodyTypes.map((val) => ({ value: val.id, label: val.name }))}
                  showSearch={true}
                  filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                  disabled={isReadOnly}
                  tabIndex={37}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ justifyContent: 'center', margin: 16 }}>
            <Col lg={8} md={8} sm={24} xs={24}>
              <Item
                label='Model Manufacturer Location'
                name='model_manufactured_location_id'
              >
                  <Select
                      placeholder={"Select Model Manufacturer Location"}
                      options={manufactureLocations?.map((val) => ({ value: val.id, label: val.name }))}
                      showSearch={true}
                      filterOption={(input, option) => (option.label?.toLowerCase()?.includes(input.toLowerCase()))}
                      disabled={isReadOnly}
                      tabIndex={38}
                  />
              </Item>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{justifyContent: 'center', margin: 16 }}>
            <Table
              columns={columnsVehical}
              dataSource={dataVehical}
              pagination={false}
              style={{ width: '50%' }}
              bordered
            />
          </Row>
      </Card>
    </div>
  );
}
