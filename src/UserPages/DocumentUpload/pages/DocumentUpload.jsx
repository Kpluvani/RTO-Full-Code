import React, { useState, useRef, useEffect } from "react";
import { Typography, Card, Form,  message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CgArrowLeftR, CgArrowRightR } from "react-icons/cg";
import { fetchAllDocumentTypes } from "@/features/documentType/documentTypeSlice";
import { fetchApplicationById, saveDocumentUpload } from '@/features/application/applicationSlice';
import { isBase64Pdf, isBase64Image, isUrl, isFilePath, base64ToBlobUrl, getBackendStaticBaseUrl } from "@/utils/documentUtils";
import { FILE_MOVEMENT_TYPE } from '@/utils';
import DocumentPreview from "./DocumentPreview";
import OwnerVehicleDetails from "./OwnerVehicleDetails";
import InsuranceDetails from "./InsuranceDetails";
import DocumentUploadForm from "./DocumentUploadForm";
import { SaveAndFileMovement } from "@/Components/SaveAndFileMovement/pages";
import { fetchAllHoldReasons } from "@/features/HoldReason/HoldReasonSlice";
import "../styles/documentUpload.css";

const { Title } = Typography;
const { Item } = Form;

const DocumentUpload = ({ application, documentTypes, processes, isReadOnly }) => {
  // Each docType has its own name and file info
  const [documents, setDocuments] = useState({});
  const [selectedDocType, setSelectedDocType] = useState(documentTypes[0]?.id || null);
  const [docTypeIndex, setDocTypeIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Store blob URLs to clean up on unmount
  const blobUrlsRef = useRef({});
  // Track which doc types should hide existing uploaded preview locally
  const [hiddenUploadedDocTypes, setHiddenUploadedDocTypes] = useState(new Set());
  // Track server documents marked for deletion; applied on save only
  const [pendingDeletions, setPendingDeletions] = useState(new Set());

  const { allData: holdReasons = [] } = useSelector((state) => state?.holdReason || {});


  // Keep form fields in sync for the given document type
  const syncFormForDocType = React.useCallback((docTypeId) => {
    if (!docTypeId) return;
    const localName = documents[docTypeId]?.name;
    const uploadedName = application?.documents?.find(d => d.document_type_id === docTypeId)?.name;
    form.setFieldsValue({
      document_type: docTypeId,
      documents: {
        [docTypeId]: {
          name: typeof localName !== 'undefined' ? localName : (uploadedName || ''),
        },
      },
    });
  }, [documents, application?.documents, form]);

  // Fetch all document types on mount
  useEffect(() => {
    dispatch(fetchAllDocumentTypes());
    dispatch(fetchAllHoldReasons());
  }, [dispatch]);

  // Set form fields for current docType when docType changes
  useEffect(() => {
    if (selectedDocType) syncFormForDocType(selectedDocType);
  }, [selectedDocType, documents, form, syncFormForDocType]);

  useEffect(() => {
    if (application?.documents && application.documents.length > 0) {
      const existingDocs = {};
      const usedTypes = new Set();
  
      application.documents.forEach(doc => {
        if (doc.document_type_id && doc.file) {
          const docTypeId = doc.document_type_id;
          // Find the document type object for this id
          // const docTypeObj = documentTypes.find(dt => dt.id === docTypeId);
          // Determine file type from extension
          let fileType = "image/jpeg";
          if (doc.file.endsWith(".pdf")) fileType = "application/pdf";
          else if (doc.file.endsWith(".png")) fileType = "image/png";
          else if (doc.file.endsWith(".jpg") || doc.file.endsWith(".jpeg")) fileType = "image/jpeg";
          existingDocs[docTypeId] = {
            name: doc.name || "",
            // name: doc.name || docTypeObj?.name || "",
            file: doc.file,
            previewUrl: doc.file,
            fileType,
            isExisting: true, // Mark as existing document
            documentId: doc.id, // Store document ID for deletion
          };
          usedTypes.add(docTypeId);
        }
      });
  
      setDocuments(existingDocs);
      setUsedDocTypes(usedTypes);
    }
  }, [application?.documents, documentTypes]);

  // When docType changes via select
  const handleDocTypeChange = async (value) => {
    // Find the index of the selected document type
    const newIndex = documentTypes.findIndex(dt => dt.id === value);
    if (newIndex !== -1) {
      setDocTypeIndex(newIndex);
    }

    // Always update selectedDocType first
    setSelectedDocType(value);
    // Sync form for new selection
    syncFormForDocType(value);

    // If we already have document data for this type and it has uploaded content, preserve it
    const existingDoc = documents[value];
    if (existingDoc && existingDoc.previewUrl && existingDoc.file) {
      console.log('Document already uploaded for this type, preserving existing data');
      return;
    }

    const where = {
      id: value,
    };
    const data = await dispatch(fetchAllDocumentTypes({ where }));
    // const doc = null;
    const doc = data?.payload?.data[0]?.document_img;

    let fileType = null;
    let previewUrl = null;

    if (doc) {
      // If doc is a base64 PDF
      if (isBase64Pdf(doc)) {
        fileType = "application/pdf";
        // Convert base64 to blob URL for iframe preview
        previewUrl = base64ToBlobUrl(doc, "application/pdf");
        // Store for cleanup
        if (previewUrl) {
          blobUrlsRef.current[value] = previewUrl;
        }
      } else if (isBase64Image(doc)) {
        // If doc is a base64 image
        fileType = doc.startsWith("data:image/png") ? "image/png" : "image/jpeg";
        previewUrl = doc;
      } else if (isUrl(doc)) {
        // If doc is a URL, try to guess type from extension
        if (doc.endsWith(".pdf")) {
          fileType = "application/pdf";
          previewUrl = doc;
        } else if (doc.endsWith(".jpg") || doc.endsWith(".jpeg")) {
          fileType = "image/jpeg";
          previewUrl = doc;
        } else if (doc.endsWith(".png")) {
          fileType = "image/png";
          previewUrl = doc;
        } else {
          previewUrl = doc;
        }
      } else {
        // fallback
        previewUrl = doc;
      }
    }

    setDocuments((prev) => ({
      ...prev,
      [value]: {
        name: prev[value]?.name || "",
        file: prev[value]?.file || null,
        previewUrl: prev[value]?.previewUrl || previewUrl || null,
        fileType: prev[value]?.fileType || fileType || null,
        base64: prev[value]?.base64 || null,
      },
    }));
    await dispatch(fetchAllDocumentTypes());
  };

  // File input handler
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileChange(file);
  };

  // File change handler for drag/drop or input
  const handleFileChange = (file) => {
    if (!file) return;

    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isPDF = file.type === "application/pdf";

    if (!isImage && !isPDF) {
      message.error("Only JPG, PNG, or PDF files are allowed.");
      return;
    }

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        // Unhide uploaded preview replacement for this type
        setHiddenUploadedDocTypes(prev => {
          const next = new Set(prev);
          next.delete(selectedDocType);
          return next;
        });
        setDocuments((prev) => ({
          ...prev,
          [selectedDocType]: {
            ...prev[selectedDocType],
            file,
            previewUrl: reader.result,
            fileType: file.type,
          },
        }));
      };
      reader.readAsDataURL(file);
    } else if (isPDF) {
      // PDF handling: convert to base64 and set as previewUrl
      const reader = new FileReader();
      reader.onload = () => {
        // Also create a blob URL for iframe preview
        const base64 = reader.result;
        const blobUrl = base64ToBlobUrl(base64, "application/pdf");
        // Store for cleanup
        if (blobUrl) {
          blobUrlsRef.current[selectedDocType] = blobUrl;
        }
        
        // Unhide uploaded preview replacement for this type
        setHiddenUploadedDocTypes(prev => {
          const next = new Set(prev);
          next.delete(selectedDocType);
          return next;
        });
        setDocuments((prev) => ({
          ...prev,
          [selectedDocType]: {
            ...prev[selectedDocType],
            file,
            previewUrl: blobUrl,
            fileType: file.type,
            base64: base64, // keep base64 for upload
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean up PDF object URLs on unmount and when docType/file changes
  useEffect(() => {
    const urlsToCleanup = { ...blobUrlsRef.current };
    return () => {
      Object.values(urlsToCleanup).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Next docType
  const handleNext = async () => {
    if (docTypeIndex < documentTypes.length - 1) {
      const nextIdx = docTypeIndex + 1;
      const nextDocType = documentTypes[nextIdx].id;
      console.log('Next clicked - changing to:', nextDocType);
      setDocTypeIndex(nextIdx);
      setSelectedDocType(nextDocType);
      // Sync form fields for the next doc type
      syncFormForDocType(nextDocType);
      // Trigger the document type change handler
      await handleDocTypeChange(nextDocType);
    }
  };

  // Previous docType
  const handlePrev = async () => {
    if (docTypeIndex > 0) {
      const prevIdx = docTypeIndex - 1;
      const prevDocType = documentTypes[prevIdx].id;
      console.log('Prev clicked - changing to:', prevDocType);
      setDocTypeIndex(prevIdx);
      setSelectedDocType(prevDocType);
      // Sync form fields for the previous doc type
      syncFormForDocType(prevDocType);
      console.log('documents prevDocType>>>', prevDocType, documentTypes[prevIdx], documents);
      
      // Trigger the document type change handler
      await handleDocTypeChange(prevDocType);
    }
  };

  // State for tracking used document types
  const [usedDocTypes, setUsedDocTypes] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Ensure a default selection exists if none
  useEffect(() => {
    if (!selectedDocType && documentTypes.length > 0) {
      setSelectedDocType(documentTypes[0].id);
    }
  }, [selectedDocType, documentTypes]);

  // Initialize selected document type when documentTypes change
  useEffect(() => {
    if (documentTypes.length > 0 && !selectedDocType) {
      setSelectedDocType(documentTypes[0].id);
    }
  }, [documentTypes, selectedDocType]);

  // Update form field when selectedDocType changes
  useEffect(() => {
    if (selectedDocType) {
      form.setFieldsValue({
        document_type: selectedDocType
      });
    }
  }, [selectedDocType, form]);


  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Collect all documents that have been uploaded
      const allDocuments = {};
      const files = {};
      Object.keys(documents).forEach(docTypeId => {
        const doc = documents[docTypeId];
        if (doc && doc.previewUrl && doc.file) {
          const docType = documentTypes?.filter(dt => dt.id == docTypeId);
          if (docType) {
            allDocuments[docTypeId] = {
              document_type_id: docTypeId,
              name: documents[docTypeId]?.name || '',
              // file field will be set by backend from uploaded file
            };
            files[docTypeId] = doc.file;
          }
        }
      });
      // Prepare the document data in the format expected by the backend
      const documentData = {
        documents: allDocuments,
        process_id: application?.Process?.id,
        file_number: application?.file_number,
        remark: 'Documents Uploaded',
        document_ids_to_delete: Array.from(pendingDeletions)
      };
      // Call the saveDocumentUpload action
      const resultAction = await dispatch(saveDocumentUpload({
        id: application?.id,
        data: documentData,
        files
      }));
      await dispatch(fetchApplicationById(application?.id));
      if (resultAction?.error) {
        throw new Error(resultAction?.payload || 'Failed to upload documents');
      }
      // Add all uploaded document types to used types
      const uploadedDocTypes = Object.keys(allDocuments);
      const newUsedDocTypes = new Set([...usedDocTypes, ...uploadedDocTypes]);
      setUsedDocTypes(newUsedDocTypes);
      message.success(`${uploadedDocTypes.length} document(s) uploaded successfully`);
      // Clear pending deletions and all uploaded document data
      setPendingDeletions(new Set());
      
      // Clear all uploaded document data
      setDocuments(prev => {
        const newDocs = { ...prev };
        uploadedDocTypes.forEach(docTypeId => {
          delete newDocs[docTypeId];
        });
        return newDocs;
      });
      // Move to the next available document type if any
      const nextDocType = documentTypes.find(dt => !newUsedDocTypes.has(dt.id))?.id;
      if (nextDocType) {
        setSelectedDocType(nextDocType);
      }
    } catch (error) {
      console.error('Error saving documents:', error);
      message.error(error.message || 'Failed to save documents');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete file for current docType (local-only; server deletion queued for save)
  const handleDelete = async () => {
    try {
      const hasLocal = !!documents[selectedDocType]?.file;
      const existingUploaded = application?.documents?.find(
        (d) => d.document_type_id === selectedDocType
      );
      
      // If no local file but an uploaded doc exists, mark it for deletion on save
      if (hasLocal && existingUploaded?.id) {
        console.log('pendingDeletions haslocal existingId>>>', pendingDeletions, !hasLocal, existingUploaded.id);
        setPendingDeletions(prev => {
          const next = new Set(prev);
          next.add(existingUploaded.id);
          return next;
        });
        message.info('Marked for deletion. Changes will be applied on save.');
      }

      // Clean up blob URL if present
      const url = blobUrlsRef.current[selectedDocType];
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
        delete blobUrlsRef.current[selectedDocType];
      }
      // Hide any existing uploaded preview for this doc type locally
      setHiddenUploadedDocTypes((prev) => {
        const next = new Set(prev);
        next.add(selectedDocType);
        return next;
      });
      // Remove from local state so drag-and-drop box shows and user can re-upload
      setDocuments((prev) => {
        const newDocs = { ...prev };
        delete newDocs[selectedDocType];
        return newDocs;
      });
      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      message.error('Failed to delete');
    }
  };

  // For PDF preview: prefer blob URL if available, else fallback to previewUrl
  const getPdfPreviewUrl = (docObj) => {
      if (!docObj) return null;
      console.log('docObj>>>', docObj);
    
    if (docObj.fileType === "application/pdf") {
      // If it's a blob URL, return as is
      if (typeof docObj.previewUrl === "string" && docObj.previewUrl.startsWith("blob:")) {
        return docObj.previewUrl;
      }
      // If it's a backend file path, prepend slash if needed
      if (isFilePath(docObj.previewUrl)) {
        return docObj.previewUrl.startsWith("/") ? docObj.previewUrl : `/${docObj.previewUrl}`;
      }
    }
    return docObj.previewUrl || null;
  };

  // Handle form submission
  const onFinish = async () => {
    try {
      await handleSave();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // File Movement handler
  const handleFileMovement = async (fileMovementData, closeDialog) => {
    if (fileMovementData.file_movement_type === FILE_MOVEMENT_TYPE.NEXT) {
      form.validateFields().then(async (res) => {
        console.log('res>>', res);
        
        const allDocuments = {};
        const files = {};
        Object.keys(documents).forEach(docTypeId => {
          const doc = documents[docTypeId];
          if (doc && doc.previewUrl && doc.file) {
            const docType = documentTypes?.filter(dt => dt.id == docTypeId);
            if (docType) {
              allDocuments[docTypeId] = {
                document_type_id: docTypeId,
                name: documents[docTypeId]?.name || '',
                // file field will be set by backend from uploaded file
              };
              files[docTypeId] = doc.file;
            }
          }
        });
        // Prepare the document data in the format expected by the backend
        const documentData = {
          documents: allDocuments,
          process_id: application?.Process?.id,
          file_number: application?.file_number,
          document_ids_to_delete: Array.from(pendingDeletions),
        };
        const data = { ...documentData, ...fileMovementData };
        // Call the saveDocumentUpload action
        const result = await dispatch(saveDocumentUpload({
          id: application?.id,
          data: data,
          files
        }));
        console.log('<<Data-values---', result);
        if (result.error) {
            message.error(result.payload || 'Failed to save data');
        } else {
          message.success(result.payload.message || 'Data saved successfully');
          if (data.file_movement) {
            navigate('/home');
          }
        }
        closeDialog && closeDialog();
      }).catch((e) => {
        onFinishFailed(e);
        closeDialog && closeDialog();
      })
    } else {
      form.getFieldsValue();
      const allDocuments = {};
        const files = {};
        Object.keys(documents).forEach(docTypeId => {
          const doc = documents[docTypeId];
          if (doc && doc.previewUrl && doc.file) {
            const docType = documentTypes?.filter(dt => dt.id == docTypeId);
            if (docType) {
              allDocuments[docTypeId] = {
                document_type_id: docTypeId,
                name: documents[docTypeId]?.name || '',
                // file field will be set by backend from uploaded file
              };
              files[docTypeId] = doc.file;
            }
          }
        });
        // Prepare the document data in the format expected by the backend
        const documentData = {
          documents: allDocuments,
          process_id: application?.Process?.id,
          file_number: application?.file_number,
          document_ids_to_delete: Array.from(pendingDeletions),
        };
        const data = { ...documentData, ...fileMovementData };
        // Call the saveDocumentUpload action
        const result = await dispatch(saveDocumentUpload({
          id: application?.id,
          data: data,
          files
        }));
        console.log('<<Data-values---', result);
        if (result.error) {
            message.error(result.payload || 'Failed to save data');
        } else {
          message.success(result.payload.message || 'Data saved successfully');
          if (data.file_movement) {
            navigate('/home');
          }
        }
      closeDialog && closeDialog();
    }
  };

  // Handle form validation failure
  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Please fill in all required fields');
  };
  
  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={(changedValues, allValues) => {
        const maybeDocs = allValues?.documents;
        if (maybeDocs && selectedDocType in maybeDocs) {
          const updatedName = maybeDocs[selectedDocType]?.name;
          if (typeof updatedName !== 'undefined') {
            setDocuments(prev => ({
              ...prev,
              [selectedDocType]: {
                ...prev[selectedDocType],
                name: updatedName,
              },
            }));
          }
        }
      }}
      layout="vertical"
      className="document-verify-form"
    >
      <div
        className="document-upload"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Title
          level={4}
          className="left-text"
          style={{ alignSelf: "flex-start", color: "#2259e3" }}
        >
          Document Verify
        </Title>

        <Card style={{ width: "100%" }}>
          <div className="main">
            <div className="part-one">
              <OwnerVehicleDetails application={application} />
              <InsuranceDetails application={application} />
            </div>

            <div className="arrow">
              <CgArrowLeftR
                style={{
                  fontSize: "2rem",
                  color: "#2259e3",
                  margin: "1rem",
                  cursor: docTypeIndex > 0 ? "pointer" : "not-allowed",
                  opacity: docTypeIndex > 0 ? 1 : 0.5,
                }}
                onClick={handlePrev}
                title="Previous"
              />

              <div className="part-two">
                <div className="part-two-top">
                  <DocumentUploadForm
                    selectedDocType={selectedDocType}
                    documentTypes={documentTypes}
                    documents={documents}
                    setDocuments={setDocuments}
                    fileInputRef={fileInputRef}
                    handleFileInput={handleFileInput}
                    form={form}
                    handleDocTypeChange={handleDocTypeChange}
                    docTypeIndex={docTypeIndex}
                    isReadOnly={isReadOnly}
                  />
                </div>

                <div className="part-two-bottom">
                  <Card style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                    <Item name={['documents', selectedDocType, 'file']} noStyle>
                      <div>
                        {(() => {
                          // Prefer local preview if available, else show uploaded doc from backend
                          const docObj = documents[selectedDocType];
                          const hideUploaded = hiddenUploadedDocTypes.has(selectedDocType);
                          const uploadedDoc = hideUploaded ? undefined : application?.documents?.find(d => d.document_type_id === selectedDocType);
                          const staticBase = getBackendStaticBaseUrl();
                          return (
                            <DocumentPreview
                              docObj={docObj}
                              uploadedDoc={uploadedDoc}
                              staticBase={staticBase}
                              handleDelete={handleDelete}
                              getPdfPreviewUrl={getPdfPreviewUrl}
                              fileInputRef={fileInputRef}
                              handleFileChange={handleFileChange}
                              isReadOnly={isReadOnly}
                            />
                          );
                        })()}
                      </div>
                    </Item>
                  </Card>
                </div>
              </div>

              <CgArrowRightR
                style={{
                  fontSize: "2rem",
                  color: "#2259e3",
                  margin: "1rem",
                  cursor: docTypeIndex < documentTypes.length - 1 ? "pointer" : "not-allowed",
                  opacity: docTypeIndex < documentTypes.length - 1 ? 1 : 0.5,
                }}
                onClick={handleNext}
                title="Next"
              />
            </div>
          </div>
        </Card>

        {/* <Button
          type="primary"
          style={{ margin: "1rem" }}
          onClick={handleSave}
          loading={isSaving}
          disabled={Object.keys(documents).filter(key => documents[key]?.previewUrl).length === 0}
        >
          Save {Object.keys(documents).filter(key => documents[key]?.previewUrl).length} Document(s)
        </Button> */}
      { 
        !isReadOnly &&  
        <SaveAndFileMovement
          handleFileMovement={handleFileMovement}
          handleSaveData={form.submit}
          holdReasons={holdReasons}
          processes={processes}
          currProcessId={application?.process_id}
        />
      }
      </div>
    </Form>
  );
};

export default DocumentUpload;
