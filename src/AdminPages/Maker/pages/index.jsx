import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MakerTable } from './MakerTable';
import { MakerModal } from './MakerModal';
import { setPage, setLimit, setSearch, fetchMaker } from '../../../features/maker/makerSlice';
import '../styles/maker.css';

const MakerPage = () => {
    const [selectedMaker, setSelectedMaker] = useState(null);
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
    } = useSelector((state) => state?.maker || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMaker({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedMaker(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedMaker(null);
    }

    return (
        <div>
            <h1 className="maker-title">Maker</h1>
            <div className="add-maker">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <MakerTable
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
            <MakerModal
                selectedMaker={selectedMaker}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default MakerPage;
