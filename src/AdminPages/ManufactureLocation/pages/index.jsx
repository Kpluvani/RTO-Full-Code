import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ManufactureLocationTable } from './ManufactureLocationTable';
import { ManufactureLocationModal } from './ManufactureLocationModal';
import { setPage, setLimit, setSearch, fetchManufactureLocation } from '../../../features/manufactureLocation/manufactureLocationSlice';
import '../styles/manufactureLocation.css';

const ManufactureLocationPage = () => {
    const [selectedManufactureLocation, setSelectedManufactureLocation] = useState(null);
    const [visible, setVisible] = useState(false);
    const { data = [], total, page, limit, search, searchCols, include, exclude, loading, error } = useSelector((state) => state?.manufactureLocation || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchManufactureLocation({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedManufactureLocation(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedManufactureLocation(null);
    };

    return (
        <div>
            <h1 className="manufactureLocation-title">Manufacture Location</h1>
            <div className="add-manufactureLocation">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <ManufactureLocationTable
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
            <ManufactureLocationModal
                selectedManufactureLocation={selectedManufactureLocation}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default ManufactureLocationPage;
