import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form50 = ({application}) => {

    const {
      vehicleClass,
      maker,
      vehicalBodyType,
      manufactureYear,
      cylinders,
      vehicleChassis,
      engineNo,
      horsePower,
      wheelbase,
      seatingCapacity,
      standingCapacity,
      sleepingCapacity,
      unladenWeight,
      colors,
      grossVehicleWeight,

    } = extractApplicationData(application);

    const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 18;
		const marginRight = 18;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let y = 18;


    const addHierarchicalItem = (mainNum, nestedNum, desc, valueOrDots = true, indentLevel = 0) => {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(10.2);
			const leftColumnWidth = printableWidth - 45;
			const rightColumnX = marginLeft + leftColumnWidth;
			const rightColumnWidth = 50; // Width for right column

			// Indentation for hierarchical items
			const baseIndent = marginLeft;
			const indentPerLevel = 8;
			const currentIndent = baseIndent + indentLevel * indentPerLevel;

			// Full left text
			let fullText = "";
			if (mainNum && nestedNum) fullText = `${mainNum}${nestedNum} ${desc}`;
			else if (mainNum) fullText = `${mainNum} ${desc}`;
			else fullText = desc;

			const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
			const leftLines = doc.splitTextToSize(fullText, availableWidth);
			doc.text(leftLines, currentIndent, y, { lineHeightFactor: 1.35 });

			// Determine if we should show dots and if there's a value to display
			const shouldShowDots = typeof valueOrDots === 'boolean' ? valueOrDots : true;
			const hasValue = (typeof valueOrDots === 'string' || typeof valueOrDots === 'number') && valueOrDots !== '' && valueOrDots !== null && valueOrDots !== undefined;

			let totalBlockHeight = leftLines.length * 3.5;
			let valueLines = [];

			// Handle value display with wrapping
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Split the value text to fit in the right column width
				valueLines = doc.splitTextToSize(valueOrDots.toString(), rightColumnWidth);
				
				// Update total block height to accommodate value lines
				totalBlockHeight = Math.max(totalBlockHeight, valueLines.length * 3.5);
				
				doc.setFont("helvetica", "normal");
			}

			// Right column: dotted line (only if shouldShowDots is true)
			if (shouldShowDots) {
				// Draw dotted lines for each line of content
				const numDottedLines = Math.ceil(totalBlockHeight / 3.5);
				for (let i = 0; i < numDottedLines; i++) {
					// Create longer dotted line to fill the right column properly
					const dottedLine = ".".repeat(45); // Longer dotted line
					doc.text(dottedLine, rightColumnX, y + (i * 3.5), { align: "left" });
				}
			}

			// Draw the value text AFTER the dotted lines (so it appears on top)
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Draw each line of the value
				valueLines.forEach((line, index) => {
					doc.text(line, rightColumnX, y + (index * 3.5) - 1);
				});
				
				doc.setFont("helvetica", "normal");
			}

			y += totalBlockHeight + 3; // move Y below the row
		};

    const addAxleWeightItem = (label) => {
      const leftColumnWidth = printableWidth - 50;
      const rightColumnX = marginLeft + leftColumnWidth;
      
      // Left text
      doc.text(label, marginLeft, y); // small indent
      // Right dotted with kgs.
      const dotted = "Dated................................";
      doc.text(dotted, pageWidth - marginRight, y, { align: "right" });
      
      y += 6;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("FORM 50", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("[Refer Rule 90(3)] ", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    const heading =
      "BILL OF LADING";

    const headingLines = doc.splitTextToSize(heading, printableWidth);
    doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
    y += headingLines.length * 5.2 + 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);


    addAxleWeightItem("Bill No. ........................");
    addHierarchicalItem("", null, "Name and address of the national permit holder","");
    addHierarchicalItem("", null, "Registration number of the motor vehicle","");
    doc.text("Dated...................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    addHierarchicalItem("", null, "Name of the consignor","");
    addHierarchicalItem("", null, "Name of the consignee","");
    addHierarchicalItem("", null, "Point of origin","");
    addHierarchicalItem("", null, "Point of destination","");

  // Define table headers and data
    const header = [
        [
        { content: "Number of articles", styles: { halign: "center" } },
        { content: "Description of goods \nkg.", styles: { halign: "center" } },
        { content: "Freight charges paid \nRs. P", styles: { halign: "center" } },
        { content: "Freight charges to pay Rs. P", styles: { halign: "center" } },
        { content: "Total", styles: { halign: "center" } },
        ],
    ];

    const data = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
    ];
    // AutoTable config
    autoTable(doc, {
        startY: y, // table starts 30mm from top
        
        head: header,
        body: data,
        theme: "grid", // adds borders to header and body
        styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.2,
        },
        headStyles: {
        fillColor: [255, 255, 255], // light gray header background
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        },
        bodyStyles: {
        halign: "left",
        valign: "middle",
        },
        columnStyles: {
        0: { cellWidth: printableWidth * 0.15 }, // first column smaller
        1: { cellWidth: printableWidth * 0.25 }, // description bigger
        2: { cellWidth: printableWidth * 0.25 },
        3: { cellWidth: printableWidth * 0.25 },
        4: { cellWidth: printableWidth * 0.10 },
        },
        tableWidth: 130, // total width
        margin: { left: marginLeft, right: marginRight },
    });
    
    y = doc.lastAutoTable.finalY + 6; // position after table with some space
    doc.text("Bill No. ...........................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    doc.text("Dated .............................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    doc.text("Received ........................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    doc.text("Package .........................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    doc.text("From ..............................................", pageWidth-marginRight, y,{ align : "right" });
    y += 6;
    doc.text("(Truck No. .....................................)", pageWidth-marginRight, y,{ align : "right" });
    y += 12;
    doc.text(".......................................", pageWidth-marginRight - 2, y,{ align : "right" });
    y += 4;
    doc.text("Signature of consignee", pageWidth-marginRight - 3, y,{ align : "right" });
    y += 12;
    doc.text(".....................................",marginLeft, y);
    doc.text("......................................", pageWidth-marginRight -2, y,{ align : "right" });
    y += 4;
    doc.text("Signature of consignor",marginLeft, y);
    doc.text("Signature of the carrier", pageWidth-marginRight - 3, y,{ align : "right" });
    y += 8;
    
    doc.text("* At carrier’s risk",marginLeft, y);
    y += 8;
    
    doc.text("* At owner’s risk",marginLeft, y);
    y += 8;
    doc.text("Value of the goods Rs. .............................",marginLeft, y);
    y += 8;
    doc.text("Value of the goods Rs. .............................",marginLeft, y);
    y += 8;
    doc.text("Delivery at..................................................",marginLeft, y);
    y += 16;
    doc.text("Note : The bill of lading shall be in the proforma given above and shall be in quadruplicate, the original (white) \nto be carried in the motor vehicle, the duplicate (lightgreen) for the consignor, the triplicate (pink) for the \nconsignee and the fourth copy (cream yellow) for record of the national permit holder.", marginLeft ,y);
    y += 16;
    doc.text("* Strike out whichever is inapplicable.", marginLeft ,y);

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
			<Button type="primary" onClick={handleExportPdf}>Export PDF</Button>
		</Typography>
	);
};

export default Form50;