import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehicalTypeTable } from './VehicalTypeTable';
import { VehicalTypeModal } from './VehicalTypeModal';
import { setPage, setLimit, setSearch, fetchVehicalType } from '../../../features/vehicalType/vehicalTypeSlice';
import '../styles/vehicalType.css';

const VehicalTypePage = () => {
    const [selectedVehicalType, setSelectedVehicalType] = useState(null);
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
    } = useSelector((state) => state?.vehicalType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVehicalType({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedVehicalType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedVehicalType(null);
    }

    return (
        <div>
            <h1 className="vehical-type-title">Vehical Type</h1>
            <div className="add-vehical-type">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <VehicalTypeTable
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

            <VehicalTypeModal
                selectedVehicalType={selectedVehicalType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default VehicalTypePage;
