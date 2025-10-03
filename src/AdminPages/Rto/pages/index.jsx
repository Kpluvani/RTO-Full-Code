import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RtoTable } from './RtoTable';
import { RtoModal } from './RtoModal';
import { setPage, setLimit, setSearch, fetchRtos } from '../../../features/rto/rtoSlice';
import { fetchAllStates } from '../../../features/state/stateSlice';
import { fetchAllDistricts } from '../../../features/district/districtSlice';
import '../styles/rto.css';

const RtoPage = () => {
    const [selectedRto, setSelectedRto] = useState(null);
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
    } = useSelector((state) => state?.rto || {});
    const { allData: states = [] } = useSelector((state) => state?.state || {});
    const { allData: districts = [] } = useSelector((state) => state?.district || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllStates());
        dispatch(fetchAllDistricts());
    }, []);

    useEffect(() => {
        dispatch(fetchRtos({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedRto(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedRto(null);
    }

    return (
        <div>
            <h1 className="rto-title">RTOs</h1>
            <div className="add-rto">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <RtoTable
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
                states={states}
                districts={districts}
            />

            <RtoModal
                selectedRto={selectedRto}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
                states={states}
                districts={districts}
            />
        </div>
    );
};

export default RtoPage;
