import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RembursementTable } from './RembursementTable';
import { RembursementModal } from './RembursementModal';
import { setPage, setLimit, setSearch, fetchRembursements } from '../../../features/rembursement/rembursementSlice';
import '../styles/rembursement.css';

const RembursementPage = () => {
    const [selectedRembursement, setSelectedRembursement] = useState(null);
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
    } = useSelector((state) => state?.rembursement || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRembursements({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedRembursement(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedRembursement(null);
    }

    return (
        <div>
            <h1 className="dealer-title">Rembursements</h1>
            <div className="add-dealer">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <RembursementTable
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

            <RembursementModal
                selectedRembursement={selectedRembursement}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default RembursementPage;
