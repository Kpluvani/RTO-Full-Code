import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VehicalCategoryTable } from './VehicalCategoryTable';
import { VehicalCategoryModal } from './VehicalCategoryModal';
import { setPage, setLimit, setSearch, fetchVehicalCategory } from '../../../features/vehicalCategory/vehicalCategorySlice';
import '../styles/vehicalCategory.css';

const VehicalCategoryPage = () => {
    const [selectedVehicalCategory, setSelectedVehicalCategory] = useState(null);
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
    } = useSelector((state) => state?.vehicalCategory || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchVehicalCategory({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedVehicalCategory(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedVehicalCategory(null);
    }

    return (
        <div>
            <h1 className="vehical-category-title">Vehical Category</h1>
            <div className="add-vehical-category">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <VehicalCategoryTable
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

            <VehicalCategoryModal
                selectedVehicalCategory={selectedVehicalCategory}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default VehicalCategoryPage;
