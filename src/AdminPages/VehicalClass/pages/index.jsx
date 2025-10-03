import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehicalClassTable } from './VehicalClassTable';
import { VehicalClassModal } from './VehicalClassModal';
import { setPage, setLimit, setSearch, fetchVehicalClass } from '../../../features/vehicalClass/vehicalClassSlice';
import '../styles/vehicalClass.css';

const VehicalClassPage = () => {
    const [selectedVehicalClass, setSelectedVehicalClass] = useState(null);
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
    } = useSelector((state) => state?.vehicalClass || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVehicalClass({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedVehicalClass(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedVehicalClass(null);
    }

    return (
        <div>
            <h1 className="vehical-class-title">Vehical Class</h1>
            <div className="add-vehical-class">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <VehicalClassTable
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

            <VehicalClassModal
                selectedVehicalClass={selectedVehicalClass}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default VehicalClassPage;
