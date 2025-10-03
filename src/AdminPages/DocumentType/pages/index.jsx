import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DocumentTypeTable } from './DocumentTypeTable';
import { DocumentTypeModal } from './DocumentTypeModal';
import { setPage, setLimit, setSearch, fetchDocumentTypes } from '../../../features/documentType/documentTypeSlice';
import '../styles/documentType.css';

const DocumentTypePage = () => {
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
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
    } = useSelector((state) => state?.documentType || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDocumentTypes({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedDocumentType(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedDocumentType(null);
    }

    return (
        <div>
            <h1 className="documentType-title">Document Types</h1>
            <div className="add-documentType">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <DocumentTypeTable
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

            <DocumentTypeModal
                selectedDocumentType={selectedDocumentType}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default DocumentTypePage;
