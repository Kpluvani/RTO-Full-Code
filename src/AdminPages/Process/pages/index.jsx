import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProcessTable } from './ProcessTable';
import { ProcessModal } from './ProcessModal';
import { setPage, setLimit, setSearch, fetchProcess } from '@/features/process/processSlice';
import { fetchAllWorkCategories } from '@/features/workCategory/workCategorySlice';
import '../styles/process.css';

const ProcessPage = () => {
    const [selectedProcess, setSelectedProcess] = useState(null);
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
    } = useSelector((state) => state?.process || {});
    const { allData: workCategories, loading: workCategoryLoading } = useSelector(state => state?.workCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProcess({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedProcess(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedProcess(null);
    }

    return (
        <div>
            <h1 className="process-title">Process</h1>
            <div className="add-process">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <ProcessTable
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
                workCategories={workCategories}
            />

            <ProcessModal
                selectedProcess={selectedProcess}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
                workCategories={workCategories}
                workCategoryLoading={workCategoryLoading}
            />
        </div>
    );
};

export default ProcessPage;
