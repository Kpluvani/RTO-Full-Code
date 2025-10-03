import { Form, Typography, Row, Col, Button, Select, message } from "antd";
import { useDispatch, useSelector} from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchAllDealer } from "@/features/dealer/dealerSlice";
import { fetchAllBrokers } from "@/features/broker/brokerSlice";
import { fetchAllParty } from "@/features/party/partySlice";
import { getBulkReceiptsByCategory, saveBulkReceiptEntry } from "@/features/bulkReceipt/bulkReceiptSlice";
import { fetchAllRembursement } from "@/features/rembursement/rembursementSlice";
import { fetchAllSubAgent } from "@/features/subAgent/subAgentSlice";
import { BulkReceiptList } from '@/Components/BulkReceiptList/pages';
import { ReceiptTransactionHistory } from '@/Components/ReceiptTransactionHistory/pages';
import { ReceiptAccountCategories, IncomeCategoryType, ExpenseCategoryType } from "@/utils";

const { Title } = Typography;
const { Item } = Form;

export const BulkReciept = ({ form }) => {
  const [searchByFieldName, setSearchByFieldName] = useState("id");
  const [searchBy, setSearchBy] = useState(IncomeCategoryType.Dealer);
  const [id, setId] = useState(null);
  const [data, setData] = useState();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { allData : dealers = [] } = useSelector((state) => state.dealer || {});
  const { allData : brokers = [] } = useSelector((state) => state.broker || {});
  const { allData : parties = [] } = useSelector((state) => state.party || {});
  const { allData : subAgents = [] } = useSelector((state) => state.subAgent || {});
  const { allData : rembursements = [] } = useSelector((state) => state.rembursement || {});
  const { data : bulkReceipts = [] } = useSelector((state) => state.bulkReceipt || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableConfig = {
    [IncomeCategoryType.Dealer]: {
      nameKey: (item) => item?.IncExpName || "_",
      nameLabel: "Dealer Name",
    },
    [IncomeCategoryType.Broker]: {
      nameKey: (item) => item?.IncExpName || "_",
      nameLabel: "Broker Name",
    },
    [IncomeCategoryType.Party]: {
      nameKey: (item) => item?.IncExpName || "_",
      nameLabel: "Party Name",
    },
    [ExpenseCategoryType.SubAgent] : {
      nameKey: (item) => item?.IncExpName || "_",
      nameLabel: "Sub Agent Name",
    },
    [ExpenseCategoryType.Rembursement]: {
      nameKey: (item) => item?.IncExpName || "_",
      nameLabel: "Rembursement Name",
    },
  };

  useEffect(() => {
    const fetchMap = {
      [IncomeCategoryType.Dealer]: fetchAllDealer,
      [IncomeCategoryType.Broker]: fetchAllBrokers,
      [IncomeCategoryType.Party]: fetchAllParty,
      [ExpenseCategoryType.SubAgent]: fetchAllSubAgent,
      [ExpenseCategoryType.Rembursement]: fetchAllRembursement,
    };

    if (fetchMap[searchBy]) {
      dispatch(fetchMap[searchBy]());
    }
  }, [searchBy, dispatch]);

  useEffect(() => {
    if (bulkReceipts) {
      const receipts = (bulkReceipts.applicationReceipt || []).map((item) => {
        return ({
          ...item,
          paymentMode: item.paymentMode || null,
          transactionId: item.transactionId || "",
          purpose: item.purpose || null,
          selected: !!item.selected
        })
      })
      setData(receipts);
      setTransactionHistory(bulkReceipts.transactionHistory || []);
    }
  }, [bulkReceipts]);

  const onSearch = async () => {
    try {
        const values = form.getFieldsValue();
        let response;
        const allowedSearch = [
            IncomeCategoryType.Broker,
            IncomeCategoryType.Dealer,
            IncomeCategoryType.Party,
            ExpenseCategoryType.SubAgent,
            ExpenseCategoryType.Rembursement
        ];
        if (allowedSearch.includes(searchBy)) {
            await dispatch(getBulkReceiptsByCategory(values));
        }
        } catch (err) {
            console.error("Search error:", err);
            setData([]);
            setTransactionHistory([]);
        }
  };

  const selectOptions = useMemo(() => {
    switch (searchBy) {
        case IncomeCategoryType.Broker:
            return brokers.map((b)=> ({ value: b.id , label : b.name}));
        case IncomeCategoryType.Party:
            return parties.map((p)=> ({ value: p.id , label : p.name}));
        case IncomeCategoryType.Dealer:
            return dealers.map((d)=> ({ value: d.id , label : d.name}));
        case ExpenseCategoryType.SubAgent:
            return subAgents.map((s)=> ({ value: s.id , label : s.name}));
        case ExpenseCategoryType.Rembursement:
            return rembursements.map((r)=> ({ value: r.id , label : r.name}));
        default:
            return [];
    }
  }, [searchBy, parties, brokers, dealers, subAgents, rembursements]);

  const onClickPay = async () => {
    const receipts = data.filter((val) => val.selected).map(({ id, payAmount, ...rest }) => ({ ...rest, amount: payAmount }));
    const res = await dispatch(saveBulkReceiptEntry({ id, searchBy, receipts }));
    if (res.error) {
      message.error(res.payload || 'Failed to pay bulk receipt');
    } else {
      message.success(res.payload || 'Bulk Receipt paid successfully');
    }
  }
  
  return (
    <div className={'bulk-receipt'}>
      <Form form={form} layout="vertical">
          <Title level={4} className="title">Bulk Receipt</Title>
          <Row gutter={16}>
            <Col sm={24} md={12} lg={8}>
              <Item
                label="Search By"
                name="searchBy"
              >
                <Select 
                    placeholder="Select"
                    onChange={(value) => {
                        setSearchBy(value);
                        form.resetFields([searchByFieldName]);
                    }}
                    options={ReceiptAccountCategories.map((val) => ({ value: val, label: val }))}
                    showSearch={true}
                    filterOption={(input, option) =>
                        option.label?.toLowerCase()?.includes(input?.toLowerCase())
                    }
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={24} md={12} lg={8}>
              <Item
                label={`Select ${searchBy}`}
                name={searchByFieldName}
              >
                <Select 
                    className="auto-complete"
                    options={selectOptions}
                    placeholder={`select ${searchBy}`}
                    showSearch={true}
                    filterOption={(input, option) =>
                        option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        setId(value);
                    }}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={24} md={12} lg={8}>
              <Button type="primary" className="button" onClick={onSearch}>Search</Button>
            </Col>
          </Row>

          <BulkReceiptList
            data={data || []}
            setData={setData}
            tableConfig={tableConfig}
            searchBy={searchBy}
          />

          <Row gutter={16} justify="center" className="btn-wrapper">
            <Col><Button type="primary" className="button" onClick={onClickPay}>Pay</Button></Col>
            <Col><Button type="primary" className="button" onClick={() => navigate('/home')}>Back To Home</Button></Col>
          </Row>

          <ReceiptTransactionHistory receiptHistory={transactionHistory || []}/>
      </Form>
    </div>
  );
};