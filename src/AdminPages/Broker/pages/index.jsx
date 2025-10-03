import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BrokerTable } from './BrokerTable';
import { BrokerModal } from './BrokerModal';
import { setPage, setLimit, setSearch, fetchBrokers } from '../../../features/broker/brokerSlice';
import '../styles/broker.css';

const BrokerPage = () => {
    const [selectedBroker, setSelectedBroker] = useState(null);
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
    } = useSelector((state) => state?.broker || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBrokers({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedBroker(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedBroker(null);
    }

    return (
        <div>
            <h1 className="broker-title">Broker</h1>
            <div className="add-broker">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <BrokerTable
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

            <BrokerModal
                selectedBroker={selectedBroker}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default BrokerPage;
