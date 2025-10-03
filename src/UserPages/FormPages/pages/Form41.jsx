import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";

const { Text } = Typography;

const Form41 = ({application}) => {

    const {
        registrationNumber ,
        maker,
        manufactureYear,
        engineNo,
        vehicleChassis,
        cylinders,
        horsePower,
        CC,
        fuel,
        vehicleClass,
        ownerName,
        permanentAddress,
        seatingCapacity,
        standingCapacity,
        sleepingCapacity,
        grossVehicleWeight,
        unladenWeight
    } = extractApplicationData(application);

    const handleExportPdf = async () => {
		const doc = new jsPDF("p", "mm", "a4");
		const pageWidth = doc.internal.pageSize.getWidth();
		const marginLeft = 18;
		const marginRight = 18;
		const printableWidth = pageWidth - marginLeft - marginRight;
		let y = 18;

        const addTitle = (t, size = 11, style = "bold") => {
			doc.setFont("helvetica", style);
			doc.setFontSize(size);
			doc.text(t, pageWidth / 2, y, { align: "center" });
			y += 6;
		};

        const addItem = (numText, desc, withRightDots = true) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.2);
          
            const leftColumnWidth = printableWidth - 50; // 50mm reserved for right column
            const rightColumnX = marginLeft + leftColumnWidth;
          
            // Add number + description in left column
            const leftLines = doc.splitTextToSize(numText ? `${numText} ${desc}` : desc, leftColumnWidth);
            doc.text(leftLines, marginLeft, y, { lineHeightFactor: 1.35 });
          
            // Add right column dots if needed
            if (withRightDots) {
              const blockHeight = leftLines.length * 5.2; // approximate height
              doc.text("....................................", rightColumnX, y, { align: "left" });
              y += blockHeight + 3; // move Y below the row
            } else {
              y += leftLines.length * 5.2 + 3; // move Y below the row
            }
          };

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

			let totalBlockHeight = leftLines.length * 5.2;
			let valueLines = [];

			// Handle value display with wrapping
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Split the value text to fit in the right column width
				valueLines = doc.splitTextToSize(valueOrDots.toString(), rightColumnWidth);
				
				// Update total block height to accommodate value lines
				totalBlockHeight = Math.max(totalBlockHeight, valueLines.length * 5.2);
				
				doc.setFont("helvetica", "normal");
			}

			// Right column: dotted line (only if shouldShowDots is true)
			if (shouldShowDots) {
				// Draw dotted lines for each line of content
				const numDottedLines = Math.ceil(totalBlockHeight / 5.2);
				for (let i = 0; i < numDottedLines; i++) {
					// Create longer dotted line to fill the right column properly
					const dottedLine = ".".repeat(45); // Longer dotted line
					doc.text(dottedLine, rightColumnX, y + (i * 5.2), { align: "left" });
				}
			}

			// Draw the value text AFTER the dotted lines (so it appears on top)
			if (hasValue) {
				doc.setFont("helvetica", "bold");
				doc.setFontSize(10.2);
				
				// Draw each line of the value
				valueLines.forEach((line, index) => {
					doc.text(line, rightColumnX, y + (index * 5.2) - 1); // Slightly above dotted line
				});
				
				doc.setFont("helvetica", "normal");
			}

			y += totalBlockHeight + 3; // move Y below the row
		};


          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          doc.text("FORM 41", pageWidth / 2, y, { align: "center" });
          y += 6;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10.5);
          doc.text("[Refer Rule 75]", pageWidth / 2, y, { align: "center" });
          y += 8;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          const heading =
            "STATE REGISTER OF MOTOR VEHICLES";

          const headingLines = doc.splitTextToSize(heading, printableWidth);
          doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += headingLines.length * 5.2 + 8;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          addHierarchicalItem("1.", null, "Registration No.", `${registrationNumber}`);
          addHierarchicalItem("2.", null, " Previous registration number, if any", "");
          addHierarchicalItem("3.", null, "Whether the motor vehicle is—", false);
          addHierarchicalItem("", null, "\t(a) new vehicle", "");
          addHierarchicalItem("", null, "\t(b) imported vehicle", "");
          addHierarchicalItem("", null, "\t(c) ex-army vehicle", "");
          addHierarchicalItem("4.", null, "Maker’s name",`${maker}`);
          addHierarchicalItem("5.", null, " Year of manufacture", `${manufactureYear}`);
          addHierarchicalItem("6.", null, "Engine No. or motor number in the case of Battery Operated Vehicles", `${engineNo}`);
          addHierarchicalItem("7.", null, "Chassis No.", `${vehicleChassis}`);
          addHierarchicalItem("8.", null, "Number of cylinders", `${cylinders}`);
          addHierarchicalItem("9.", null, "Cubic capacity/horse power", `${CC} / ${horsePower} `);
          addHierarchicalItem("10.", null, "Type of fuel used", `${fuel}`);
          addHierarchicalItem("11.", null, "Class of motor vehicle", `${vehicleClass}`);
          addHierarchicalItem("12.", null, "Name and full address of the registered owner", `${ownerName} / ${permanentAddress}`);
          addHierarchicalItem("13.", null, "Seating capacity including driver",`${seatingCapacity}`);
          addHierarchicalItem("13A.", null, "Standing capacity",`${standingCapacity}`);
          addHierarchicalItem("13B.", null, "Sleeper capacity",`${sleepingCapacity}`);
          addHierarchicalItem("14.", null, "Gross vehicle weight",`${grossVehicleWeight}`);
          addHierarchicalItem("15.", null, "Unladen weight",`${unladenWeight}`);
             
        y += 25;
        doc.text("Dated .........................",marginLeft ,y);
        doc.text("Signature of the applicant", pageWidth-marginRight, y, { align: "right" })

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

export default Form41;