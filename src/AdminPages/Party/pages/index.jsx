import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PartyTable } from './PartyTable';
import { PartyModal } from './PartyModal';
import { setPage, setLimit, setSearch, fetchPartys } from '../../../features/party/partySlice';
import '../styles/party.css';

const PartyPage = () => {
    const [selectedParty, setSelectedParty] = useState(null);
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
    } = useSelector((state) => state?.party || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPartys({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedParty(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedParty(null);
    }

    return (
        <div>
            <h1 className="party-title">Party</h1>
            <div className="add-party">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <PartyTable
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

            <PartyModal
                selectedParty={selectedParty}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default PartyPage;
