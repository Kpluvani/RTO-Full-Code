import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RemarkTable } from './RemarkTable';
import { RemarkModal } from './RemarkModal';
import { setPage, setLimit, setSearch, fetchRemarks } from '../../../features/remark/remarkSlice';
import '../styles/Remark.css';

const RemarkPage = () => {
    const [selectedRemark, setSelectedRemark] = useState(null);
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
    } = useSelector((state) => state?.remark || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRemarks({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedRemark(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedRemark(null);
    }

    return (
        <div>
            <h1 className="Remark-title">Remark</h1>
            <div className="add-Remark">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <RemarkTable
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
            <RemarkModal
                selectedRemark={selectedRemark}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default RemarkPage;
