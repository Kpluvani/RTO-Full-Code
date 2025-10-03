import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Table, Tag } from "antd";
import { StepBackwardOutlined, CaretLeftOutlined, CaretRightOutlined, StepForwardOutlined, EditOutlined } from "@ant-design/icons";
import { fetchUserById } from '../../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';


export const UserTable = ({ data, total, page, limit, setPage, setLimit, loading, search = "", setSearch, setSelectedUser }) => {
  const dispatch = useDispatch();

  const columns = useMemo(() => ([
  {
    title: 'SR No',
    dataIndex: 'srNo',
    key: 'srNo',
    width: '20%',
    align: 'start',
  },
  {
    title: 'User ID',
    dataIndex: 'user_name',
    key: 'user_name',
    align: 'start'
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    align: 'center',
    width: '20%',
    render: (value, record) => {
      return (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Blocked'}</Tag>
      )
    },
  },
  {
    title: 'Modify',
    key: 'modify',
    width: '10%',
    align: 'start',
    dataIndex: 'id',
    render: (value, record) => {
      const onEdit = async () => {
        const res = await dispatch(fetchUserById(value));
        setSelectedUser(res.payload);
      }
      return (
        <Button color='primary' variant='link' style={{ fontSize:'1.2rem'}} onClick={onEdit}><EditOutlined /></Button>
      )
    },
  },
]), []);

  return (
    <div className="main-card1">
        <div className="card1-body">
            <h2 className='user-sub-title'>User List</h2>
            <div className="Adm-blu-table-div" >
                {/* <div className="Adm-blu-table-title">User List</div> */}
                <Table
                    size='small'
                    rowKey="srno"
                    bordered={true}
                    columns={columns}
                    dataSource={data.map((val, index) => ({ ...val, srNo: index + 1 }))}
                    locale={{ emptyText:(<span className="Adm-blu-table-empty"> No Records Found.</span>),}}
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
                
                {/* <div className='Adm-list-blu-btn'>  
                    <Button gap="small" size='large' color="primary" variant="solid"><StepBackwardOutlined /></Button>
                    <Button gap="small" size='large' color="primary" variant="solid"><CaretLeftOutlined /></Button>
                    <Button gap="small" size='large' color="primary" variant="solid"><CaretRightOutlined /></Button>
                    <Button gap="small" size='large' color="primary" variant="solid"><StepForwardOutlined /></Button>
                </div> */}
            </div>
        </div>
    </div>
  )
}
