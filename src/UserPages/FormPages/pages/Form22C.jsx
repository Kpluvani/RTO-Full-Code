import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";

const { Text } = Typography;

const Form22C = ({application}) => {
  const handleExportPdf = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 18;
    const marginRight = 18;
    const printableWidth = pageWidth - marginLeft - marginRight;
    let y = 20;

    // ===== Title =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FORM 22-C", pageWidth / 2, y, { align: "center" });
    y += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("[(Refer rule 47A (1))]", pageWidth / 2, y, { align: "center" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.2);
    doc.text(
      "REQUEST AND PERMISSION FOR \nALTERATION/RETROFITMENT/ADAPTATION",
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("PART I", pageWidth / 2, y, { align: "center" });
    y += 5.2;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("(To be submitted by the Motor Vehicle Owner)", pageWidth / 2, y, { align: "center" });
    y += 10;
    
    doc.setFontSize(10.5);
    doc.setFont("helvetica", "normal");

    // ===== Helper function for paragraph text =====
    const addParagraph = (text) => {
      const lines = doc.splitTextToSize(text, printableWidth);
      doc.text(lines, marginLeft, y, { align: "left", lineHeightFactor: 1.35 });
      y += lines.length * 5 + 3;
    };

    // ===== Body Paragraphs PART I =====
    addParagraph(
      "\tI hereby request the Registering Authority to accord prior permission to undertake alteration/retrofitment in my Motor Vehicle as per details mentioned below:"
    );
    addParagraph(
      "\tI hereby submit that I shall carry out the permitted alteration/retrofitment as per the provisions under CMVR 1989 and shall ensure that motor vehicle so altered shall be submitted for endorsement in the registration certificate along with necessary compliance documents."
    );
    y += 3;

    // ===== Place, Date & Signature =====
    doc.text("Place: ..........................", marginLeft, y);
    y += 10;
    doc.text("Date: ..........................", marginLeft, y);
    doc.text("(Signature of the Owner)", pageWidth - marginRight, y, { align: "right" });
    y += 12;

    // ===== Applicant Details =====
    const rightX = pageWidth - marginRight;
    const name = application?.OwnerDetail?.owner_name || "";
    const designation = application?.OwnerDetail?.designation || "";
    const mobileNumber = application?.OwnerDetail?.mobile_number || "";
    const registrationNumber = application?.VehicleDetail?.registration_no || "";

    doc.setFont("helvetica", "bold");
    doc.text(name, marginLeft + 115.5, y, { align: "left" });
    y += 1;
    doc.setFont("helvetica", "normal");
    doc.text("Name...........................................................", rightX, y, { align: "right" });
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text(designation, marginLeft + 125.5, y, { align: "left" });
    y += 1;
    doc.setFont("helvetica", "normal");
    doc.text("Designation:................................................", rightX, y, { align: "right" });
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text(mobileNumber, marginLeft + 130.5, y, { align: "left" });
    y += 1;
    doc.setFont("helvetica", "normal");
    doc.text("Mobile Number............................................", rightX, y, { align: "right" });
    y += 15;

    // ===== PART II =====
    doc.setFont("helvetica", "bold");
    doc.text("PART II", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFont("helvetica", "italic");
    doc.text("(To be issued by the Registering Authority)", pageWidth / 2, y, { align: "center" });
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text(registrationNumber, marginLeft + 85.5, y, { align: "left" });
    y += 1;
    doc.setFont("helvetica", "normal");
    addParagraph(
      "\tMotor Vehicle, bearing Registration Number .............................................., is hereby permitted/not permitted to alter and/or retrofit as per provisions of CMVR 1989. After the retrofitment/alteration is completed, the motor vehicle shall be produced for verification and endorsement in the Registration Certificate."
    );
    addParagraph(
      "2. In case permission is not accorded reasons ........................................................................"
    );
    y += 3;

    doc.text("Place: ..........................", marginLeft, y);
    y += 10;
    doc.text("Date: ..........................", marginLeft, y);
    doc.text("(Signature of the authorised person)", pageWidth - marginRight, y, { align: "right" });
    y += 12;

    // ===== Issuer Details =====
    doc.text("Name...........................................................", rightX, y, { align: "right" });
    y += 10;
    doc.text("Designation:................................................", rightX, y, { align: "right" });
    y += 10;
    doc.text("Mobile Number............................................", rightX, y, { align: "right" });

    // ===== Generate PDF =====
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <Typography className="main">
      <Button type="primary" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </Typography>
  );
};

export default Form22C;
