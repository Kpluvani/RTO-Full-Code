import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Col, Row, Flex, Button, Spin, message } from "antd"
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { fetchAllDesignations } from '../../../features/designation/designationSlice';
import { fetchAllWorkCategories } from '../../../features/workCategory/workCategorySlice';
import { fetchAllUserCategories } from '../../../features/userCategory/userCategorySlice';
import { fetchUsers, setPage, setLimit, setSearch, setWhere, updateUserStatus } from '../../../features/user/userSlice';
import "../styles/userRegistration.css";


const UserRegistrationPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { allData: designations } = useSelector((state) => state?.designation || {});
  const { allData: userCategories } = useSelector((state) => state?.userCategory || {});
  const { allData: workCategories } = useSelector((state) => state?.workCategory || {});
  const {
    data = [],
    total,
    page,
    limit,
    search,
    searchCols,
    include,
    exclude,
    loading,
    where,
    error
  } = useSelector((state) => state?.user || {});
  const location = useLocation();
  const rtoId = location?.state?.office;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setWhere({ rto_id: rtoId }));
  }, [rtoId])

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, search, searchCols, include, exclude, where: { ...where, rto_id: rtoId } }));
  }, [page, search, searchCols, include, exclude, limit, where, rtoId]);

  useEffect(() => {
    dispatch(fetchAllDesignations());
    dispatch(fetchAllUserCategories());
    dispatch(fetchAllWorkCategories());
  }, []);

  const blockUnblockUser = async () => {
    const res = await dispatch(updateUserStatus({ id: selectedUser?.id, status: !selectedUser?.is_active }));
    if (res.payload?.error) {
      message.error(res.payload || 'Failed to update status');
    } else {
      message.success(res.payload || 'Update status successfully');
      setSelectedUser((prev) => ({
        ...prev,
        is_active: !prev.is_active
      }));
    }
  }
  
  return (
    <Spin spinning={loading}>
      <div className="container">
        <div className='flex'>
          <h1 className="user-title">User Management</h1>
          {selectedUser?.id ? (<Flex gap="large" justify="flex-end" align='center' className='user-rg-btn'>
            <Button
              color={selectedUser?.is_active ? "danger" : "primary"}
              className={!selectedUser?.is_active ? "user-grn-btn" : ""}
              variant="solid"
              size="large"
              onClick={blockUnblockUser}
            >
              {`Click Here To ${selectedUser?.is_active ? "Block" : "Unblock"} User`}
            </Button>
            {/* <Button className="user-grn-btn" variant="solid" size="large">Click Here To Set IP Address For Login</Button> */}
          </Flex>) : null}
        </div>
        <div className="main-content">
            <Row gutter={24}>
              <Col lg={10} md={24} sm={24} xs={24}>
                <UserTable
                  data={data}
                  loading={loading}
                  total={total}
                  page={page}
                  limit={limit}
                  setPage={setPage}
                  setLimit={setLimit}
                  search={search}
                  setSearch={setSearch}
                  setSelectedUser={setSelectedUser}
                />
              </Col>
              <Col lg={14} md={24} sm={24} xs={24}> 
                <UserForm
                  designations={designations}
                  workCategories={workCategories}
                  userCategories={userCategories}
                  rtoId={rtoId}
                  users={data}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />                
              </Col> 
          </Row>
        </div>
      </div>
    </Spin>
  )
}

export default UserRegistrationPage