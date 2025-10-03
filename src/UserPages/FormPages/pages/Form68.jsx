import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form68 = ({application}) => {

  const {
    ownerName,
    vehicleChassis,
    maker,
    makerModel,
    registrationNumber,
  } = extractApplicationData(application);

  const handleExportPdf = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    const tableWidth = pageWidth - margin * 2;
    let cursorY = 22;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("FORM 68", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("[Refer rule 183(1)]", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("APPLICATION FORM FOR APPEAL AGAINST TEST RESULT", pageWidth / 2, cursorY, { align: "center" });

    cursorY += 10;

    const headStyle = { fillColor: [255,255,255], textColor: 0, fontStyle: "bold", halign: "left", valign: "middle", lineColor: [120,120,120], lineWidth: 0.25 };
    const styles = { fontSize: 9, cellPadding: 2.5, lineColor: [120,120,120], lineWidth: 0.25 };

    const labelWidth = 68; // matches screenshot proportions

    const addSectionHeader = (title, afterGap = 0) => {
      autoTable(doc, {
        startY: cursorY,
        head: [[{ content: title, colSpan: 2, styles: { ...headStyle } }]],
        body: [],
        theme: "grid",
        styles,
        margin: { left: margin, right: margin },
      });
      cursorY = doc.lastAutoTable.finalY + afterGap;
    };

    const addTwoColRows = (rows, afterGap = 6) => {
      autoTable(doc, {
        startY: cursorY,
        body: rows,
        theme: "grid",
        styles,
        headStyles: headStyle,
        columnStyles: {
          0: { cellWidth: labelWidth },
          1: { cellWidth: tableWidth - labelWidth , styles: { fontStyle: "bold" } },
        },
        margin: { left: margin, right: margin },
        showHead: "never",
      });
      cursorY = doc.lastAutoTable.finalY + afterGap;
    };

    const addThreeColRows = (rows, afterGap = 6) => {
        autoTable(doc, {
          startY: cursorY,
          body: rows,
          theme: "grid",
          styles,
          columnStyles: {
            0: { cellWidth: labelWidth },                       // Label column
            1: { cellWidth: (tableWidth - labelWidth) / 2 , styles: { fontStyle: "bold" } },    // Empty column 1
            2: { cellWidth: (tableWidth - labelWidth) / 2 , styles: { fontStyle: "bold" } },    // Empty column 2
          },
          margin: { left: margin, right: margin },
          showHead: "never",
        });
        cursorY = doc.lastAutoTable.finalY + afterGap;
    };

    const addFullWidthRows = (rows, italic = false, afterGap = 6) => {
      autoTable(doc, {
        startY: cursorY,
        body: rows.map((t) => [{ content: Array.isArray(t) ? t[0] : t, colSpan: 2, styles: { halign: "left", fontStyle: italic ? "italic" : "normal" } }]),
        theme: "grid",
        styles,
        columnStyles: { 0: { cellWidth: tableWidth } },
        margin: { left: margin, right: margin },
        showHead: "never",
      });
      cursorY = doc.lastAutoTable.finalY + afterGap;
    };

    // 1. Personal Details
    addSectionHeader("1. Personal Details");
    addThreeColRows([
      ["Name", "",""],
      ["Address", "",""],
      ["Contact Number", "",""],
      ["Email ID", "",""],
      [{ content: "Are you the registered owner of the vehicle? (Yes/No)", colSpan: 2 }, ""],
      []
    ]);

    // 2. Vehicle Details
    addSectionHeader("2. Vehicle Details");
    addTwoColRows([
      ["Registration Number", `${registrationNumber}`],
      ["Chassis Number", `${vehicleChassis}`],
      ["Make", `${maker}`],
      ["Model", `${makerModel}`],
    ]);

    // 3. Test Station Details
    addSectionHeader("3. Test Station Details");
    // Keep two blocks visually tight but leave a small gap before section 4
    addTwoColRows([
      ["Station Name", ""],
      ["Station Address", ""],
      ["Date of Test", ""],
    ], 0);
    // Add a small gap after this full-width block to separate from Section 4
    addFullWidthRows([
      ["Was the vehicle tested at any other station as well? (Yes/No)"],
      ["If yes, give details:"],
    ], false, 6);

    // 4. Appeal
    addSectionHeader("4. Appeal", 0);
    addFullWidthRows([["Details of the plea against the test results:"]], false, 0);
    addFullWidthRows([["Has the vehicle been repaired, altered or adjusted since last tested? (Yes/ No)"]], false, 0);
    addFullWidthRows([["If yes, give details:"]], false, 0);
    addFullWidthRows([["(Please attach the copy of the test result)"]], true, 0);

    // Save or open the PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };

  return (
    <Typography className="main">
      <Button type="primary" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </Typography>
  );
};

export default Form68;
