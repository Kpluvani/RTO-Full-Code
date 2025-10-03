import { Form , Row, Typography ,Col , Input, Card, Select, Button , message} from "antd";
import { RiSaveLine, RiArrowGoBackFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import '../Styles/EditProfile.css';
import { fetchAllWorkCategories } from "@/features/workCategory/workCategorySlice";
import { fetchAllUserCategories } from "@/features/userCategory/userCategorySlice";
import { fetchAllDesignations } from "@/features/designation/designationSlice";
import { editPassword, fetchUserById } from "@/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { useNavigate } from "react-router-dom";

const { Item } = Form;
const { Title } = Typography;

const EditProfile = ({form}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allData: workCategories = [] } = useSelector((state) => state.workCategory || {});
    const { allData: userCategories = [] } = useSelector((state) => state.userCategory || {});
    const { allData: designations = [] } = useSelector((state) => state.designation || {});
    const { user } = useSelector((state) => state.user || {});

    const token = localStorage.getItem('token');
    let userId = null;
    
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded?.id || decoded?.userId;
    }

    useEffect(() => {
        dispatch(fetchAllWorkCategories());
        dispatch(fetchAllUserCategories());
        dispatch(fetchAllDesignations());

        if (userId) {
          dispatch(fetchUserById(userId));
        }
    }, []);

    const onFinish = async (values) => {
      try {
        await dispatch(editPassword({ id: userId, data: values }));
        message.success("Profile updated successfully");
        form.setFieldsValue(values);
      } catch (error) {
        message.error(`Failed to update profile ${error}`);
      }
    };

    useEffect(() => {
      if (user) {
        form.setFieldsValue({
          ...user,
        });
      }
    }, [user, form]);

    return (
      <Form form={form} onFinish={onFinish} layout="vertical" className="edit-profile-form">
        <Card className="edit-profile-card">
          <div className="edit-profile-main-div">
            <div className="edit-profile-div">
              <Title level={3} className="edit-profile-title">
                Edit User Profile
              </Title>
              <Row gutter={16}>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="Work Category"
                    name="work_category_ids"
                    rules={[{ required: true, message: "Please enter your name" }]} 
                  >
                    <Select
                        mode="multiple"
                        placeholder="Work Category"
                        options={workCategories.map((val)=>({ value: val.id, label: val.name}))}
                        disabled
                    />
                  </Item>
                </Col>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="User Name"
                    name="name"
                    rules={[{ required: true , message: 'Please enter a Name' }]} 
                  >
                    <Input placeholder="Enter UserName"  />    
                  </Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="User Category"
                    name="user_category_id"
                    rules={[{ required: true, message: "User Category" }]} 
                  >
                    <Select 
                      placeholder="User Category"
                      options={userCategories.map((val)=>({value:val.id , label:val.name}))}
                      disabled
                    />
                  </Item>
                </Col>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item label="Email Id" name="email" rules={[{ type:'email', message: 'Please enter valid email' }]}>
                    <Input placeholder="Enter Email Id" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="Designation"
                    name="designation_id"
                    rules={[{ required: true, message: "Please Select Designation" }]} 
                  >
                    <Select 
                        placeholder="Designation"
                        options={designations.map((val)=>({value:val.id , label:val.name}))}
                        disabled
                    />
                  </Item>
                </Col>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="Mobile No"
                    name="mobile_number"
                    rules={[{ required: true, message: "Please enter Mobile No" }]} 
                  >
                    <Input placeholder="Enter Mobile No" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item 
                    label="User Id"
                    name="user_name"
                    rules={[{ required: true, message: "Enter User Id" }]} 
                  >
                    <Input placeholder="Enter User Id" disabled/>
                  </Item>
                </Col>
                <Col xs={32} sm={16} md={14} lg={12}>
                  <Item label="Adharcard No" name="aadharcard_number">
                    <Input placeholder="Enter Adhaar No" />
                  </Item>
                </Col>
              </Row>

              <Row gutter={16} className="edit-profile-btn-row">
                <Button type="primary" onClick={() => form.submit()} className="edit-profile-btn" icon={<RiSaveLine style={{ fontSize: '1rem' }} />}>
                  Save
                </Button>
                <Button type="primary"  onClick={() => navigate('/home')} className="edit-profile-btn back-btn" icon={<RiArrowGoBackFill style={{ fontSize: '1rem' }} />}>
                  Back
                </Button>
              </Row>
            </div>

            <div className="edit-profile-image-div">
              <Space size={16}>
                <Avatar shape="square" size={310} icon={<UserOutlined />} />
              </Space>
            </div>
          </div>
        </Card>
      </Form>
    );
}
export default EditProfile;
