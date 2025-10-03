import { useMemo } from 'react';
import { Typography } from "antd";

const { Title } = Typography;

export const AssignedActions = ({ userActions = [], processes = [] }) => {

    const data = useMemo(() => {
        return userActions.map((category) => {
            return (
                <div key={category.id} className='mt-2'>
                    <Title level={5} className='user-action-title'>{category.WorkCategory?.name || ''}</Title>
                    {(category.process_ids || []).map((action, index) => {
                        const actionName = processes.find((a) => a.id == action)?.name;
                        return (
                            <li key={index}>{actionName}</li>
                        )
                    })}
                </div>
            )
        })
    }, [userActions, processes]);

    return (
        <div>
            <div className="main-card">
                <div className="card2-body">
                    <Title level={4} className={'user-action-title'}>Assigned Actions</Title>
                    {data}
                </div>
            </div>
        </div>
    )
};
