import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RegistrationTypeTable } from './RegistrationTypeTable';
import { RegistrationTypeModal } from './RegistrationTypeModal';
import { setPage, setLimit, setSearch, fetchRegistrationType } from '../../../features/registrationType/registrationTypeSlice';
import '../styles/registrationType.css';

const RegistrationTypePage = () => {
    const [selectedRegistrationType, setSelectedRegistrationType] = useState(null);
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
    } = useSelector((state) => state?.registrationType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRegistrationType({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedRegistrationType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedRegistrationType(null);
    }

    return (
        <div>
            <h1 className="registration-type-title">Registration Type</h1>
            <div className="add-registration-type">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <RegistrationTypeTable
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

            <RegistrationTypeModal
                selectedRegistrationType={selectedRegistrationType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default RegistrationTypePage;
