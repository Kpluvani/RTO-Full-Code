import React from "react";
import { Typography, Form } from "antd";

const { Text, Title } = Typography;
const { Item } = Form;

const OwnerVehicleDetails = ({ application }) => (
  <Item label="Owner & Vehical Details" name="owner_&_Vehical_Details" >
    <Text>{application?.OwnerDetail?.owner_name}</Text>
    <br />
    <Text>S/W/D of {application?.OwnerDetail?.relative_name}</Text>
    <br />
    <Text>{application?.PermanentAddress?.house_no} </Text>
    <br />
    <Text> {application?.PermanentAddress?.landmark}</Text>
    <br />
    <Text>{application?.PermanentAddress?.city} {application?.PermanentAddress?.District?.name}</Text>
    <br />
    <Text>{application?.PermanentAddress?.State?.name} - {application?.PermanentAddress?.pincode}</Text>
    <br />
    <Text>Sell Amount - {application?.VehicleDetail?.sell_amount}</Text>
    <br />
    <Text>Engine No- {application?.VehicleDetail?.engine_no}</Text>
    <br />
    <Text>Seating Capacity - {application?.VehicleDetail?.seating_capacity}</Text>
    <br />
  </Item>
);

export default OwnerVehicleDetails;