import { BulkReciept } from "./BulkReceipt";
import { Form } from "antd";
import "../styles/bulkReceipt.css";

const BulkRecieptView = () => {
    const [form] = Form.useForm();

    return (
        <BulkReciept form={form} />
    );
};
export default BulkRecieptView;