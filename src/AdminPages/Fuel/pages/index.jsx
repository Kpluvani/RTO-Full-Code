import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FuelTable } from './FuelTable';
import { FuelModal } from './FuelModal';
import { setPage, setLimit, setSearch, fetchFuels } from '../../../features/fuel/fuelSlice';
import '../styles/fuel.css';

const FuelPage = () => {
    const [selectedFuel, setSelectedFuel] = useState(null);
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
    } = useSelector((state) => state?.fuel || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFuels({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedFuel(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedFuel(null);
    }

    return (
        <div>
            <h1 className="fuel-title">Fuels</h1>
            <div className="add-fuel">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <FuelTable
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

            <FuelModal
                selectedFuel={selectedFuel}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default FuelPage;
