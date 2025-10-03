import { useState, useEffect } from 'react';
import { fetchApproveByRtoApplications, saveBulkSendToRtoEntry, resetApplications } from '@/features/bulkApproveByRtoApplication/getBulkApproveByRtoApplicationSlice';
import { fetchAllBrokers } from '@/features/broker/brokerSlice';
import { fetchAllDealer } from '@/features/dealer/dealerSlice';
import { fetchAllParty } from '@/features/party/partySlice';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/approve.css';

import { Typography, Form, Flex, Col, Select, Button, Table, Checkbox, message, } from 'antd';

const { Title } = Typography;
const { Item } = Form;

const BulkApproveByRto = () => {
    const dispatch = useDispatch ();
    const [ searchBy, setSearchby ] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const { allData : broker = [] }=useSelector((state)=>state.broker || {});
    const { allData : dealer = []}=useSelector((state)=> state.dealer || {});
    const { allData : party = []}=useSelector((state) => state.party || {});
    const { data : applicationData = [] } = useSelector((state) => state.bulkApproveByRtoApplication || {});
   
    useEffect(() => {
        dispatch(fetchApproveByRtoApplications());
    }, []);

    const handleSearchBy = (value) => {
    setSearchby(value);
    setSelectedOption(null);
        if (value === 'Dealer') {
            dispatch(fetchAllDealer());
        } else if (value === 'Broker') {
            dispatch(fetchAllBrokers());
        } else if (value === 'Party') {
            dispatch(fetchAllParty());
        }
    }

    const handleSearchClick = () => {
        if (!searchBy || !selectedOption) return
        
        let where = {}
        if (searchBy === 'Dealer') {
            where = { dealer_id: selectedOption }
        } else if (searchBy === 'Broker') {
            where = { broker_id: selectedOption }
        } else if (searchBy === 'Party') {
            where = { party_id: selectedOption }
        }
        dispatch(fetchApproveByRtoApplications({ where })).unwrap().then((res) => {
            if (!res || !res.data || res?.data?.length === 0) {
                message.info(res?.message || 'No applications found.');
            }
            setSelectedRows([]);
            setSelectAll(false);
        })
        .catch(err => {
            message.error(err.message || 'Failed to fetch applications.');
        })
    }

    let Options = []
    if (searchBy === 'Dealer') {
        Options = dealer.map(item => ({ value: item.id, label: item.name }));
    } else if (searchBy === 'Broker') {
        Options = broker.map(item => ({ value: item.id, label: item.name }));
    } else if (searchBy === 'Party') {
        Options = party.map(item => ({ value: item.id, label: item.name}));
    }

    const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
        setSelectedRows(applicationData.map((_, index) => index));
    } else {
        setSelectedRows([]);
    }}

    const handleCheckboxChange = (index) => (e) => {
        const checked = e.target.checked;
        const newSelectedRows = checked ? [...selectedRows, index] : selectedRows.filter(i => i !== index);
        setSelectedRows(newSelectedRows);
        setSelectAll(newSelectedRows.length === applicationData.length);
    }

    const handleApprovedByRto = async () => {
        if (selectedRows.length === 0) {
            message.warning('Please select at least one application');
            return
        }
        const selectedApplications = selectedRows.map(index => applicationData[index])
        const payload = selectedApplications.map(app => ({
            id: app.id,
            data: {
                process_id: app.Process?.id,
                remark: '',
                file_movement_type: "next",
            }
        }))
        try {
            const res = await dispatch(saveBulkSendToRtoEntry(payload)).unwrap()
            if (res?.result?.length > 0) {
                const successCount = res.result.filter( r => r.success).length;
                const failCount = res.result.length - successCount;
                if (successCount > 0) {
                    message.success(`${successCount} Application moved successfully`);
                }
                if (failCount > 0) {
                    message.error(`${failCount} Application failed to move`);
                }
            } else {
                message.success(res?.message || 'Application approved Sucessfully');
            }
            dispatch(resetApplications());
            setSelectedRows([]);
            setSelectAll(false);
        } catch (err) {
            message.error(err.message || 'Failed to approve applications.');
        }
    }

    const Data = applicationData.map((item, index) => ({
        key: item.id,
        srno: index + 1,
        appno: item.application_number || '_',
        pname: item?.party?.name || '_',
        chano: item?.VehicleDetail?.chassis_no || '_',
        engno: item?.VehicleDetail?.engine_no || '_',
        cls: item?.VehicleDetail?.class || '_',
        smc: item?.smc || '_',
        adprf: item?.address_proof || '_',
        vhclno: item?.VehicleDetail?.vehicle_no || '_',
        actn: '',
    }))


    const column = [
        { title:'SR No', dataIndex:'srno', key:'srno', width:'6%', align:'start', },
        { title:'Application No', dataIndex:'appno', key:'appno', width:'', align:'start', },
        { title:"Party's Name", dataIndex:'pname', key:'pname', width:'', align:'start', },
        { title:'Chassis No', dataIndex:'chano', key:'chano', width:'', align:'start', },
        { title:'Engine No', dataIndex:'engno', key:'engno', width:'', align:'start', },
        { title:'Class', dataIndex:'cls', key:'cls', width:'', align:'start', },
        { title:'SMC', dataIndex:'smc', key:'smc', width:'', align:'start', },
        { title:'Address Proof', dataIndex:'adprf', key:'adprf', width:'', align:'start', },
        { title:'Vehicle No', dataIndex:'vhclno', key:'vhclno', width:'', align:'start', },
        { title: (
             <>
                <Checkbox 
                    checked={selectAll} 
                    onChange={handleSelectAllChange} 
                    style={{ marginRight:'8px'}} 
                /> 
                    Action&nbsp;
            </>
            ),
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
    ]

  return (
    <>
        <div className="H2-heading-btm-1">
            <Title level={2} className='abr-blu-titl' >Approve By RTO</Title>
        </div>

        <Form>
            <Col lg={12} md={18} sm={24} xs={24}>
                <Item >
                    <Title level={5} >Search by</Title>
                    <Select 
                        size='large' 
                        placeholder='Select Search by'
                        options={[
                            { value: 'Dealer', label: 'Dealer' },
                            { value: 'Broker', label: 'Broker' },
                            { value: 'Party', label: 'Party' },
                        ]}
                        onChange={handleSearchBy} 
                    >
                    </Select>
                </Item>
            </Col>

            <Col lg={12} md={18} sm={24} xs={24}>
                <Item >
                    <Title level={5} >Select</Title>
                    <Select 
                        showSearch 
                        size='large' 
                        placeholder={`Select ${searchBy} Name`}
                        options={Options}
                        value={selectedOption} 
                        onChange={(value) => setSelectedOption(value)}
                        filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                        } 
                    />
                </Item> 
            </Col>

            <Button className='abr-srch-btn' type='primary' size='large' onClick={handleSearchClick}>Search</Button>
        </Form>

        <div className="H2-heading-tp-1" >
            <Title level={2} className='abr-blu-titl' >Result</Title>
        </div>

        <Table style={{ width:'100%'}} columns={column} dataSource={Data} pagination={false} bordered />

        <Flex className='str-srhc-btn' horizontal justify='center'>
            <Button size='large' type='primary' style={{padding:'1rem 2rem 1rem 2rem'}} onClick={handleApprovedByRto} >Approve By RTO</Button>
        </Flex>
        
    </>
  )
}

export default BulkApproveByRto;