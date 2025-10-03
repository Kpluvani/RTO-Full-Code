import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NomTable } from './NomTable';
import { NomModal } from './NomModal';
import { setPage, setLimit, setSearch, fetchNoms } from '../../../features/nom/nomSlice';
import '../styles/nom.css';

const NomPage = () => {
    const [selectedNom, setSelectedNom] = useState(null);
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
    } = useSelector((state) => state?.nom || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNoms({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedNom(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedNom(null);
    }

    return (
        <div>
            <h1 className="nom-title">Noms</h1>
            <div className="add-nom">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <NomTable
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

            <NomModal
                selectedNom={selectedNom}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default NomPage;
