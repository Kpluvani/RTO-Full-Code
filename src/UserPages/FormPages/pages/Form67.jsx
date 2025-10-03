import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

const Form67 = () => {
  const handleExportPdf = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    const tableWidth = pageWidth - margin * 2;
    let cursorY = 16;

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("FORM 67", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("[Refer rule 184(7)]", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("FORM FOR AUDIT AND ASSESSMENT REPORT OF AN", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;
    doc.text("AUTOMATED TESTING STATION", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.8);
    doc.text("(During operations)", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;

    const commonHead = { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: "bold", halign: "center", valign: "middle", lineColor: [120,120,120], lineWidth: 0.25 };
    const commonBody = { textColor: [0,0,0]};
    const commonStyles = { fontSize: 9, cellPadding: 2.5, lineColor: [120,120,120], lineWidth: 0.25 };

    // Table 1: Audit Details (two-column label/value grid repeated)
    const colWidth = (pageWidth - margin * 2) / 4;

    autoTable(doc, {
        startY: cursorY + 2,
        body: [
            ["Audit Number and Assessment", "", "Date of Audit and Assessment", ""],
            ["Auditing Agency and Auditor’s Name", "", "Auditor’s Signature", ""],
            ["Station Name", "", "Station Number", ""],
            ["Registration certificate Number", "", "Operational Hours", ""],
            ["Address", "", "Contact Number", ""],
        ],// no data yet
        theme: "grid",
        styles: {
            fontSize: 10,
            halign: "left",
            valign: "middle",
            cellPadding: 2,
            lineWidth: 0.3,
            lineColor: [128, 128, 128], // gray borders
        },
        bodyStyles: commonBody,
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            lineWidth: 0.3,
            lineColor: [128, 128, 128], // gray borders
            halign: "left",
            valign: "middle",
        },
        columnStyles: {
            0: { cellWidth: colWidth },
            1: { cellWidth: colWidth },
            2: { cellWidth: colWidth },
            3: { cellWidth: colWidth },
        },
        margin: { left: margin, right: margin },
    });

    cursorY = doc.lastAutoTable.finalY + 4;

    // Section 1: Registration certificate available? + Yes/No
    autoTable(doc, {
      startY: cursorY,
      body: [[{content: "1. Registration certificate available?", colSpan: 1, styles: { halign: "left" }}, "Yes","  ", "No","  "]],
      theme: "grid",
      styles: commonStyles,
      bodyStyles: commonHead,
      columnStyles: { 
        0: { cellWidth: 107 }, 
        1: { cellWidth: 20 }, 
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
    },
      margin: { left: margin, right: margin },
    });
    cursorY = doc.lastAutoTable.finalY + 4;

    // Section 2: Test equipment completeness and calibration
    autoTable(doc, {
      startY: cursorY,
      head: [[{ content: "2. Test equipment completeness and calibration", colSpan: 5, styles: { halign: "left" } }]],
      body: [],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      margin: { left: margin, right: margin },
    });
    cursorY = doc.lastAutoTable.finalY;

    autoTable(doc, {
      startY: cursorY,
      head: [["Sl. No.", "Equipment", "Available and functional (Yes/No)", "Calibration Frequency", "Date of last calibration"]],
      body: [
        ["a.", "Roller brake tester", "", "", ""],
        ["b.", "Axle Weight Measurement", "", "", ""],
        ["c.", "Suspension tester", "", "", ""],
        ["d.", "Side slip tester", "", "", ""],
        ["e.", "Joint Play tester", "", "", ""],
        ["f.", "Automatic Steering Gear Play Detector", "", "", ""],
        ["g.", "Automatic Head light tester", "", "", ""],
        ["h.", "Opacimeter", "", "", ""],
        ["i.", "Exhaust gas analyzer", "", "", ""],
        ["j.", "Speedometer Tester/Speed Governor Tester", "", "", ""],
        ["k.", "Sound level meter", "", "", ""],
      ],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 38 + 38 + 38) }, 2: { cellWidth: 38 }, 3: { cellWidth: 38 }, 4: { cellWidth: 38 } },
      margin: { left: margin, right: margin },
    });
    cursorY = doc.lastAutoTable.finalY + 2;

    // Remarks line for section 2
    autoTable(doc, {
      startY: cursorY,
      body: [[{ content: "Remarks:", styles: { halign: "left" , minCellHeight: 35} }]],
      theme: "grid",
      styles: commonStyles,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
      showHead: "never",
    });

    // --- Page 2: Sections 3, 4, 5 ---
    doc.addPage();
    let y3 = 16;

    // Section 3 header
    autoTable(doc, {
      startY: y3,
      head: [[{ content: "3. Availability of suitable Manpower", colSpan: 5, styles: { halign: "left" } }]],
      body: [],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      head: [["Sl. No.", "Designation", "Number of Staff", "Compliance with rules (Yes/No)", "Remarks"]],
      body: [
        ["a.", "Centre Head/Manager", "", "", ""],
        ["b.", "IT in charge/System Analyst", "", "", ""],
        ["c.", "Data Entry Operator", "", "", ""],
        ["d.", "Driver (LMV/HMV)", "", "", ""],
        ["e.", "Lane In charge/Supervisor", "", "", ""],
        ["f.", "Lane Operator", "", "", ""],
        ["g.", "Maintenance Technician", "", "", ""],
      ],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 28 + 38 + 25) }, 2: { cellWidth: 28 }, 3: { cellWidth: 38 }, 4: { cellWidth: 25 } },
      margin: { left: margin, right: margin },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      body: [[{ content: "Remarks:", styles: { halign: "left" , minCellHeight: 28} }]],
      theme: "grid",
      styles: commonStyles,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
      showHead: "never",
    });

    // Section 4 header
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 4,
      head: [[{ content: "4. Sample check of vehicles to ensure compliance with testing process", colSpan: 6, styles: { halign: "left" } }]],
      body: [],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      head: [["Lane", "Lane type (2-Wheeler/3-\nWheeler/LCV/HCV)", { content: "Compliance (Yes/No)", colSpan: 3 }, "Notes"], ["", "", "Vehicle-1", "Vehicle-2", "Vehicle-3", ""]],
      body: [["Lane-1", "", "", "", "", ""], ["Lane-2", "", "", "", "", ""], ["Lane-3", "", "", "", "", ""], ["Lane-4", "", "", "", "", ""]],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 60 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 }, 5: { cellWidth: tableWidth - (20 + 60 + 25 + 25 + 25) } },
      margin: { left: margin, right: margin },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 2,
      body: [[{ content: "Remarks:", styles: { halign: "left" , minCellHeight: 28} }]],
      theme: "grid",
      styles: commonStyles,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
      showHead: "never",
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("Note: Vehicle number and test report of the sample vehicles checked shall be attached.", margin, doc.lastAutoTable.finalY + 6);

    // Section 5 header
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [[{ content: "5. Additional checks", colSpan: 4, styles: { halign: "left" } }]],
      body: [],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY,
      head: [["Sl. No.", "Check", "Yes", "No"]],
      body: [
        ["a.", "IT system as per prescribed specifications", "", ""],
        ["b.", "Test result data masked and encrypted", "", ""],
        ["c.", "CCTV cameras installed and functional", "", ""],
        
      ],
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 20 + 20) }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 } },
      margin: { left: margin, right: margin },
    });

    // --- Page 3 continuation (additional checks e-i like in image) ---
    doc.addPage();
    let y2 = 16;

    autoTable(doc, {
      startY: y2,
      body: [
             ["d.", "Test data kept in secure facility and uploaded on VAHAN", "", ""],
             ["e.", "Lane screens do not display any test results", "", ""],
             ["f.", "Infrastructure facilities as per guidelines", "", ""],
             ["g.", "Appointment booking only through electronic portal", "", ""],
             ["h.", "Fire safety clearance", "", ""],
             ["i.", "Adequate provision for parking and security of the vehicles", "", ""]],
      
      theme: "grid",
      styles: commonStyles,
      headStyles: commonHead,
      bodyStyles: commonBody,
      columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: tableWidth - (12 + 20 + 20) }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 } },
      margin: { left: margin, right: margin },
      showHead: "firstPage",
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 3,
      body: [[{ content: "Observed non-compliance:", styles: { halign: "left" } }], [{ content: "Corrective action to be taken:", styles: { halign: "left" } }]],
      theme: "grid",
      styles: commonStyles,
      bodyStyles: commonBody,
      margin: { left: margin, right: margin },
      showHead: "never",
    });

    const pdfBlob = await new Promise((resolve) => {
        const blob = doc.output("blob");
        resolve(blob);
    });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await new Promise((resolve) => {
        setTimeout(() => {
            window.open(pdfUrl);
            resolve();
        }, 300);
    });
  };

  return (
    <Typography className="main">
      <Button type="primary" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </Typography>
  );
};

export default Form67;
