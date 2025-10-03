import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MakerModelTable } from './MakerModelTable';
import { MakerModelModal } from './MakerModelModal';
import { setPage, setLimit, setSearch, fetchMakerModel } from '../../../features/MakerModel/MakerModelSlice';
import '../styles/makermodel.css';

const MakerModelPage = () => {
    const [selectedMakerModel, setSelectedMakerModel] = useState(null);
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
    } = useSelector((state) => state?.makerModel || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMakerModel({ page, limit, search, searchCols, include, exclude }));
    }, [ page, limit, search, searchCols, include, exclude ]);

    useEffect(() => {
        if (error) {
            message.error(error?.message || error);
        }
    }, [error]);
    

    const handleAddNew = () => {
        setVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedMakerModel(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedMakerModel(null);
    }

    return (
        <div>
            <h1 className="maker-model-title">Maker Model</h1>
            <div className="add-maker-model">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>
            <MakerModelTable
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
            <MakerModelModal
                selectedMakerModel={selectedMakerModel}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default MakerModelPage;
