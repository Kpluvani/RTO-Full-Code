import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UserCategoryTable } from './UserCategoryTable';
import { UserCategoryModal } from './UserCategoryModal';
import { setPage, setLimit, setSearch, fetchUserCategory } from '../../../features/userCategory/userCategorySlice';
import '../styles/userCategory.css';

const UserCategoryPage = () => {
    const [selectedUserCategory, setSelectedUserCategory] = useState(null);
    const [visible, setVisible] = useState(false);
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
        error
    } = useSelector((state) => state?.userCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserCategory({ page, limit, search, searchCols, include, exclude }));
    }, [page, search, searchCols, include, exclude, limit]);

    useEffect(() => {
        if (error) {
            message.error(error?.message || error);
        }
    }, [error]);

    const handleAddNew = () => {
        setVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedUserCategory(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedUserCategory(null);
    }

    return (
        <div>
            <h1 className="user-category-type-title">User Category</h1>
            <div className="add-user-category-type">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <UserCategoryTable
                data={data}
                loading={loading}
                total={total}
                page={page}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
                search={search}
                setSearch={setSearch}
                handleEdit={handleEdit}
            />

            <UserCategoryModal
                selectedUserCategory={selectedUserCategory}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default UserCategoryPage;
