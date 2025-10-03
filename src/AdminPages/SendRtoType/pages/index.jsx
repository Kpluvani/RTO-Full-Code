import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SendRtoTypeTable } from './SendRtoTypeTable';
import { SendRtoTypeModal } from './SendRtoTypeModal';
import { setPage, setLimit, setSearch, fetchSendRtoType } from '../../../features/sendRtoType/sendRtoTypeSlice';
import '../styles/sendRtoType.css';

const SendRtoTypePage = () => {
    const [selectedSendRtoType, setSelectedSendRtoType] = useState(null);
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
    } = useSelector((state) => state?.sendRtoType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSendRtoType({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedSendRtoType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedSendRtoType(null);
    }

    return (
        <div>
            <h1 className="send-rto-type-title">Send Rto Type</h1>
            <div className="add-send-rto-type">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <SendRtoTypeTable
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

            <SendRtoTypeModal
                selectedSendRtoType={selectedSendRtoType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default SendRtoTypePage;
