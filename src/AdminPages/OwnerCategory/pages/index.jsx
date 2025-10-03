import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { OwnerCategoryTable } from './OwnerCategoryTable';
import { OwnerCategoryModal } from './OwnerCategoryModal';
import { setPage, setLimit, setSearch, fetchOwnerCategory } from '../../../features/ownerCategory/ownerCategorySlice';
import '../styles/ownerCategory.css';

const OwnerCategoryPage = () => {
    const [selectedOwnerCategory, setSelectedOwnerCategory] = useState(null);
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
    } = useSelector((state) => state?.ownerCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOwnerCategory({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedOwnerCategory(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedOwnerCategory(null);
    }

    return (
        <div>
            <h1 className="owner-category-title">Owner Category</h1>
            <div className="add-owner-category">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <OwnerCategoryTable
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

            <OwnerCategoryModal
                selectedOwnerCategory={selectedOwnerCategory}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default OwnerCategoryPage;
