import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DistrictTable } from './DistrictTable';
import { DistrictModal } from './DistrictModal';
import { setPage, setLimit, setSearch, fetchDistricts } from '../../../features/district/districtSlice';
import { fetchAllStates } from '../../../features/state/stateSlice';
import '../styles/district.css';

const DistrictPage = () => {
    const [selectedDistrict, setSelectedDistrict] = useState(null);
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
    } = useSelector((state) => state?.district || {});
    const { allData: states = [] } = useSelector((state) => state?.state || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllStates());
    }, [])

    useEffect(() => {
        dispatch(fetchDistricts({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedDistrict(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedDistrict(null);
    }

    return (
        <div>
            <h1 className="district-title">Districts</h1>
            <div className="add-district">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <DistrictTable
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
            />

            <DistrictModal
                selectedDistrict={selectedDistrict}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
                states={states}
            />
        </div>
    );
};

export default DistrictPage;
