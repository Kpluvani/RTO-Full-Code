import { Form } from "antd";
import ChangePasswordPage from "./ChangePasswordPage";


const ChangePassword = () => {
    const [form] = Form.useForm();
  return (
    <ChangePasswordPage form={form} />
  );
}
export default ChangePassword;