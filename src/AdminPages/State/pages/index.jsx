import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { StateTable } from './StateTable';
import { StateModal } from './StateModal';
import { setPage, setLimit, setSearch, fetchStates } from '../../../features/state/stateSlice';
import '../styles/state.css';

const StatePage = () => {
    const [selectedState, setSelectedState] = useState(null);
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
    } = useSelector((state) => state?.state || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStates({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedState(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedState(null);
    }

    return (
        <div>
            <h1 className="state-title">States</h1>
            <div className="add-state">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <StateTable
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

            <StateModal
                selectedState={selectedState}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default StatePage;
