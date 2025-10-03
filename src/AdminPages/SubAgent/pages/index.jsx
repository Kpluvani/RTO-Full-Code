import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SubAgentTable } from './SubAgentTable';
import { SubAgentModal } from './SubAgentModal';
import { setPage, setLimit, setSearch, fetchSubAgents } from '../../../features/subAgent/subAgentSlice';
import '../styles/subAgent.css';

const SubAgentPage = () => {
    const [selectedSubAgent, setSelectedSubAgent] = useState(null);
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
    } = useSelector((state) => state?.subAgent || {});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSubAgents({ page, limit, search, searchCols, include, exclude }));
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
        setSelectedSubAgent(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        setSelectedSubAgent(null);
    }

    return (
        <div>
            <h1 className="dealer-title">Sub Agents</h1>
            <div className="add-dealer">
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Add New</Button>
            </div>

            <SubAgentTable
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

            <SubAgentModal
                selectedSubAgent={selectedSubAgent}
                visible={visible}
                onClose={onClose}
                handleEdit={handleEdit}
            />
        </div>
    );
};

export default SubAgentPage;
