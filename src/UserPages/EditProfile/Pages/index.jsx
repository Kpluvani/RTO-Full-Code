import EditProfile from "./EditProfile";
import { Form } from "antd";

const EditProfilePage = () => {

  const [form] = Form.useForm();
  return (
    <div>
      <EditProfile form={form}/>
    </div>
  );
}
export default EditProfilePage;