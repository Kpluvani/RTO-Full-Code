import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehicalBodyTypeTable } from './VehicalBodyTypeTable';
import { VehicalBodyTypeModal } from './VehicalBodyTypeModal';
import { setPage, setLimit, setSearch, fetchVehicalBodyTypes } from '../../../features/vehicalBodyType/vehicalBodyTypeSlice';
import '../styles/vehicalBodyType.css';

const VehicalBodyTypePage = () => {
    const [selectedVehicalBodyType, setSelectedVehicalBodyType] = useState(null);
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
    } = useSelector((state) => state?.vehicalBodyType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVehicalBodyTypes({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedVehicalBodyType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedVehicalBodyType(null);
    }

    return (
        <div>
            <h1 className="vehicalBodyType-title">Vehical Body Type</h1>
            <div className="add-vehicalBodyType">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <VehicalBodyTypeTable
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

            <VehicalBodyTypeModal
                selectedVehicalBodyType={selectedVehicalBodyType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default VehicalBodyTypePage;
