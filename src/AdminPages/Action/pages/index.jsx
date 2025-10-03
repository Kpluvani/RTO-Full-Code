import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionTable } from './ActionTable';
import { ActionModal } from './ActionModal';
import { setPage, setLimit, setSearch, fetchActions } from '@/features/action/actionSlice';
import { fetchAllWorkCategories } from '@/features/workCategory/workCategorySlice';
import '../styles/action.css';

const ActionPage = () => {
    const [selectedAction, setSelectedAction] = useState(null);
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
    } = useSelector((state) => state?.action || {});
    const { allData: workCategories, loading: workCategoryLoading } = useSelector(state => state?.workCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchActions({ page, limit, search, searchCols, include, exclude }));
    }, [page, search, searchCols, include, exclude, limit]);

    useEffect(() => {
        dispatch(fetchAllWorkCategories());
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error?.message || error);
        }
    }, [error]);

    const handleAddNew = () => {
        setVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedAction(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedAction(null);
    }

    return (
        <div>
            <h1 className="action-title">Action</h1>
            <div className="add-action">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <ActionTable
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
                workCategoryLoading={workCategoryLoading}
                workCategories={workCategories}
            />

            <ActionModal
                selectedAction={selectedAction}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
                workCategoryLoading={workCategoryLoading}
                workCategories={workCategories}
            />
        </div>
    );
};

export default ActionPage;
