import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PurchaseAsTable } from './PurchaseAsTable';
import { PurchaseAsModal } from './PurchaseAsModal';
import { setPage, setLimit, setSearch, fetchPurchaseAses } from '../../../features/purchaseAs/purchaseAsSlice';
import '../styles/purchaseAs.css';

const PurchaseAsPage = () => {
    const [selectedPurchaseAs, setSelectedPurchaseAs] = useState(null);
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
    } = useSelector((state) => state?.purchaseAs || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPurchaseAses({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedPurchaseAs(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedPurchaseAs(null);
    }

    return (
        <div>
            <h1 className="purchaseAs-title">Purchase As</h1>
            <div className="add-purchaseAs">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <PurchaseAsTable
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

            <PurchaseAsModal
                selectedPurchaseAs={selectedPurchaseAs}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default PurchaseAsPage;
