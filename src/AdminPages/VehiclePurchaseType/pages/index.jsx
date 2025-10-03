import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehiclePurchaseTypeTable } from './VehiclePurchaseTypeTable';
import { VehiclePurchaseTypeModal } from './VehiclePurchaseTypeModal';
import { setPage, setLimit, setSearch, fetchVehicalPurchaseTypes } from '../../../features/vehicalPurchaseType/vehicalPurchaseTypeSlice';
import '../styles/vehicalPurchaseType.css';

const VehiclePurchaseTypePage = () => {
    const [selectedVehiclePurchaseType, setSelectedVehiclePurchaseType] = useState(null);
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
    } = useSelector((state) => state?.vehicalPurchaseType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVehicalPurchaseTypes({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedVehiclePurchaseType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedVehiclePurchaseType(null);
    }

    return (
        <div>
            <h1 className="vehiclePurchaseType-title">Vehical Purchase Type</h1>
            <div className="add-vehiclePurchaseType">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <VehiclePurchaseTypeTable
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

            <VehiclePurchaseTypeModal
                selectedVehiclePurchaseType={selectedVehiclePurchaseType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default VehiclePurchaseTypePage;
