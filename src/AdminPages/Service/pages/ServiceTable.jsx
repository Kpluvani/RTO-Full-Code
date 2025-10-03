import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Table, Space, Input, message, Popconfirm, Row, Col, Switch, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteService, updateServiceStatus } from '../../../features/service/serviceSlice';
import { fetchAllWorkCategories } from "../../../features/workCategory/workCategorySlice";
import { fetchAllVehicalType } from "../../../features/vehicalType/vehicalTypeSlice";

export const ServiceTable = ({ data, total, page, limit, setPage, setLimit, loading, search = "", setSearch, handleEdit }) => {
  const [searchStr, setSearchStr] = useState(search);
  const dispatch = useDispatch();
  const workCategories = useSelector(state => state?.workCategory?.allData || []);
  const vehicalType = useSelector(state => state?.vehicalType?.allData || []);
  const [newData, setNewData] = useState([]);

  useEffect(() => {
      dispatch(fetchAllWorkCategories());
      dispatch(fetchAllVehicalType());
  }, []);

  useEffect(() => {
    const newData = data?.map((val) => {
      return {
        ...val,
        work_category: workCategories.find((data) => data?.id === val?.work_category_id)?.name || '',
        vehicle_type: vehicalType.find((data) => data?.id === val?.vehicle_type_id)?.name || '',
      };
    });
    setNewData(newData);
  }, [workCategories, vehicalType, data]);

  useEffect(() => {
    setSearchStr(search);
  }, [search]);

  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Work Category",
      dataIndex: "work_category",
      key: "work_category",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicle_type",
      key: "vehicle_type",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Is Show Work Done",
      dataIndex: "is_show_work_done",
      key: "is_show_work_done",
      render: (value, record) => {
        return (
          <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>
        )
      },
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
            const res = await dispatch(updateServiceStatus({ id: record.id, status: checked }));
            
            if (res?.error) {
              message.error(res.payload || 'Failed to update status');
            } else {              
              message.success(res.payload || 'Status updated');
            }
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this Service?"
            onConfirm={async () => {
              const res = await dispatch(deleteService(record.id));
              if (res.error) {
                message.error(res.payload || 'Failed to delete Service');
              } else {
                message.success(res.payload || 'Service delete successfully');
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
              placeholder="Search Service"
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
          dataSource={newData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content', y: 'var(--table-scroll-height, 406px)' }}
          pagination={{
            size: 'default',
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