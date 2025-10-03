import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { InsuranceCompanyTable } from './InsuranceCompanyTable';
import { InsuranceCompanyModal } from './InsuranceCompanyModal';
import { setPage, setLimit, setSearch, fetchInsuranceCompany } from '../../../features/insuranceCompany/insuranceCompanySlice';
import '../styles/insuranceCompany.css';

const InsuranceCompanyPage = () => {
    const [selectedInsuranceCompany, setSelectedInsuranceCompany] = useState(null);
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
    } = useSelector((state) => state?.insuranceCompany || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchInsuranceCompany({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedInsuranceCompany(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedInsuranceCompany(null);
    }

    return (
        <div >
            <h1 className="insurance-company-title">Insurance Company</h1>
            <div className="add-insurance-company">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <InsuranceCompanyTable
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
            <InsuranceCompanyModal
                selectedInsuranceCompany={selectedInsuranceCompany}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default InsuranceCompanyPage;
