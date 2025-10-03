import { Row, Col, Form, Select, Button, Typography, Table, AutoComplete } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getApplicationByOwner, fetchApplications, getApplicationByBroker, getApplicationByParty, getApplicationByDealer } from "@/features/application/applicationSlice";
import { useNavigate } from "react-router-dom";
import { fetchAllOwners } from "@/features/ownerDetails/ownerDetailsSlice";
import { fetchAllParty } from "@/features/party/partySlice";
import { fetchAllBrokers } from "@/features/broker/brokerSlice";
import { fetchAllDealer } from "@/features/dealer/dealerSlice";
import dayjs from "dayjs";

const RegisteredVehicalDetailsPageSearch = () => {
  const { Title } = Typography;
  const { Item } = Form;
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [searchBy, setSearchBy] = useState("Owner");
  const [searchByFieldName, setSearchByFieldName] = useState("owner_name");

  // Redux data
  const { allData: Dealers = [] } = useSelector((state) => state.dealer || {});
  const { allData: Parties = [] } = useSelector((state) => state.party || {});
  const { allData: Brokers = [] } = useSelector((state) => state.broker || {});
  const { allData: Owners = [] } = useSelector((state) => state.owner || {});

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  // Fetch data dynamically when searchBy changes
  useEffect(() => {
    if (searchBy === "Owner") {
      dispatch(fetchAllOwners());
      setSearchByFieldName("owner_name");
    } else if (searchBy === "Dealer") {
      dispatch(fetchAllDealer());
      setSearchByFieldName("name");
    } else if (searchBy === "Party") {
      dispatch(fetchAllParty());
      setSearchByFieldName("name");
    } else if (searchBy === "Broker") {
      dispatch(fetchAllBrokers());
      setSearchByFieldName("name");
    }
  }, [searchBy, dispatch]);

  const cardStyle = {
    background: "#fff",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    fontAlign: "center",
    padding: "1.5rem",
    borderRadius: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  };

  const onSearch = async () => {
      try {
        const values = form.getFieldsValue();
        let response; 
        if (searchBy === "Owner") {
          response = await dispatch(getApplicationByOwner(values));
        } else if (searchBy === "Broker") {
          response = await dispatch(getApplicationByBroker(values));
        } else if (searchBy === "Party") {
          response = await dispatch(getApplicationByParty(values));
        } else if (searchBy === "Dealer") {
          response = await dispatch(getApplicationByDealer(values));
        }

        if (response?.payload?.applications) {
          setSearchResults(response.payload.applications || []);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
  };


  // Table columns
  const ownercolumns = [
    { title: "SR No", dataIndex: "sr_no", key: "sr_no", width: "6%" },
    { title: "File No", dataIndex: "file_no", key: "file_no" },
    { title: "Owner Name", dataIndex: "owner_name", key: "owner_name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    { title: "Application No", dataIndex: "app_no", key: "app_no" },
    { title: "Registration No", dataIndex: "reg_no", key: "reg_no" },
    // { title: "Purpose", dataIndex: "purpose", key: "purpose" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (action, record) => (
        <Button
          type="primary"
          className="view-details-button"
          onClick={() => {
            if (action) {
              console.log('action>>>', action);
              
              navigate(`/register-vehical-details`, { state: { applicationId: action?.id } });
            }
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const brokercolumns = [
    { title: "SR No", dataIndex: "sr_no", key: "sr_no", width: "6%" },
    { title: "File No", dataIndex: "file_no", key: "file_no" },
    { title: "Broker Name", dataIndex: "broker_name", key: "broker_name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    { title: "Application No", dataIndex: "app_no", key: "app_no" },
    { title: "Registration No", dataIndex: "reg_no", key: "reg_no" },
    // { title: "Purpose", dataIndex: "purpose", key: "purpose" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (action, record) => (
        <Button
          type="primary"
          className="view-details-button"
          onClick={() => {
            if (action) {
              navigate(`/register-vehical-details`, { state: { applicationId: action.id } });
            }
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const partycolumns = [
    { title: "SR No", dataIndex: "sr_no", key: "sr_no", width: "6%" },
    { title: "File No", dataIndex: "file_no", key: "file_no" },
    { title: "Party Name", dataIndex: "party_name", key: "party_name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    { title: "Application No", dataIndex: "app_no", key: "app_no" },
    { title: "Registration No", dataIndex: "reg_no", key: "reg_no" },
    // { title: "Purpose", dataIndex: "purpose", key: "purpose" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (action, record) => (
        <Button
          type="primary"
          className="view-details-button"
          onClick={() => {
            if (action) {
              navigate(`/register-vehical-details`, { state: { applicationId: action.id } });
            }
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const dealercolumns = [
    { title: "SR No", dataIndex: "sr_no", key: "sr_no", width: "6%" },
    { title: "File No", dataIndex: "file_no", key: "file_no" },
    { title: "Dealer Name", dataIndex: "dealer_name", key: "dealer_name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Mobile No", dataIndex: "mobile_no", key: "mobile_no" },
    { title: "Application No", dataIndex: "app_no", key: "app_no" },
    { title: "Registration No", dataIndex: "reg_no", key: "reg_no" },
    // { title: "Purpose", dataIndex: "purpose", key: "purpose" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (action, record) => (
        <Button
          type="primary"
          className="view-details-button"
          onClick={() => {
            if (action) {
              navigate(`/register-vehical-details`, { state: { applicationId: action.id } });
            }
          }}
        >
          View Details
        </Button>
      ),
    },
  ];
  // Prepare table data
  const ownerData = useMemo(() => {
    return searchResults.map((item, index) => ({
      key: index,
      id: item.id,
      sr_no: index + 1,
      file_no: item.file_number || "_",
      owner_name: item?.OwnerDetail?.owner_name || "_",
      date: dayjs(item?.application_date)?.format("DD-MM-YYYY") || "_",
      mobile_no: item?.OwnerDetail?.mobile_number || "_",
      app_no: item.application_number || "_",
      reg_no: item?.registration_type_id || "_",
      // purpose: item?.VehicleDetail?.vehicle_no || "_",
    }));
  }, [searchResults]);

  const dealerData = useMemo(() => {
    return searchResults.map((item, index) => ({
      key: index,
      id: item.id,
      sr_no: index + 1,
      file_no: item.file_number || "_",
      dealer_name: item?.Dealer?.name || "_",
      date: dayjs(item?.application_date)?.format("DD-MM-YYYY") || "_",
      mobile_no: item?.OwnerDetail?.mobile_number || "_",
      app_no: item.application_number || "_",
      reg_no: item?.registration_type_id || "_",
      // purpose: item?.VehicleDetail?.vehicle_no || "_",
    }));
  }, [searchResults]);

  const partyData = useMemo(() => {
    return searchResults.map((item, index) => ({
      key: index,
      id: item.id,
      sr_no: index + 1,
      file_no: item.file_number || "_",
      party_name: item?.Party?.name || "_",
      date: dayjs(item?.application_date)?.format("DD-MM-YYYY") || "_",
      mobile_no: item?.OwnerDetail?.mobile_number || "_",
      app_no: item.application_number || "_",
      reg_no: item?.registration_type_id || "_",
      // purpose: item?.VehicleDetail?.vehicle_no || "_",
    }));
  }, [searchResults]);

  const brokerData = useMemo(() => {
    return searchResults.map((item, index) => ({
      key: index,
      id: item.id,
      sr_no: index + 1,
      file_no: item.file_number || "_",
      broker_name: item?.Broker?.name || "_",
      date: dayjs(item?.application_date)?.format("DD-MM-YYYY") || "_",
      mobile_no: item?.OwnerDetail?.mobile_number || "_",
      app_no: item.application_number || "_",
      reg_no: item?.registration_type_id || "_",
      // purpose: item?.VehicleDetail?.vehicle_no || "_",
    }));
  }, [searchResults]);

  const autoCompleteOptions = useMemo(() => {
    if (searchBy === "Owner") return Owners?.map((o) => ({ value: o.owner_name, label: o.owner_name }));
    if (searchBy === "Dealer") return Dealers?.map((d) => ({ value: d.name, label: d.name }));
    if (searchBy === "Party") return Parties?.map((p) => ({ value: p.name, label: p.name }));
    if (searchBy === "Broker") return Brokers?.map((b) => ({ value: b.name, label: b.name }));
    return [];
  }, [searchBy, Owners, Dealers, Parties, Brokers]);

  return (
    <>
      <Form form={form} layout="vertical">
        <Title level={4} style={{ marginBottom: "20px", textAlign: "center" }}>
          Registered Application Details
        </Title>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={cardStyle}>
            <Row gutter={16}>
              <Col sm={30} md={26} lg={24}>              
                  <Item className="form-item" label="Search By" name="searchBy" initialValue="Owner">
                  <Select
                    className="form-item"
                    onChange={(val) => {
                      setSearchBy(val);
                      form.resetFields([searchByFieldName]); // Reset AutoComplete field
                      setSearchResults([]); // Clear previous search results
                    }}
                  >
                    <Option value="Owner">Owner</Option>
                    <Option value="Dealer">Dealer</Option>
                    <Option value="Broker">Broker</Option>
                    <Option value="Party">Party</Option>
                  </Select>
                </Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col sm={30} md={26} lg={24}>
                <Item className="form-item" label={`Enter ${searchBy}`} name={searchByFieldName}>
                  <AutoComplete
                    className="auto-complete"
                    options={autoCompleteOptions}
                    placeholder={`Search ${searchBy} Name`}
                    showSearch
                    filterOption={(input, option) =>
                      option?.value?.toLowerCase().includes(input.toLowerCase())
                    }
                    onSelect={(value) => console.log(`Selected ${searchBy}:`, value)}
                  />
                </Item>
              </Col>
            </Row>

            <Row gutter={24} style={{ display: "flex", justifyContent: 'center', textAlign: "center", }}>
                <Button type="primary" onClick={onSearch}>
                  Search
                </Button>
            </Row>
          </div>
        </div>
          {/* 🔹 Dynamic Table */}
          <Title level={4} style={{ marginTop: "20px" }}>
            Result
          </Title>
          <Table
            className="custom-table"
            columns={
              searchBy === "Owner"
                ? ownercolumns
                : searchBy === "Broker"
                ? brokercolumns
                : searchBy === "Party"
                ? partycolumns
                : dealercolumns
            }
            dataSource={
              searchBy === "Owner"
                ? ownerData
                : searchBy === "Broker"
                ? brokerData
                : searchBy === "Party"
                ? partyData
                : dealerData
            }
            bordered
          />
        
      </Form>
    </>
    
  );
};

export default RegisteredVehicalDetailsPageSearch;
