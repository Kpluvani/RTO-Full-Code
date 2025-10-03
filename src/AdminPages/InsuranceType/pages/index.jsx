import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { InsuranceTypeTable } from './InsuranceTypeTable';
import { InsuranceTypeModal } from './InsuranceTypeModal';
import { setPage, setLimit, setSearch, fetchInsuranceTypes } from '../../../features/insuranceType/insuranceTypeSlice';
import '../styles/insuranceType.css';

const InsuranceTypePage = () => {
    const [selectedInsuranceType, setSelectedInsuranceType] = useState(null);
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
    } = useSelector((state) => state?.insuranceType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInsuranceTypes({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedInsuranceType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedInsuranceType(null);
    }

    return (
        <div>
            <h1 className="insuranceType-title">Insurance Types</h1>
            <div className="add-insuranceType">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <InsuranceTypeTable
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

            <InsuranceTypeModal
                selectedInsuranceType={selectedInsuranceType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default InsuranceTypePage;
