import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { WorkCategoryTable } from './WorkCategoryTable';
import { WorkCategoryModal } from './WorkCategoryModal';
import { setPage, setLimit, setSearch, fetchWorkCategories } from '../../../features/workCategory/workCategorySlice';
import '../styles/workCategory.css';

const WorkCategoryPage = () => {
    const [selectedWorkCategory, setSelectedWorkCategory] = useState(null);
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
    } = useSelector((state) => state?.workCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWorkCategories({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedWorkCategory(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedWorkCategory(null);
    }

    return (
        <div>
            <h1 className="workCategory-title">Work Categories</h1>
            <div className="add-workCategory">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <WorkCategoryTable
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

            <WorkCategoryModal
                selectedWorkCategory={selectedWorkCategory}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default WorkCategoryPage;
