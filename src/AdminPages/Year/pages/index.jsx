import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { YearTable } from './YearTable';
import { YearModal } from './YearModal';
import { setPage, setLimit, setSearch, fetchYear } from '../../../features/year/yearSlice';
import '../styles/year.css';

const YearPage = () => {
    const [selectedYear, setSelectedYear] = useState(null);
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
    } = useSelector((state) => state?.year || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchYear({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedYear(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedYear(null);
    }

    return (
        <div>
            <h1 className="year-title">Year</h1>
            <div className="add-year">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <YearTable
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
            <YearModal
                selectedYear={selectedYear}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default YearPage;
