// import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import "./updatepassword.css";
import { useDispatch } from "react-redux";
import { userUpdatePassword } from "@/features/user/userSlice";
import { useNavigate } from "react-router-dom";

export const Updatepassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values) => {
    // const { oldpassword, newpassword, confirmpassword } = values;

    const validationErrors = {};

    // if (!oldpassword.trim()) {
    //   validationErrors.oldpassword = "Enter old password";
    // }

    // const hasUpper = /[A-Z]/.test(newpassword);
    // const hasLower = /[a-z]/.test(newpassword);
    // const hasNumber = /[0-9]/.test(newpassword);
    // const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newpassword);

    // if (!newpassword) {
    //   validationErrors.newpassword = "Enter new password";
    // } else if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    //   validationErrors.newpassword =
    //     "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character";
    // } else if (newpassword.length < 8) {
    //   validationErrors.newpassword = "Password must be at least 8 characters long";
    // }

    // if (!confirmpassword.trim()) {
    //   validationErrors.confirmpassword = "Re-enter new password";
    // } else if (confirmpassword !== newpassword) {
    //   validationErrors.confirmpassword = "Passwords do not match";
    // }

    if (Object.keys(validationErrors).length > 0) {
      // show all errors inside form fields
      form.setFields(
        Object.keys(validationErrors).map((key) => ({
          name: key,
          errors: [validationErrors[key]],
        }))
      );
      return;
    }
    
    try {
      const res = await dispatch(userUpdatePassword(values));

      if (res.error) {
        messageApi.error(res.payload || "Failed to update password");
      } else {
        messageApi.success("Password updated successfully");
        form.resetFields();
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      messageApi.error(err.message || "Failed to update password");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center overflow-hidden login-card login-dark">
        <div>
          <div className="text-center mb-8">
            <div level={1} className="login-logo">
              LOGO
            </div>
          </div>

          <Card className="update-card-body">
            <div className="text-center mb-8">
              <div level={2} className="update-label">
                Update Password
              </div>
              <div className="update-msg">Set New Password For Your Account</div>
            </div>
            <Form
              form={form}
              name="updatepassword"
              layout="vertical"
              requiredMark={false}
              className="space-y-6"
              onFinish={handleFinish}
            >
              <Form.Item
                label={"Old Password"}
                name="oldpassword"
                // rules={[{ required: true, message: "Please enter your old password" }]}
                className="mb-16"
              >
                <Input.Password placeholder="Enter your old password" size="large" />
              </Form.Item>

              <Form.Item
                label={"New Password"}
                name="newpassword"
                // rules={[{ required: true, message: "Please enter a new password" }]}
                className="mb-16"
              >
                <Input.Password placeholder="Enter New password" size="large" />
              </Form.Item>

              <Form.Item
                label={"Confirm Password"}
                name="confirmpassword"
                // rules={[{ required: true, message: "Please re-enter your password" }]}
                className="mb-16"
              >
                <Input.Password placeholder="Re-enter New password" size="large" />
              </Form.Item>

              <Form.Item className="mb-0 mt-30">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};
