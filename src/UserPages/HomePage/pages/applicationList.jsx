import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Card, Table, Button } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { setPage, setLimit, setSearch, fetchApplications } from '@/features/application/applicationSlice';
import { DateFormat, convertUTCToIST, Status } from '@/utils';
import '../styles/application.css';

const StatusBColor = {
  [Status.InProcess]: '#D1E7DD',
  [Status.OnHold]: '#FFF3CD',
  [Status.Completed]: '#D1E7DD',
  [Status.Skipped]: '#FFCDCD'
}
const StatusColor = {
  [Status.InProcess]: '#0F5132',
  [Status.OnHold]: '#664D03',
  [Status.Completed]: '#0F5132',
  [Status.Skipped]: '#591818'
}

export const ApplicationList = ({ applicationNo, workType }) => {
  const {
    data = [],
    total,
    page,
    limit,
    search,
    searchCols,
    loading,
    error
  } = useSelector((state) => state?.application || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchApplications({ page, limit, search, searchCols, applicationNo, workType }));
  }, [page, limit, search, searchCols, workType, applicationNo]);

  const handleSearchChange = (value) => {
    dispatch(setSearch(value));
    dispatch(setPage(1)); // Reset to first page on new search
  };

  const processedData = useMemo(() => {
    return data?.map((item, index) => ({
        key: item.id,
        srNo: (page - 1) * limit + index + 1,
        applicationNo: item.application_number,
        applicationDate: convertUTCToIST(item.application_date).format(DateFormat),
        vehicleNo: item?.VehicleDetail?.vehicle_no || 'New',
        lastRemark: item?.ApplicationTracking?.[0]?.remark || '-',
        movementSrNo: item?.ApplicationTracking?.length || 0,
        purpose: item?.Process?.name || '—',
        status: item?.status || '—',
        action: item || {},
    }));
  }, [data]);

  const columns = [
    {
      title: "SR No",
      dataIndex: "srNo",
      key: "srNo",
      width: 80,
      render: (text) => <div>{text}</div>
    },
    {
      title: (
        <div>
          <div>Application No</div>
          <Input
            size="small"
            placeholder="Search"
            className="searchColumn"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      ),
      dataIndex: "applicationNo",
      key: "applicationNo",
      render: (text) => <div>{text}</div>
    },
    {
      title: "Application Date",
      dataIndex: "applicationDate",
      key: "applicationDate",
      width: 150,
      render: (text) => <div>{text}</div>
    },
    {
      title: (
        <div>
          <div>Vehicle No</div>
          <Input
            size="small"
            placeholder="Search"
            className="searchColumn"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      ),
      dataIndex: "vehicleNo",
      key: "vehicleNo",
      render: (text) => <div>{text}</div>
    },
    {
      title: "Last Remark",
      dataIndex: "lastRemark",
      key: "lastRemark",
      render: (text) => <div>{text}</div>
    },
    {
      title: "Movement Sr No.",
      dataIndex: "movementSrNo",
      key: "movementSrNo",
      render: (text) => <div>{text}</div>
    },
    {
      title: (
        <div>
          <div>Purpose</div>
          <Input
            size="small"
            placeholder="Search"
            className="searchColumn"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      ),
      dataIndex: "purpose",
      key: "purpose",
      render: (text) => <div>{text}</div>
    },
    {
      title: (
        <div>
          <div>Status</div>
          <Input
            size="small"
            placeholder="Search"
            className="searchColumn"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      ),
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div style={{ background: StatusBColor[text], color: StatusColor[text], fontWeight: 500 }}>
          {text}
        </div>
      )
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (action, record) => (
        <div>
          <Button
            type="primary"
            style={{ backgroundColor: "#1677ff", borderRadius: "4px" }}
            onClick={() => navigate(`/${action.Process?.key}`, { state: { applicationId: action.id } })}
          >
            {action.Process?.name || '  '}
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card style={{ marginTop: 24 }} className="application-list">
      <Table
        columns={columns}
        dataSource={processedData}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, pageSize) => {
            dispatch(setPage(page));
            dispatch(setLimit(pageSize));
          }
        }}
        bordered
        size="middle"
        rowClassName={() => "custom-row"}
        style={{ border: "1px solid #e5e5e5" }}
        locale={{
          emptyText: loading ? 'Loading...' : 'No Data Found',
        }}
      />
    </Card>
  );
};

export default ApplicationList;
