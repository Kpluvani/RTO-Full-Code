import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DesignationTable } from './DesignationTable';
import { DesignationModal } from './DesignationModal';
import { setPage, setLimit, setSearch, fetchDesignations } from '../../../features/designation/designationSlice';
import '../styles/designation.css';

const DesignationPage = () => {
    const [selectedDesignation, setSelectedDesignation] = useState(null);
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
    } = useSelector((state) => state?.designation || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDesignations({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedDesignation(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedDesignation(null);
    }

    return (
        <div>
            <h1 className="designation-title">Designations</h1>
            <div className="add-designation">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <DesignationTable
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

            <DesignationModal
                selectedDesignation={selectedDesignation}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default DesignationPage;
