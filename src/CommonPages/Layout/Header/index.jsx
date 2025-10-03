import React, { useState, useEffect } from 'react'
import { Layout, Button, Space, Dropdown, Flex, Avatar } from "antd";
import { HomeOutlined, FileTextOutlined, UserOutlined, DownOutlined, LogoutOutlined, InsertRowLeftOutlined, CarOutlined, PhoneOutlined, MailOutlined, EditOutlined, KeyOutlined  } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { masterMenuItems, profileMenuItems, reportMenuItems, paymentMenuItems } from './menuList';
import { logout } from '../../../features/auth/authSlice';
import { fetchAllSendRtoType } from '@/features/sendRtoType/sendRtoTypeSlice';
import { fetchUserProfile } from '@/features/user/userSlice';
import './header.css';

const { Header } = Layout;

const CustomHeader = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { profile } = useSelector((state) => state.user);
  const { allData: sendRtoType = [] } = useSelector((state) => state.sendRtoType || {});

  useEffect(() => {
    dispatch(fetchAllSendRtoType());
    dispatch(fetchUserProfile());
  }, []);

  const onClickMaster = ({ key }) => {
    navigate(key);
    setMobileMenuOpen(false); // close menu on navigation
  }

  const onClickToRedirect = ({ key }) => {
    navigate(key);
    setMobileMenuOpen(false); // close menu on navigation
  }

  const handleMenuClick = (callback) => {
    callback();
    setMobileMenuOpen(false);
  }

  const onClickSendToRTO = ({ key }) => {
    if (key === "bulk-approve-by-rto") {
      navigate("/bulk-approve-by-rto")
    } else {
      const seletedType = sendRtoType.find(t => t.name === key)
      if (seletedType) {
        navigate("/bulk-send-to-rto", { state: seletedType });
      }
    }
    setMobileMenuOpen(false)
  }  

  const SendRtoTypeMenu = [
    ...(sendRtoType?.map(type => ({
      key: type.name,
      label: type.name
    })) || []),
    { type: 'divider'},
    { key: 'bulk-approve-by-rto', label: 'Approve by RTO'}
  ]

  const avatarMenuItems = [
    {
      key: "info",
      label: (
        <Flex vertical style={{ padding: "8px", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
            <UserOutlined /> {profile?.name || "User"}
          </div>
          {profile?.mobile_number && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555" }}>
              <PhoneOutlined /> {profile.mobile_number}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555" }}>
            <MailOutlined /> {profile?.email}
          </div>
        </Flex>
      ),
    },
    { type: "divider" },
    {
      key: "edit-profile",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }}>
          <EditOutlined  style={{ fontSize: "16px", color: "#0086e8" }} /> Edit Profile
        </div>
      ),
      onClick: () =>  navigate("/edit-profile"),
    },
    {
      key: "change-password",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }}>
          <KeyOutlined style={{ fontSize: "16px", color: "#0086e8" }} /> Change Password
        </div>
      ),
      onClick: () => navigate("/change-password"),
    },
    {
      key: "logout",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }}>
          <LogoutOutlined style={{ fontSize: "16px", color: "#0086e8" }} /> Logout
        </div>
      ),
      onClick: () => dispatch(logout()),
    },
  ];


  return (
    <div>
      <Header className='header-block'>
        <div className={'flex header-flex'}>
          <div className='header-logo'>LOGO</div>

          {/* Hamburger icon for mobile */}
          <Button
            className='hamburger-btn'
            type='text'
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
                <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
                <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
              </svg>
            }
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Desktop Menu */}
          <div className={`header-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Space size={mobileMenuOpen ? 'small' : 'large'} direction={mobileMenuOpen ? 'vertical' : 'horizontal'}>
              <Button
                type="text"
                icon={<HomeOutlined />}
                className={'header-button'}
                onClick={() => handleMenuClick(() => navigate(isAdmin ? '/admin/home' : '/home'))}
              >
                Home
              </Button>

              {isAdmin ? (
                <Dropdown className='master-menu'  menu={{ items: masterMenuItems, onClick: onClickToRedirect }} trigger={ mobileMenuOpen ? ['click'] : ['hover']} style={{ maxHeight: '220px' }}>
                  <Button type="text" icon={<FileTextOutlined />} className={'header-button'} >
                    Masters <DownOutlined />
                  </Button>
                </Dropdown>
              ) : null}

              <Dropdown menu={{ items: reportMenuItems, onClick: onClickMaster }} trigger={mobileMenuOpen ? ['click'] : ['hover']}>
                <Button type="text" icon={<FileTextOutlined />} className={'header-button'}>
                  Report <DownOutlined />
                </Button>
              </Dropdown>

              {!isAdmin ? (
                <Dropdown className='payment-menu' menu={{ items: paymentMenuItems, onClick: onClickToRedirect }} trigger={ mobileMenuOpen ? ['click'] : ['hover']} style={{ maxHeight: '220px' }}>
                  <Button type="text" icon={<FileTextOutlined />} className={'header-button'} >
                    Payment <DownOutlined />
                  </Button>
                </Dropdown>
              ) : null}

              <Dropdown menu={{ items: profileMenuItems }} trigger={mobileMenuOpen ? ['click'] : ['hover']}>
                <Button type="text" icon={<UserOutlined />} className={'header-button'}>
                  Update Profile <DownOutlined />
                </Button>
              </Dropdown>

              {/* Only show in user, not admin */}
              {!isAdmin ? (
              <Dropdown menu={{ items: SendRtoTypeMenu, onClick: onClickSendToRTO }} trigger={mobileMenuOpen ? ['click'] : ['hover']}>
                <Button type='text' icon={<InsertRowLeftOutlined />} className={'header-button'}>
                  Send To RTO <DownOutlined />
                </Button>
              </Dropdown>
              ) : null }

              {/* Only show in user, not admin */}
            {!isAdmin ? (
              <Button 
                type="text" 
                icon={<CarOutlined />}   // Ant icon for vehicle
                className="header-button"
                // { key: "register-application", label: "Register Vehical Details" },
                onClick={() => handleMenuClick(() => navigate(isAdmin ? '/register-application' : '/register-application'))}
              >
                Registered Vehicle Details
              </Button>
            ) : null}


              
            </Space>
          </div>
        </div>

        <div className={'header-right'} style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
          <>
            <span style={{ marginRight: "8px", fontSize: "14px", color: 'white' }}>
              Welcome, {profile?.user_name || "User"}
            </span>
            <Dropdown menu={{ items: avatarMenuItems }} trigger={["click"]}>
              <Avatar 
                style={{ backgroundColor: "#ffffffff", cursor: "pointer", color: 'black' }} 
                icon={<UserOutlined />} 
              />
            </Dropdown>
          </>
        </div>
      </Header>
    </div>
  )
};

export default CustomHeader;