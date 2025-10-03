import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Spin } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import { AppRoutes } from '../../Routes';
import { useLocation } from "react-router-dom";
import { setAuthToken } from '../../config/axiosConfig';
import { setToken, setIsAdmin, setUserId } from '../../features/auth/authSlice';

const { Content } = Layout

const LayoutComponent = () => {
  const [initial, setInitial] = useState(true);
  const location = useLocation();
  const isLoginRoute = location.pathname.includes("/login") || location.pathname.includes("/updatepassword");
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Read initial values from localStorage
    dispatch(setToken(localStorage.getItem('token')));
    dispatch(setIsAdmin(localStorage.getItem('isAdmin') === 'true'));
    dispatch(setUserId(localStorage.getItem('userId')));
  }, []);

  useEffect(() => {
    setAuthToken(token);
    setInitial(false);
  }, [token]);

  return (
    <Spin spinning={initial}>
      <Layout style={{ minHeight: "100vh" }}>
        {!isLoginRoute && <Header/>}

        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          <AppRoutes/>
        </Content>

        {!isLoginRoute && <Footer/>}
      </Layout>
    </Spin>
  )
}

export default LayoutComponent;