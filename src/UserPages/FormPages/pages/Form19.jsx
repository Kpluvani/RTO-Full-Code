import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import '../styles/formpages.css';

const { Title } = Typography;

const Form19 = ({ application }) => {
  console.log("Form19 Application:", application);
  
  const handleExportPdf = async () => {
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 14;

    // ===== Header =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FORM 19", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text("[Refer Rule 43]", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(
      "REGISTER TO BE MAINTAINED BY HOLDER OF TRADE CERTIFICATE",
      pageWidth / 2,
      cursorY,
      { align: "center" }
    );
    cursorY += 8;

    // ===== Table Headers =====
    const headerRow1 = [
      "Date",
      "Dealer’s name and address",
      "Trade certificate number",
      "Description of motor vehicle",
      "Chassis number of Motor Vehicle",
      "Purpose for which vehicle sent out or brought",
      "Driver’s name, licence No. and address and whether he is the employee of the holder of trade certificate",
      "Hours of leaving the premises by the vehicle",
      "Hours of return to premises or reaching destination by the vehicle",
      "Mileage covered between the hours noted in columns (6) and (7)",
      "Signature and designation of the person authorised by the holder",
    ];

    const headerRow2 = ["(1)","(1A)","(2)","(3)","(3A)","(4)","(5)","(6)","(7)","(8)","(9)"];

    // ===== Equal Column Width =====
    const numColumns = headerRow1.length;
    const columnWidth = (pageWidth - 24) / numColumns; // 12mm margin on each side
    const columnStyles = {};
    for (let i = 0; i < numColumns; i++) {
      columnStyles[i] = { cellWidth: columnWidth };
    }

    // ===== Prepare Body Data =====
    const body = [[
      new Date(application.application_date).toLocaleDateString(),      // Date
      application.Dealer?.name || "",                                   // Dealer name
      application.vehicle_detail_id || "",                               // Trade certificate number
      application.VehicleDetail?.VehicleType?.name || "",               // Description of vehicle
      application.VehicleDetail?.chassis_no || "",                       // Chassis number
      application.Purpose || "",                                         // Purpose
      application.DriverName || "",                                      // Driver info
      application.HoursLeaving || "",                                     // Leaving hours
      application.HoursReturn || "",                                      // Return hours
      application.Mileage || "",                                          // Mileage
      application.CreatedUser?.name || ""                                // Authorized person
    ]];

    // ===== Table =====
    autoTable(doc, {
      startY: cursorY + 2,
      head: [headerRow1, headerRow2],
      body: body.length > 0 ? body : Array.from({ length: 12 }, () => new Array(numColumns).fill("")),
      theme: "grid",
      headStyles: {
        fontSize: 9,
        fontStyle: "bold",
        valign: "middle",
        halign: "center",
        fillColor: [255, 255, 255],
        textColor: 20,
        lineWidth: 0.3,
        lineColor: 20,
      },
      bodyStyles:{
        halign: "center",
        valign: "middle",
        fontSize: 9,
        overflow: "linebreak",
        lineWidth: 0.3,
        lineColor:[0,0,0],
        cellPadding: 2,
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        valign: "top",
        overflow: "linebreak",
      },
      columnStyles,
      margin: { left: 12, right: 12 },
      tableWidth: pageWidth - 24,
      drawHeaderRow: (row, data) => {
        // Draw borders only for header
        data.columns.forEach((col) => {
          doc.rect(col.x, row.y, col.width, row.height);
        });
      },
    });

    const pdfBlob = await new Promise((resolve) => {
                const blob = doc.output('blob');
                resolve(blob);
            });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await new Promise((resolve) => {
        setTimeout(() => {
            window.open(pdfUrl);
            resolve();
        }, 1000);
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

export default Form19;
