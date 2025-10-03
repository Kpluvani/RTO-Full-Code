import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Table, Space, Input, message, Popconfirm, Row, Col, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteMakerModel, updateMakerModelStatus } from '../../../features/MakerModel/MakerModelSlice';
import { fetchAllMaker } from "../../../features/maker/makerSlice";
import { fetchAllVehicalBodyTypes } from "@/features/vehicalBodyType/vehicalBodyTypeSlice";

export const MakerModelTable = ({ data, total, page, limit, setPage, setLimit, loading, search = "", setSearch, handleEdit }) => {
  const [searchStr, setSearchStr] = useState(search);
  const [newdata,setnewdata]=useState([]);
  const dispatch = useDispatch();


  const makers = useSelector((state) => state.maker?.allData || []);

  useEffect(()=> {
    dispatch(fetchAllMaker());
    dispatch(fetchAllVehicalBodyTypes());
  },[]);

  useEffect(() => {
    console.log('Fetched makers:', makers);
  }, [makers]);

  useEffect(()=>{
    const newdata = data?.map((val)=>{
      return{
        ...val, 
        maker: makers.find((data)=>data?.id === val?.maker_id) || ' ',
      };
      });

  
    setnewdata(newdata)
  },[data ,  makers, searchStr]);


  useEffect(() => {
    setSearchStr(search);
  }, [search]);

  
  const columns = [
    {
      title: "Maker Model Name",
      dataIndex: "name",
      key: "MakerModel Name",
    },
    {
     title: "Maker",
     dataIndex: "maker",
     key: "maker",
     render: (maker) => maker?.name || "N/A"
    },
    {
     title: "Status",
     dataIndex: "status",
     key: "status",
     render: (status, record) => (
       <Switch
         checked={!!status}
         size="small"
         // checkedChildren="Active"
         // unCheckedChildren="Inactive"
         onChange={async (checked) => {
           // Dispatch thunk to update status
           const res = await dispatch(updateMakerModelStatus({ id: record.id, status: checked }));
           if (res.error) {
             message.error(res.payload || 'Failed to update status');
           } else {
             message.success(res.payload || 'Status updated');
           }
         }}
       />
     ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this MakerModel?"
            onConfirm={async () => {
              const res = await dispatch(deleteMakerModel(record.id));
              if (res.error) {
                message.error(res.payload || 'Failed to delete MakerModel');
              } else {
                message.success(res.payload || 'MakerModel delete successfully');
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Search MakerModel"
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
              onSearch={(val) => {
                dispatch(setSearch(val));
                dispatch(setPage(1));
              }}
              allowClear
            />
          </Col>
        </Row>

        <Table
          size="small"
          bordered={true}
          columns={columns}
          dataSource={newdata}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content', y: 'var(--table-scroll-height, 406px)' }}
          pagination={{
            current: page,
            total: total,
            pageSize: limit,
            showSizeChanger: true,
            pageSizeOptions: ["1", "10", "20", "50", "100"],
            onChange: (val) => dispatch(setPage(val)),
            onShowSizeChange: (curr, size) => {
              dispatch(setLimit(size));
              dispatch(setPage(curr));
            }
          }}
        />
      </Card>
    </div>
  );
};