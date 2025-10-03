import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ServiceTable } from './ServiceTable';
import { ServiceModal } from './ServiceModal';
import { setPage, setLimit, setSearch, fetchService } from '../../../features/service/serviceSlice';
import '../styles/service.css';

const ServicePage = () => {
    const [selectedService, setSelectedService] = useState(null);
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
    } = useSelector((state) => state?.service || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchService({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedService(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedService(null);
    }

    return (
        <div>
            <h1 className="service-title">Service</h1>
            <div className="add-service">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <ServiceTable
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

            <ServiceModal
                selectedService={selectedService}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default ServicePage;
