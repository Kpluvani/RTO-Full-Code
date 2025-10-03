import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FinancerTable } from './FinancerTable';
import { FinancerModal } from './FinancerModal';
import { setPage, setLimit, setSearch, fetchFinancer } from '../../../features/financer/financerSlice';
import '../styles/financer.css';

const FinancerPage = () => {
    const [selectedFinancer, setSelectedFinancer] = useState(null);
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
    } = useSelector((state) => state?.financer || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFinancer({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedFinancer(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedFinancer(null);
    }

    return (
        <div>
            <h1 className="financer-title">Financer</h1>
            <div className="add-financer">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <FinancerTable
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
            <FinancerModal
                selectedFinancer={selectedFinancer}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default FinancerPage;
