import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DealerTable } from './DealerTable';
import { DealerModal } from './DealerModal';
import { setPage, setLimit, setSearch, fetchDealers } from '../../../features/dealer/dealerSlice';
import '../styles/dealer.css';

const DealerPage = () => {
    const [selectedDealer, setSelectedDealer] = useState(null);
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
    } = useSelector((state) => state?.dealer || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDealers({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedDealer(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedDealer(null);
    }

    return (
        <div>
            <h1 className="dealer-title">Dealers</h1>
            <div className="add-dealer">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <DealerTable
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

            <DealerModal
                selectedDealer={selectedDealer}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default DealerPage;
