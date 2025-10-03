import React from "react";
import { Button, Typography } from "antd";
import jsPDF from "jspdf";
import { extractApplicationData } from "@/utils/FormData";
import { CgYinyang } from "react-icons/cg";

const { Text } = Typography;

const Form42 = ({application}) => {

    const {
        vehicalBodyType,
        vehicleClass,
        maker,
        manufactureYear,
        cylinders,
        horsePower,
        wheelbase,
        vehicleChassis,
        engineNo,
        seatingCapacity,
        sleepingCapacity,
        standingCapacity,
        unladenWeight,
        grossVehicleWeight,
        colors,

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
          
            const leftColumnWidth = printableWidth - 50; // leave space for right column
            const rightColumnX = marginLeft + leftColumnWidth;
            const rightColumnWidth = 50;
          
            // Indentation for hierarchy
            const baseIndent = marginLeft;
            const indentPerLevel = 8;
            const currentIndent = baseIndent + indentLevel * indentPerLevel;
          
            // Prepare left text
            let fullText = "";
            if (mainNum && nestedNum) fullText = `${mainNum}${nestedNum} ${desc}`;
            else if (mainNum) fullText = `${mainNum} ${desc}`;
            else fullText = desc;
          
            // Split into lines
            const availableWidth = leftColumnWidth - (currentIndent - marginLeft);
            const leftLines = doc.splitTextToSize(fullText, availableWidth);
          
            // Draw left text
            doc.text(leftLines, currentIndent, y, { lineHeightFactor: 1.35 });
          
            // Check value and dots behavior
            const hasValue = (typeof valueOrDots === "string" || typeof valueOrDots === "number") && valueOrDots !== "" && valueOrDots !== null && valueOrDots !== undefined;
            const shouldShowDots = typeof valueOrDots === "boolean" ? valueOrDots : true;
          
            // Metrics
            const lineHeight = 5.2;
            const leftHeight = leftLines.length * lineHeight;
            const anchorY = y + (Math.max(1, leftLines.length) - 1) * lineHeight; // last line of left block
            const valueDotsGap = 1; // gap between value and dot baseline
          
            // Prepare value lines
            let valueLines = [];
            if (hasValue) {
              valueLines = doc.splitTextToSize(valueOrDots.toString(), rightColumnWidth);
            } else {
              valueLines = [""]; // still anchor for dots if enabled
            }
            const valueHeight = Math.max(1, valueLines.length) * lineHeight;
          
            // Draw a single dotted guide line only once (not per wrapped line)
            if (shouldShowDots) {
              const dotWidth = doc.getTextWidth(".");
              const dotsCount = Math.max(0, Math.floor(rightColumnWidth / dotWidth));
              if (dotsCount > 0) {
                const fullDots = ".".repeat(dotsCount);
                doc.text(fullDots, rightColumnX, anchorY + valueDotsGap, { align: "left" });
              }
            }
          
            // Overlay value on top (can wrap to multiple lines starting at anchor)
            if (hasValue) {
              doc.setFont("helvetica", "bold");
              valueLines.forEach((line, index) => {
                doc.text(line, rightColumnX, anchorY + index * lineHeight, { align: "left" });
              });
              doc.setFont("helvetica", "normal");
            }
          
            // Move Y down after the tallest block
            const blockHeight = Math.max(leftHeight, (anchorY - y) + valueHeight) + 3 + valueDotsGap;
            y += blockHeight;
          };

          const addAxleWeightItem = (label, value = "") => {
            const leftColumnWidth = printableWidth - 50;
            const rightColumnX = marginLeft + leftColumnWidth;
            
            // Left text
            doc.text(label, marginLeft, y); // small indent
            
            // Right side - show value if provided, otherwise show dots
            if (value && value !== "") {
              // Show value with kgs.
              doc.setFont("helvetica", "bold");
              doc.text(`${value} kgs.`, pageWidth - marginRight , y, { align: "right" });
              doc.setFont("helvetica", "normal");
            } else {
              // Show dotted line with kgs.
              const dotted = "........................................kgs.";
              doc.text(dotted, pageWidth - marginRight , y, { align: "right" });
            }
            
            y += 6;
          };

          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          doc.text("FORM 42", pageWidth / 2, y, { align: "center" });
          y += 6;
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10.5);
          doc.text("[Refer Rule 76(1)]", pageWidth / 2, y, { align: "center" });
          y += 8;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12.5);
          const heading =
            "APPLICATION FOR REGISTRATION OF MOTOR VEHICLE BY OR ON\nBEHALF OF DIPLOMATIC/CONSULAR OFFICER";
          const subheading =
            "(To be forwarded through the competent authority in triplicate)";

          const headingLines = doc.splitTextToSize(heading, printableWidth);
          const subheadinglines = doc.splitTextToSize(subheading, printableWidth);

          doc.text(headingLines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += headingLines.length * 5.2 + 4;
          doc.text(subheadinglines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += headingLines.length * 5.2 + 1;


          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          doc.text("To", marginLeft, y);
          y += 6;
          doc.text("\tThe Registering Authority,", marginLeft, y);
          y += 6;
          doc.text("\t..........................................................", marginLeft, y);
          y += 10;

          doc.text("Namely:—", marginLeft, y);
          y += 10;

          addHierarchicalItem("1.", null, " Full name, designation and address of the diplomatic officer/consular officer/full name, address and station of the diplomatic mission/consular office or post", "");
          addHierarchicalItem("2.", null, "Age of the person to be registered as registered owner", "");
          addHierarchicalItem("2A.", null, "Mobile number of the person to be registered as registered owner", "");
          addHierarchicalItem("3.", null, "Name and address of the person from whom the vehicle was purchased/name of the port through which the vehicle was imported/name of the person or company from whose bonded stocks the vehicle was purchased and the name of the port", "");
          addHierarchicalItem("4.", null, "Country from which imported", "");
          addHierarchicalItem("5.", null, "Class of vehicle", `${vehicleClass}`);
          addHierarchicalItem("6.", null, "Type of body", `${vehicalBodyType}`);
          addHierarchicalItem("7.", null, "Maker’s name", `${maker}`);
          addHierarchicalItem("8.", null, "Year of manufacture", `${manufactureYear}`);
          addHierarchicalItem("9.", null, "Number of cylinders", `${cylinders}`);
          addHierarchicalItem("10.", null, "Horse power", `${horsePower}`);
          addHierarchicalItem("11.", null, "Maker’s classification or if not known, wheel base", `${wheelbase}`);
          addHierarchicalItem("12.", null, "Chassis No.", `${vehicleChassis}`);
          addHierarchicalItem("13.", null, "Engine No. or motor number in the case of Battery Operated Vehicles", `${engineNo}`);
          addHierarchicalItem("14.", null, "Seating capacity (including driver)", `${seatingCapacity}`);
          addHierarchicalItem("14A.", null, "Standing capacity", `${standingCapacity}`);
          addHierarchicalItem("14B.", null, "Sleeper capacity", `${sleepingCapacity}`);
          addHierarchicalItem("15.", null, "Unladen weight", `${unladenWeight}`);
          
          doc.addPage();
          y = 18;
          
          addHierarchicalItem("16.", null, "Particulars of previous registration and registered number(if any)", "");
          addHierarchicalItem("17.", null, "I hereby declare that the vehicle has not been registered in any other State in India", "");
          addHierarchicalItem("18.", null, "Colour or colours of body, wings and front end", `${colors}`);
          addHierarchicalItem("19.", null, "Number, description and size of tyres :", false);
          addHierarchicalItem("", null, "\t(a) Front axle", "");
          addHierarchicalItem("", null, "\t(b) Rear axle", "");
          addHierarchicalItem("", null, "\t(c) Any other axle", "");
          addAxleWeightItem("20. Maximum laden weight", grossVehicleWeight);
          addHierarchicalItem("21.", null, "Maximum axle weight (to be furnished in the case ofheavy motor", false);
          addHierarchicalItem("", null, "vehicles only):—", false);
          addAxleWeightItem("\t(a) Front axle", "");
          addAxleWeightItem("\t(b) Rear axle", "");
          addAxleWeightItem("\t(c) Any other axle", "");

          doc.text("\tThe above particulars are to be filled in for a rigid frame motor vehicle of two or more axles",marginLeft,y)
          y += 15;
          
          doc.text("..............................................", pageWidth-marginRight , y ,{ align : "right" });
          y += 4;
          doc.text("Signature of the applicant", pageWidth-marginRight - 3 , y ,{ align : "right" });
          y += 12;

          const footer =
            "FOR USE IN THE MINISTRY OF EXTERNAL AFFAIRS (PROTOCOL DIVISION)";
          const subfooter =
            "OR IN THE OFFICE OF THE CHIEF SECRETARY OF THE\nSTATE GOVERNMENT CONCERNED";

          const footerlines = doc.splitTextToSize(footer, printableWidth);
          const sybfooterlines = doc.splitTextToSize(subfooter, printableWidth);

          doc.setFontSize(12);
          doc.text(footerlines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += sybfooterlines.length * 2.5 ;
          doc.text(sybfooterlines, pageWidth / 2, y, { align: "center", lineHeightFactor: 1.2 });
          y += sybfooterlines.length * 5.2 + 3;

          doc.setFontSize(11);
          doc.text("\tCertified that..............(name and designation) is a diplomatic officer/consular officer recognised by \nthe Government of India and that he/she is not entitled to exemption from payment of registration fees.", marginLeft ,y);
        y += 15;
        doc.text("Place..........................",marginLeft ,y);
        doc.text("Signature of the applicant.........................................", pageWidth-marginRight, y, { align: "right" })
        
        y += 8;
        doc.text("Date...........................",marginLeft ,y);
        doc.text("Designation................................................................", pageWidth-marginRight, y, { align: "right" })
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

export default Form42;