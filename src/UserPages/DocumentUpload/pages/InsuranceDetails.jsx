import React from "react";
import { Typography, Form } from "antd";
import { convertUTCToIST, DateFormat } from "@/utils";

/**
 * Displays insurance details.
 * @param {Object} props
 * @param {Object} props.application - The application object containing details.
 */
const { Text } = Typography;
const { Item } = Form;

const InsuranceDetails = ({ application }) => (
  <Item label="Insurance Details" name="Insurance_Details" >
    <Text>From - {application?.InsuranceDetail?.InsuranceCompany?.name}</Text>
    <br />
    <Text>Policy No - {application?.InsuranceDetail?.policy_no || ''}</Text>
    <br />
    <Text>
      Valid From: {application?.InsuranceDetail?.insurance_from && convertUTCToIST(application?.InsuranceDetail?.insurance_from).format(DateFormat)}
      {" "}To: {application?.InsuranceDetail?.insurance_upto && convertUTCToIST(application?.InsuranceDetail?.insurance_upto).format(DateFormat)}
    </Text>
    <br />
  </Item>
);

export default InsuranceDetails;