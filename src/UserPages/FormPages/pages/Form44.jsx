import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form44 = ({application}) => {

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
    doc.text("FORM 44", pageWidth / 2, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.text("[Refer Rule 78(1)]", pageWidth / 2, y, { align: "center" });
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12.5);
    const heading =
      "INTIMATION OF CHANGES OF STATE OF RESIDENCE AND APPLICATION \nFOR ASSIGNMENT OF FRESH REGISTRATION MARK BY OR ON BEHALF \nOF DIPLOMATIC OR CONSULAR OFFICER\n(To be submitted in triplicate)";

    const headingLines = doc.splitTextToSize(heading, printableWidth);
    doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
    y += headingLines.length * 5.2 + 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text("To The Registering Authority,", marginLeft, y);
    y += 6;
    doc.text("...............................................", marginLeft, y);
    y += 10;
    doc.text("\tI............................................(Name and designation) of the ...........................being the owner \nof..........................motor vehicle No...........................registered at............................ under section \n42 of the Motor Vehicles Act, 1988, hereby declare that I have, since the.......... day of .........20........... \nkept the said vehicle in the State of..................................and hereby apply for assignment to the motor \nvehicle of a fresh registration mark.", marginLeft, y);
    y += 26;
    doc.text("\tMy mobile number is .............................................", marginLeft, y);
    y += 8;
    doc.text("\tI enclose the certificate of registration and the certificate of fitness* of the vehicle.", marginLeft, y);
    y += 12;
    doc.text("Date .......................", marginLeft, y);
    doc.text("Signature of the owner", pageWidth - marginRight, y , { align : "right" });
    y += 8;
    doc.text("* Strike out the words “and the certificate of fitness” if inapplicable",marginLeft, y);
    y += 12;

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12);
    doc.text("FOR USE IN THE MINISTRY OF EXTERNAL AFFAIRS (PROTOCOL DIVISION)\nOR IN THE OFFICE OF THE CHIEF SECRETARY OF THE STATE\nGOVERNMENT CONCERNED", pageWidth / 2, y , { align : "center" });
    y += 18;
    
    doc.setFont("helvetica", "normal")

    doc.text("\tCertified that........................................(Name and designation) continues to hold the status of \na diplomatic officer/consular officer.", marginLeft ,y);
    y += 16;
    doc.text("\tHe/She is at present stationed at ................................................", marginLeft ,y);
    y += 12;

    doc.text("Place............................", marginLeft ,y);
    doc.text("Designation..........................................",  pageWidth - marginRight ,y , { align : "right" });
    y += 8;
    doc.text("Date ............... 20 .....", marginLeft ,y);
    doc.text("Signature of the officer ",  pageWidth - marginRight - 28.5,y , { align : "right" });

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

export default Form44;