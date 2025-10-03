import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MonthTable } from './MonthTable';
import { MonthModal } from './MonthModal';
import { setPage, setLimit, setSearch, fetchMonth } from '../../../features/month/monthSlice';
import '../styles/month.css';

const MonthPage = () => {
    const [selectedMonth, setSelectedMonth] = useState(null);
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
    } = useSelector((state) => state?.month || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMonth({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedMonth(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedMonth(null);
    }

    return (
        <div>
            <h1 className="month-title">Month</h1>
            <div className="add-month">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <MonthTable
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
            <MonthModal
                selectedMonth={selectedMonth}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default MonthPage;
