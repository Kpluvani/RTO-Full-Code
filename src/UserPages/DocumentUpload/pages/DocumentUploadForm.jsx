import React from "react";
import { Form, Select, Input, Button, Col, Row } from "antd";
import { FaRegSquarePlus } from "react-icons/fa6";

const { Item } = Form;

const DocumentUploadForm = ({
  selectedDocType,
  documentTypes,
  documents,
  fileInputRef,
  handleFileInput,
  form,
  handleDocTypeChange,
  docTypeIndex,
  isReadOnly = false
}) => {
  console.log('form>>>', form.validateFields);
  
return (
  <Row gutter={16}>
    <Col xs={24} sm={12} md={10} lg={8}>
      <Item
        label="Document Type"
        name="document_type"
        rules={[{ required: false, message: "Select Document Type" }]}
        initialValue={selectedDocType}
      >
        <Select
          value={selectedDocType}
          onChange={handleDocTypeChange}
          options={documentTypes?.map((val) => ({
            value: val.id,
            label: val.name,
          }))}
          placeholder="Select Document Type"
        />
      </Item>
    </Col>
    <Col xs={24} sm={12} md={10} lg={8}>
      <Item
        label={`Document (${docTypeIndex + 1} of ${documentTypes.length})`}
        name={['documents', selectedDocType, 'name']}
        rules={[{ required: false, message: 'Please enter document Name' }]}
        initialValue={documents[selectedDocType]?.name || ''}
      >
        <Input placeholder="Enter Document Name"  disabled={isReadOnly} />
      </Item>
    </Col>
    <Col xs={24} sm={12} md={10} lg={8}>
      {/* <Button
        type="primary"
        style={{ width: "100%", marginTop: "2rem" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <FaRegSquarePlus style={{ fontSize: "1rem" }} /> Upload Document
      </Button> */}
      <input
        type="file"
        name={"document_img"}
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileInput}
      />
    </Col>
  </Row>
)
} ;

export default DocumentUploadForm;