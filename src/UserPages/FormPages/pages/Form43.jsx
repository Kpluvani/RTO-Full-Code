import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form43 = ({application}) => {

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
			const leftColumnWidth = printableWidth - 50;
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
      doc.text(label, marginLeft + 5, y); // small indent
      // Right dotted with kgs.
      const dotted = "........................................kgs.";
      doc.text(dotted, pageWidth - marginRight - 3, y, { align: "right" });
      
      y += 6;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("FORM 43", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("[Refer Rule 76(4)]", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    const heading =
      "CERTIFICATE OF REGISTRATION OF MOTOR VEHICLE BELONGING TO \nA DIPLOMATIC OR CONSULAR OFFICER";

    const headingLines = doc.splitTextToSize(heading, printableWidth);
    doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
    y += headingLines.length * 5.2 + 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text("Registered No. ..........................", marginLeft, y);
    y += 6;
    doc.text("\tBrief description of vehicle, (e.g. Fiat 1100 or Hi ustan nd Landmaster car, Willys Jeeps, Dodge\n/Desoto/Gadga petrol i truck, L 36 seater i bus, trail /d esel eyland d esel er, etc.)", marginLeft, y);
    y += 10;
    doc.text("\tFull name, designation and address of the diplomatic officer/consular officer/full \nname, address and station of the diplomaticmission/consular officer or post.............................", marginLeft, y);
    y += 16;
    doc.text("..........................................................", pageWidth - marginRight, y , { align : "right" });
    y += 4;
    doc.text("Transferred to................................", marginLeft, y);
    doc.text("Signature of the Registering Authority ", pageWidth - marginRight, y , { align : "right" });
    y += 8;

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12);
    doc.text("DETAILED DESCRIPTION", pageWidth / 2, y , { align : "center" });
    y += 10;
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11);
    addHierarchicalItem("1.", null, "Class of vehicle",`${vehicleClass || ''}`);
    addHierarchicalItem("2.", null, "Maker’s name", `${maker || ''}`);
    addHierarchicalItem("3.", null, "Type of body",`${vehicalBodyType || ''}`);
    addHierarchicalItem("4.", null, "Year of manufacture",`${manufactureYear || ''}`);
    addHierarchicalItem("5.", null, "Number of cylinders",`${cylinders || ''}`);
    addHierarchicalItem("6.", null, "Chassis number",`${vehicleChassis || ''}`);
    addHierarchicalItem("7.", null, "Engine number or motor number in the case of Battery Operated Vehicles",`${engineNo || ''}`);
    addHierarchicalItem("8.", null, "Horse power", `${horsePower || ''}`);
    addHierarchicalItem("9.", null, "Maker’s classification, or if not known, wheel base", `${wheelbase || ''}`);
    addHierarchicalItem("10.", null, "Seating capacity (including driver)", `${seatingCapacity || ''}`);
    addHierarchicalItem("10A.", null, "Standing capacity", `${standingCapacity || ''}`);
    addHierarchicalItem("10B.", null, "Sleeper capacity",`${sleepingCapacity || ''}`);
    addHierarchicalItem("11.", null, "Unladen weight",`${unladenWeight || ''}`);
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12);
    y += 2;
    doc.text("ADDITIONAL PARTICULARS IN THE CASE OF ALL TRANSPORT VEHICLES", pageWidth / 2, y , { align : "center" });
    y += 8;
    
    doc.setFont("helvetica", "normal")
    addHierarchicalItem("12.", null, "Colour or colours of body, wings and front end",`${colors || ''}`);
    addHierarchicalItem("13.", null, "Registered laden weight",`${grossVehicleWeight || ''}`);
    addHierarchicalItem("14.", null, " Number, description and size of tyres—", false);
    addHierarchicalItem("", null, "\t(a) Front axle", "");
    addHierarchicalItem("", null, "\t(b) Rear axle", "");
    addHierarchicalItem("", null, "\t(c) Any other axle", "");
    addHierarchicalItem("15.", null, "Registered axle weight (in the case of heavy motor vehicles only)", false);
    addAxleWeightItem("(a) Front axle");
    addAxleWeightItem("(b) Rear axle");
    addAxleWeightItem("(c) Any other axle");

    y += 4;
    doc.text(".................................................", pageWidth - marginRight ,y, { align : "right" });
    y += 4;

    doc.text("Date ............... 20 .....", marginLeft ,y);
    doc.text("Signature of registering authority",  pageWidth - marginRight ,y , { align : "right" });

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

export default Form43;