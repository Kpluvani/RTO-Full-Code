import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { HoldReasonTable } from './HoldReasonTable';
import { HoldReasonModal } from './HoldReasonModal';
import { setPage, setLimit, setSearch, fetchHoldReason } from '../../../features/HoldReason/HoldReasonSlice';
import '../style/hold-reason.css';

const HoldReasonPage = () => {
    const [selectedHoldReason, setSelectedHoldReason] = useState(null);
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
    } = useSelector((state) => state?.holdReason || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchHoldReason({ page, limit, search, searchCols, include, exclude }));
    }, [ page, limit, search, searchCols, include, exclude ]);

    useEffect(() => {
        if (error) {
            message.error(error?.message || error);
        }
    }, [error]);
    

    const handleAddNew = () => {
        setVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedHoldReason(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedHoldReason(null);
    }

    return (
        <div>
            <h1 className="hold-reason-title"> Hold Reasons</h1>
            <div className="add-hold-reason">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <HoldReasonTable
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
            <HoldReasonModal
                selectedHoldReason={selectedHoldReason}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default HoldReasonPage;
