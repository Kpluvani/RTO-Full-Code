import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Button, Card, Table, Space, Input, message, Popconfirm, Row, Col, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteWorkCategory, updateWorkCategoryStatus } from '../../../features/workCategory/workCategorySlice';

export const WorkCategoryTable = ({ data, total, page, limit, setPage, setLimit, loading, search = "", setSearch, handleEdit }) => {
  const [searchStr, setSearchStr] = useState(search);
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchStr(search);
  }, [search]);

  const columns = [
    {
      title: "Work Category Name",
      dataIndex: "name",
      key: "name",
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
            const res = await dispatch(updateWorkCategoryStatus({ id: record.id, status: checked }));
            
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
            title="Are you sure to delete this Work Category?"
            onConfirm={async () => {
              const res = await dispatch(deleteWorkCategory(record.id));
              if (res.error) {
                message.error(res.payload || 'Failed to delete Work Category');
              } else {
                message.success(res.payload || 'Work Category delete successfully');
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
              placeholder="Search Work Category"
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
          dataSource={data}
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