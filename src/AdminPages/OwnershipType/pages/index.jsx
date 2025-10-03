import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { OwnershipTypeTable } from './OwnershipTypeTable';
import { OwnershipTypeModal } from './OwnershipTypeModal';
import { setPage, setLimit, setSearch, fetchOwnershipType } from '../../../features/ownershipType/ownershipTypeSlice';
import '../styles/ownershipType.css';

const OwnershipTypePage = () => {
    const [selectedOwnershipType, setSelectedOwnershipType] = useState(null);
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
    } = useSelector((state) => state?.ownershipType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOwnershipType({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedOwnershipType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedOwnershipType(null);
    }

    return (
        <div>
            <h1 className="ownership-type-title">Ownership Type</h1>
            <div className="add-ownership-type">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <OwnershipTypeTable
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

            <OwnershipTypeModal
                selectedOwnershipType={selectedOwnershipType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default OwnershipTypePage;
