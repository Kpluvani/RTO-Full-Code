import React from "react";
import { Button, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FaRegSquarePlus } from "react-icons/fa6";

/**
 * DocumentPreview component for displaying document previews (PDF/image) and delete button.
 * @param {Object} props
 * @param {Object} props.docObj - The local document object (may be undefined).
 * @param {Object} props.uploadedDoc - The uploaded document object from backend (may be undefined).
 * @param {string} props.staticBase - The backend static base URL.
 * @param {Function} props.handleDelete - Function to call when delete is clicked.
 * @param {Function} props.getPdfPreviewUrl - Function to get PDF preview URL from docObj.
 * @param {Object} props.fileInputRef - Ref to the file input element for upload.
 * @param {Function} props.handleFileChange - Handler for file drop/upload.
 */
const DocumentPreview = ({ docObj, uploadedDoc, staticBase, handleDelete, getPdfPreviewUrl, fileInputRef, handleFileChange, isReadOnly }) => {
  // Local preview (new upload)
  if (docObj?.previewUrl && !docObj.isExisting) {
    if (docObj.fileType === "application/pdf") {
      return (
        <div style={{ position: "relative", width: "100%" }}>
          <iframe
            src={getPdfPreviewUrl(docObj)}
            title="PDF Preview"
            style={{ width: "100%", height: "400px", border: "none" }}
          />
          { 
              !isReadOnly &&
              <Button
                type="primary"
                danger
                size="small"
                style={{ position: "absolute", top: 14, left: 14, color: "red", background: "rgba(255,255,255,0.8)" }}
                onClick={handleDelete}
              >
                <DeleteOutlined />
              </Button>
          }
        </div>
      );
    } else {
      return (
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <Image
            src={docObj.previewUrl}
            alt="Document Preview"
            style={{ width: "100%", maxHeight: "400px" }}
            preview
          />
          { 
              !isReadOnly &&
              <Button
                type="primary"
                danger
                size="small"
                style={{ position: "absolute", top: 8, right: 8, color: "red", background: "rgba(255,255,255,0.8)" }}
                onClick={handleDelete}
              >
                <DeleteOutlined />
              </Button>
          }
        </div>
      );
    }
  }

  // Existing document from backend
  if (docObj?.isExisting && docObj?.previewUrl) {
    const fileUrl = docObj.previewUrl.startsWith('http') ? docObj.previewUrl : `${staticBase}/${docObj.previewUrl}`;
    const isPdf = fileUrl.endsWith('.pdf');
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{docObj.name}</div>
        {isPdf ? (
          <iframe
            src={fileUrl}
            title={docObj.name}
            style={{ width: "100%", height: "400px", border: "none" }}
          />
        ) : (
          <div>
            <Image
                src={fileUrl}
                alt={docObj.name}
                style={{ width: "100%", maxHeight: "400px" }}
                preview
            />
          </div>
        )}
        { 
          !isReadOnly &&
          <Button
            type="primary"
            danger
            size="small"
            style={{ position: "absolute", top: 8, right: 8, color: "red", background: "rgba(255,255,255,0.8)" }}
            onClick={handleDelete}
          >
            <DeleteOutlined />
          </Button>
        }
      </div>
    );
  }

  // Uploaded doc exists in application.documents
  if (uploadedDoc && uploadedDoc.file) {
    const fileUrl = uploadedDoc.file.startsWith('http') ? uploadedDoc.file : `${staticBase}/${uploadedDoc.file}`;
    const isPdf = fileUrl.endsWith('.pdf');
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>{uploadedDoc.name}</div>
        {isPdf ? (
          <iframe
            src={fileUrl}
            title={uploadedDoc.name}
            style={{ width: "100%", height: "400px", border: "none" }}
          />
        ) : (
          <Image
            src={fileUrl}
            alt={uploadedDoc.name}
            style={{ width: "100%", maxHeight: "400px" }}
            preview
          />
        )}
        { 
          !isReadOnly &&
          <Button
            type="primary"
            danger
            size="small"
            style={{ position: "absolute", top: 8, right: 8, color: "red", background: "rgba(255,255,255,0.8)" }}
            onClick={handleDelete}
          >
            <DeleteOutlined />
          </Button>
        }
      </div>
    );
  }

  // No preview available: show drag-and-drop upload box
  return (
    <div
      style={{
        border: "2px dashed #2259e3",
        borderRadius: "8px",
        padding: "2rem",
        textAlign: "center",
        width: "100%",
        marginTop: "2rem",
        background: "#f8faff",
        cursor: isReadOnly ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: isReadOnly ? 0.6 : 1,
      }}
      onClick={() => !isReadOnly && fileInputRef?.current?.click()}
      onDragOver={e => {
        if (isReadOnly) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.borderColor = "#1677ff";
        e.currentTarget.style.background = "#e6f4ff";
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onDragLeave={e => {
        if (isReadOnly) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.borderColor = "#2259e3";
        e.currentTarget.style.background = "#f8faff";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onDrop={e => {
        if (isReadOnly) return;
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.style.borderColor = "#2259e3";
        e.currentTarget.style.background = "#f8faff";
        e.currentTarget.style.transform = "scale(1)";
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileChange(e.dataTransfer.files[0]);
        }
      }}
    >
      <FaRegSquarePlus style={{ fontSize: "2rem", color: isReadOnly ? "#aaa" : "#2259e3", marginBottom: "0.5rem" }} />
      <div style={{ fontWeight: 400, color: isReadOnly ? "#aaa" : "#2259e3", marginBottom: "0.5rem" }}>
         {isReadOnly ? "File upload disabled" : "Drag & Drop your document here"}
      </div>
      {!isReadOnly && (
        <div style={{ color: "#888" }}>
          or <span style={{ color: "#2259e3", textDecoration: "underline" }}>click to browse</span> and upload
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;