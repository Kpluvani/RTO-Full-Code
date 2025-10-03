"use client"
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Card, message, Input as AntInput } from "antd";
import Input from '@/CustomComponents/CapitalizedInput';
import { login, verifyOtp } from '../../features/auth/authSlice';
import "./login.css";

export const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [form] = Form.useForm();
  const { showOtp, loading, error, userId, otpLoading, otpError } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const [lastCredentials, setLastCredentials] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (error) {
      setErrorMsg(error || '');
    }
  }, [error]);

  useEffect(() => {
    if (otpError) {
      setErrorMsg(otpError || '');
    }
  }, [otpError]);

  const onFinish = async (values) => {
    try {
      if (showOtp) {
        // Only OTP is submitted
        const otpValue = values.otp;
        const result = await dispatch(verifyOtp({ user_id: userId, otp: otpValue })).unwrap();
        if (result.is_verified) {
          messageApi.success("OTP verified and login successful!");
        } else {
          messageApi.error(result.message || "OTP verification failed.");
        }
      } else {
        // First login attempt
        setLastCredentials(values);
        const result = await dispatch(login(values)).unwrap();
        if (result.showOtp) {
          messageApi.info("OTP sent to your registered mobile number.");
        } else if (result.token) {
          messageApi.success("Login successful!");
        } else {
          messageApi.error(result.message || "Login failed.");
        }
      }
    } catch (error) {
      messageApi.error(`Login failed. Please try again. ${error.message || error}`);
    }
  }

  const handleResendOTP = async () => {
    try {
        // First login attempt
        const result = await dispatch(login(lastCredentials)).unwrap();
        if (result.showOtp) {
          messageApi.info("OTP sent to your registered mobile number.");
        } else if (result.token) {
          messageApi.success("Login successful!");
        } else {
          messageApi.error(result.message || "Login failed.");
        }
    } catch (error) {
      messageApi.error(`Login failed. Please try again. ${error.message || error}`);
    }
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen flex items-center justify-center overflow-hidden login-card login-dark">
        <div>
          <div className="text-center mb-8">
            <div level={1} className="login-logo">LOGO</div>
          </div>

          <Card className="login-card-body">
            <div className="text-center mb-8">
              <div level={2} className="login-label">LOGIN</div>
              <div className="login-msg">Welcome Back! Please Log in To Your Account</div>
            </div>
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              className="space-y-6"
              onChange={() => setErrorMsg('')}
            >
              <Form.Item
                label={'User ID'}
                name="username"
                rules={[{ required: true, message: "Please enter your user ID" }]}
                className="mb-16"
              >
                <AntInput
                  placeholder="Enter your user id"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={'Password'}
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
                className="mb-16"
              >
                <AntInput.Password
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              {showOtp ? (
                <>
                  <Form.Item
                    label={'OTP'}
                    name="otp"
                    rules={[{ required: true, message: "Please enter the OTP" }]}
                    className="mb-0"
                  >
                    <AntInput.OTP
                      size="large"
                      length={6}
                    />
                  </Form.Item>
                  {otpError ? (
                    <div className="login-error-msg">{otpError}</div>
                  ) : null}
                  <div className="text-left">
                    <Button
                      type="link"
                      className="text-blue-500 hover:text-blue-600 h-auto font-semibold text-sm p-px"
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </>
              ) : null}
              
              <Form.Item className="mb-0 mt-30">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={showOtp ? otpLoading : loading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {(showOtp ? otpLoading : loading) ? "Submitting..." : "Submit"}
                </Button>
              </Form.Item>
              <div className="login-error-msg">{errorMsg}</div>
            </Form>
          </Card>
        </div>
      </div>
    </>
  )
}