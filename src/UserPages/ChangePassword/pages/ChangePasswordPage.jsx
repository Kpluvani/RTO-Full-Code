import {Card , Typography , Form, Input, Button, message} from "antd";
import { jwtDecode } from "jwt-decode";
import '../styles/changePassword.css';
import { useDispatch, useSelector } from "react-redux";
import { editPassword } from "@/features/user/userSlice";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Item } = Form;
const { Password } = Input;

const ChangePasswordPage = ({ form }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userId = null;

    const auth = useSelector((state) => state.auth);
    console.log('auth>>', auth);
    if (token) {
        const decoded = jwtDecode(token);
        userId = decoded?.id || decoded?.userId;
    }
    console.log('Received values of form: ', userId); 

    const onFinish = async (values) => {
      try {
        const result = await dispatch(editPassword({ id: userId, data: values })).unwrap();
        message.success(result); // shows "User updated successfully"
        form.resetFields();
        navigate('/login');
      } catch (error) {
        message.error(error); // shows "Current password is incorrect"
      }
    };


  return (
    <div>
    <Form form={form} onFinish={onFinish} layout="vertical" className="change-password-form">
      <Card style={{ width: '30%', margin: '2rem auto', textAlign: 'center' }}>
        <Title className="change-password-title" level={3}>Update Password</Title>
        <p>Set New Password For Your Account</p>
        
        <Item 
            name="currentPassword" 
            label="Current Password" 
            rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Password type="password" placeholder="Enter Current Password" style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        </Item>

        <Item 
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('currentPassword') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('New password must be different from current password!')
                  );
                },
              }),
            ]}
        >
          <Password type="password" placeholder="Enter New Password" style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        </Item>

        <Item
            name="confirmNewPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The Confirm password does not match to New Password !'));
                },
              }),
            ]}
        >
          <Password type="password" placeholder="Re-Enter New Password" style={{ width: '100%', padding: '8px', marginBottom: '1rem' }} />
        </Item>

        <Item>
          <Button type="submit" onClick={ () => form.submit() } style={{marginTop:'1rem', padding: '20px', width: '100%', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Update Password     
            </Button>
        </Item>
      </Card>
    </Form>
    </div>
  );
}   

export default ChangePasswordPage;